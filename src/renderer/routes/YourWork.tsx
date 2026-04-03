import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Avatar from '@atlaskit/avatar';
import AvatarGroup, { type AvatarProps } from '@atlaskit/avatar-group';
import Badge from '@atlaskit/badge';
import Button from '@atlaskit/button/new';
import { Code } from '@atlaskit/code';
import CheckCircleIcon from '@atlaskit/icon/core/check-circle';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import ClockIcon from '@atlaskit/icon/core/clock';
import CommentIcon from '@atlaskit/icon/core/comment';
import PullRequestIcon from '@atlaskit/icon/core/pull-request';
import StatusWarningIcon from '@atlaskit/icon/core/status-warning';
import TasksIcon from '@atlaskit/icon/core/tasks';
import StatusWorkflowDangerIcon from '@atlaskit/icon-lab/core/status-workflow-danger';
import { BitbucketIcon } from '@atlaskit/logo';
import Lozenge from '@atlaskit/lozenge';
import { Box, Flex, Inline, Stack, Text, xcss } from '@atlaskit/primitives';
import Spinner from '@atlaskit/spinner';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { formatDistanceToNowStrict, isValid, parseISO } from 'date-fns';

import { useBitbucketYourWork } from '../hooks/useBitbucketYourWork';
import { useSettingsStore } from '../stores';

import { Contents } from '../components/layout/Contents';
import { Page } from '../components/layout/Page';

import type { Link } from '../types';
import type {
  BitbucketBuildState,
  BitbucketCommitStatus,
  BitbucketWorkItem,
} from '../utils/api/bitbucket/types';

import { openExternalLink } from '../utils/system/comms';
import { isLightMode } from '../utils/ui/theme';

// \u2500\u2500\u2500 Build Status \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

interface BuildStatusIconProps {
  state: BitbucketBuildState | null | undefined;
  tooltipContent?: string;
}

const BuildStatusIcon: FC<BuildStatusIconProps> = ({
  state,
  tooltipContent,
}) => {
  if (!state) {
    return null;
  }

  switch (state) {
    case 'SUCCESSFUL':
      return (
        <Tooltip content={tooltipContent ?? 'Build passed'} position="top">
          <CheckCircleIcon
            color={token('color.icon.success')}
            label="Build passed"
          />
        </Tooltip>
      );
    case 'FAILED':
      return (
        <Tooltip content={tooltipContent ?? 'Build failed'} position="top">
          <StatusWorkflowDangerIcon
            color={token('color.icon.danger')}
            label="Build failed"
          />
        </Tooltip>
      );
    case 'INPROGRESS':
      return (
        <Tooltip content={tooltipContent ?? 'Build in progress'} position="top">
          <ClockIcon
            color={token('color.icon.information')}
            label="Build in progress"
          />
        </Tooltip>
      );
    case 'STOPPED':
      return (
        <Tooltip content={tooltipContent ?? 'Build stopped'} position="top">
          <StatusWarningIcon
            color={token('color.icon.warning')}
            label="Build stopped"
          />
        </Tooltip>
      );
    default:
      return null;
  }
};

// --- Build helpers -----------------------------------------------------------

// Derive the worst overall build state from an array of commit statuses.
// Priority: FAILED > INPROGRESS > STOPPED > SUCCESSFUL
const BUILD_STATE_PRIORITY: Record<BitbucketBuildState, number> = {
  FAILED: 4,
  INPROGRESS: 3,
  STOPPED: 2,
  SUCCESSFUL: 1,
};

function buildSummaryTooltip(statuses: BitbucketCommitStatus[]): string {
  if (!statuses.length) {
    return '';
  }

  const total = statuses.length;
  const counts: Partial<Record<BitbucketBuildState, number>> = {};
  for (const s of statuses) {
    counts[s.state] = (counts[s.state] ?? 0) + 1;
  }

  const parts: string[] = [];
  if (counts.FAILED) {
    parts.push(`${counts.FAILED} of ${total} failed`);
  }
  if (counts.INPROGRESS) {
    parts.push(`${counts.INPROGRESS} of ${total} in progress`);
  }
  if (counts.STOPPED) {
    parts.push(`${counts.STOPPED} of ${total} stopped`);
  }
  if (counts.SUCCESSFUL) {
    parts.push(`${counts.SUCCESSFUL} of ${total} passed`);
  }

  return parts.join(', ');
}

function deriveOverallBuildState(
  statuses: BitbucketCommitStatus[],
): BitbucketBuildState | null {
  if (!statuses.length) {
    return null;
  }

  return statuses.reduce((worst, s) =>
    BUILD_STATE_PRIORITY[s.state] > BUILD_STATE_PRIORITY[worst.state]
      ? s
      : worst,
  ).state;
}

