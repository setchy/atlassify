import type { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';

import Badge from '@atlaskit/badge';
import Button, { IconButton } from '@atlaskit/button/new';
import { IconTile } from '@atlaskit/icon';
import StrokeWeightLargeIcon from '@atlaskit/icon/core/stroke-weight-large';
import { Box, Flex, Inline, xcss } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

import type { FilterDetails } from '../../utils/notifications/filters/types';

import { formatProperCase } from '../../utils/notifications/formatters';
import { cn } from '../../utils/ui/cn';
import { getChevronDetails } from '../../utils/ui/display';
import { isLightMode } from '../../utils/ui/theme';

export interface NotificationGroupHeaderProps {
  name: string;
  count: number;
  filterDetails: FilterDetails;
  isVisible: boolean;
  onToggle: () => void;
  onOpenHome?: () => void;
  onMarkAllRead: () => void;
}

export const NotificationGroupHeader = ({
  name,
  count,
  filterDetails,
  isVisible,
  onToggle,
  onOpenHome,
  onMarkAllRead,
}: NotificationGroupHeaderProps) => {
  const { t } = useTranslation();
  const formattedName = formatProperCase(name);

  const Chevron = getChevronDetails(true, isVisible, 'product');
  const ChevronIcon = Chevron.icon;

  const boxStyles = xcss({
    transitionDuration: '200ms',
    backgroundColor: isLightMode()
      ? 'color.background.accent.blue.subtlest'
      : 'color.background.accent.gray.subtlest',
    ':hover': {
      backgroundColor: isLightMode()
        ? 'color.background.accent.blue.subtlest.hovered'
        : 'color.background.accent.gray.subtlest.hovered',
    },
  });

  const handleHomeClick = (event: MouseEvent<HTMLElement>) => {
    if (onOpenHome) {
      event.stopPropagation();
      onOpenHome();
    }
  };

  const handleMarkAllReadClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    onMarkAllRead();
  };

  return (
    <Box
      as="div"
      onClick={onToggle}
      paddingBlock="space.050"
      paddingInlineEnd="space.100"
      paddingInlineStart="space.050"
      xcss={boxStyles}
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Tooltip
          content={
            onOpenHome
              ? t('notifications.product.open_product', {
                  name: formattedName,
                })
              : ''
          }
          position="right"
        >
          <Button
            appearance="subtle"
            onClick={handleHomeClick}
            testId="group-home"
          >
            <Inline alignBlock="center" space="space.100">
              {filterDetails.icon && (
                <IconTile
                  appearance="blue"
                  icon={filterDetails.icon}
                  label=""
                  size="16"
                />
              )}
              {filterDetails.logo && (
                <filterDetails.logo
                  appearance="brand"
                  shouldUseNewLogoDesign
                  size="xxsmall"
                />
              )}
              {filterDetails.heroicon && (
                <filterDetails.heroicon
                  className={cn(
                    'size-4 p-px rounded border',
                    'text-atlassify-heroicon-selected-outline bg-atlassify-heroicon-selected-background border-atlassify-heroicon-selected-background',
                  )}
                />
              )}
              <span className="font-medium">{formattedName}</span>
              <Badge max={false}>{count}</Badge>
            </Inline>
          </Button>
        </Tooltip>

        <Inline space="space.100">
          <Tooltip
            content={t('notifications.product.mark_all_read')}
            position="bottom"
          >
            <IconButton
              appearance="subtle"
              icon={() => <StrokeWeightLargeIcon label="" />}
              label={t('notifications.product.mark_all_read')}
              onClick={handleMarkAllReadClick}
              shape="circle"
              spacing="compact"
              testId="group-mark-as-read"
            />
          </Tooltip>

          <Tooltip content={Chevron.label} position="bottom">
            <IconButton
              appearance="subtle"
              icon={(iconProps) => <ChevronIcon {...iconProps} size="small" />}
              label={Chevron.label}
              shape="circle"
              spacing="compact"
              testId="group-toggle"
            />
          </Tooltip>
        </Inline>
      </Flex>
    </Box>
  );
};