// --- PR Row ------------------------------------------------------------------

const rowStyles = xcss({
  cursor: 'pointer',
  paddingBlock: 'space.075',
  paddingInline: 'space.150',
  ':hover': {
    backgroundColor: 'color.background.neutral.subtle.hovered',
  },
});

const metaTextStyles = xcss({
  color: 'color.text.subtlest',
});

function formatRelativeDate(iso: string | null): string {
  if (!iso) {
    return '';
  }

  const parsed = parseISO(iso);

  return isValid(parsed)
    ? formatDistanceToNowStrict(parsed, { addSuffix: true })
    : '';
}

interface PullRequestRowProps {
  item: BitbucketWorkItem;
}

const PullRequestRow: FC<PullRequestRowProps> = ({ item }) => {
  const repoName = item.destination.repository.name;
  const commitStatuses = item.extra?.commit_statuses ?? [];
  const overallBuildState = deriveOverallBuildState(commitStatuses);
  const summaryTooltip = buildSummaryTooltip(commitStatuses);
  const createdOn = formatRelativeDate(item.created_on);
  const updatedOn = formatRelativeDate(item.updated_on);

  const lastCommentAt = formatRelativeDate(item.extra?.last_comment ?? null);

  const destBranch = item.destination?.branch?.name;

  const reviewerAvatars: AvatarProps[] = (item.reviewers ?? []).map((r) => ({
    name: r.display_name,
    src: r.links.avatar.href,
  }));

  return (
    <Box
      as="button"
      onClick={() => openExternalLink(item.links.html.href as Link)}
      testId={`pr-row-${item.id}`}
      xcss={rowStyles}
    >
      <Inline alignBlock="center" space="space.100">
        {/* Author avatar + content — grows to fill, pushes build status to far right */}
        <Inline alignBlock="start" grow="fill" space="space.100">
          {/* Author avatar */}
          <Tooltip content={item.author.display_name} position="right">
            <Avatar
              appearance="circle"
              name={item.author.display_name}
              size="medium"
              src={item.author.links.avatar.href}
            />
          </Tooltip>

          {/* Content column */}
          <Inline>
            <Stack space="space.050">
              {/* Lozenges */}
              <Inline alignBlock="center" space="space.075">
                {item.draft && <Lozenge appearance="default">Draft</Lozenge>}
                {item.extra?.state === 'STALE' && (
                  <Lozenge appearance="moved">Stale</Lozenge>
                )}
                {item.state === 'MERGED' && (
                  <Lozenge appearance="success" isBold>
                    Merged
                  </Lozenge>
                )}
                {item.state === 'DECLINED' && (
                  <Lozenge appearance="removed" isBold>
                    Declined
                  </Lozenge>
                )}
              </Inline>

              {/* Title + dest branch — flows as inline text, wraps naturally */}
              <Text align="start" weight="medium">
                {item.title}
                {destBranch && (
                  <>
                    {' '}
                    → <Code>{destBranch}</Code>
                  </>
                )}
              </Text>

              {/* Repo + PR number */}
              <Inline
                alignBlock="center"
                grow="fill"
                shouldWrap
                space="space.050"
                xcss={metaTextStyles}
              >
                <BitbucketIcon label="" size="xxsmall" />
                <Text size="small">#{item.id}:</Text>
                <Text size="small">updated {updatedOn}</Text>
                <Text size="small">
                  in <Code>{repoName}</Code>
                </Text>
              </Inline>

              {/* Meta row: created, last comment, counts, reviewer avatars */}
              <Inline alignBlock="center" separator="•" space="space.100">
                {createdOn && (
                  <Inline space="space.100" xcss={metaTextStyles}>
                    <Tooltip
                      content={`Created on ${createdOn}`}
                      position="bottom"
                    >
                      <Inline alignBlock="center" space="space.050">
                        <PullRequestIcon
                          color="currentColor"
                          label=""
                          size="small"
                        />
                        <Text size="small">created {createdOn}</Text>
                      </Inline>
                    </Tooltip>
                  </Inline>
                )}

                {item.comment_count > 0 && (
                  <Tooltip
                    content={`Last comment ${lastCommentAt}`}
                    position="bottom"
                  >
                    <Inline
                      alignBlock="center"
                      space="space.050"
                      xcss={metaTextStyles}
                    >
                      <CommentIcon color="currentColor" label="" size="small" />
                      <Text size="small">{item.comment_count}</Text>{' '}
                    </Inline>
                  </Tooltip>
                )}

                {item.task_count > 0 && (
                  <Inline
                    alignBlock="center"
                    space="space.050"
                    xcss={metaTextStyles}
                  >
                    <TasksIcon color="currentColor" label="" size="small" />
                    <Text size="small">{item.task_count}</Text>
                  </Inline>
                )}

                {reviewerAvatars.length > 0 && (
                  <span onClick={(e) => e.stopPropagation()} role="none">
                    <AvatarGroup
                      appearance="stack"
                      data={reviewerAvatars}
                      maxCount={3}
                      size="small"
                    />
                  </span>
                )}
              </Inline>
            </Stack>
          </Inline>
        </Inline>

        {/* Build status — vertically centered, pinned right */}
        <BuildStatusIcon
          state={overallBuildState}
          tooltipContent={summaryTooltip || undefined}
        />
      </Inline>
    </Box>
  );
};

// \u2500\u2500\u2500 Collapsible Section \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

const sectionHeaderStyles = xcss({
  cursor: 'pointer',
  paddingBlock: 'space.075',
  paddingInlineEnd: 'space.100',
  paddingInlineStart: 'space.100',
});

interface SectionProps {
  heading: string;
  items: BitbucketWorkItem[];
}

const Section: FC<SectionProps> = ({ heading, items }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (items.length === 0) {
    return null;
  }

  const headerBg = isLightMode()
    ? 'color.background.accent.blue.subtler'
    : 'color.background.accent.gray.subtler';
  const headerBgHover = isLightMode()
    ? 'color.background.accent.blue.subtler.hovered'
    : 'color.background.accent.gray.subtler.hovered';

  const headerStyles = xcss({
    backgroundColor: headerBg,
    ':hover': {
      backgroundColor: headerBgHover,
    },
  });

  const ChevronIcon = isVisible ? ChevronDownIcon : ChevronRightIcon;

  return (
    <Stack>
      <Box
        as="div"
        onClick={() => setIsVisible((v) => !v)}
        testId={`section-${heading}`}
        xcss={[sectionHeaderStyles, headerStyles]}
      >
        <Flex alignItems="center" justifyContent="space-between">
          <Inline alignBlock="center" space="space.100">
            <ChevronIcon color="currentColor" label="" />
            <span className="font-medium text-sm">{heading}</span>
            <Badge>{items.length}</Badge>
          </Inline>
        </Flex>
      </Box>

      {isVisible &&
        items.map((item) => (
          <PullRequestRow item={item} key={`${item.workspace}-${item.id}`} />
        ))}
    </Stack>
  );
};

// \u2500\u2500\u2500 Route \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

export const YourWorkRoute: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const bitbucketWorkspaces = useSettingsStore((s) => s.bitbucketWorkspaces);

  const { isLoading, items, error } = useBitbucketYourWork();

  if (bitbucketWorkspaces.length === 0) {
    return (
      <Page testId="your-work">
        <Contents>
          <Box padding="space.200">
            <Stack alignInline="center" space="space.200">
              <PullRequestIcon label="" size="medium" />
              <Text align="center">{t('your_work.configure')}</Text>
              <Button
                appearance="primary"
                onClick={() => navigate('/settings')}
              >
                {t('your_work.open_settings')}
              </Button>
            </Stack>
          </Box>
        </Contents>
      </Page>
    );
  }

  if (isLoading) {
    return (
      <Page testId="your-work">
        <Contents>
          <Box padding="space.200">
            <Stack alignInline="center">
              <Spinner label={t('loading.heading')} size="medium" />
            </Stack>
          </Box>
        </Contents>
      </Page>
    );
  }

  if (error) {
    return (
      <Page testId="your-work">
        <Contents>
          <Box padding="space.200">
            <Text>{t('your_work.error')}</Text>
          </Box>
        </Contents>
      </Page>
    );
  }

  const authored = items.filter((i) => i.role === 'AUTHOR');
  const reviewing = items.filter((i) => i.role === 'REVIEWER');
  const closed = items.filter((i) => i.role === 'CLOSED');

  if (authored.length === 0 && reviewing.length === 0 && closed.length === 0) {
    return (
      <Page testId="your-work">
        <Contents>
          <Box padding="space.200">
            <Stack alignInline="center" space="space.100">
              <PullRequestIcon label="" size="medium" />
              <Text align="center">{t('your_work.empty')}</Text>
            </Stack>
          </Box>
        </Contents>
      </Page>
    );
  }

  return (
    <Page testId="your-work">
      <Contents>
        <Stack>
          <Section heading={t('your_work.reviewing')} items={reviewing} />
          <Section heading={t('your_work.authored')} items={authored} />
          <Section heading={t('your_work.closed')} items={closed} />
        </Stack>
      </Contents>
    </Page>
  );
};
