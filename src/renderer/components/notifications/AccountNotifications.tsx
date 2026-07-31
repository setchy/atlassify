import { type FC, Fragment, type MouseEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Avatar, { AvatarItem } from '@atlaskit/avatar';
import Badge from '@atlaskit/badge/new';
import Button, { IconButton } from '@atlaskit/button/new';
import { cssMap, cx } from '@atlaskit/css';
import CrossIcon from '@atlaskit/icon/core/cross';
import StrokeWeightLargeIcon from '@atlaskit/icon/core/stroke-weight-large';
import { BitbucketIcon } from '@atlaskit/logo';
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';
import { Box, Flex, Grid, Inline, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { Constants } from '../../constants';

import { useAppContext } from '../../hooks/useAppContext';
import { useSettingsStore } from '../../stores';

import type {
  Account,
  AtlassifyError,
  AtlassifyNotification,
} from '../../types';

import {
  groupNotificationsByProductEntries,
  sortNotificationsByOrder,
} from '../../utils/notifications/group';
import {
  openAccountProfile,
  openMyPullRequests,
} from '../../utils/system/links';
import { getChevronDetails } from '../../utils/ui/display';
import { isLightMode } from '../../utils/ui/theme';
import { AllRead } from '../AllRead';
import { Oops } from '../Oops';
import { NotificationRow } from './NotificationRow';
import { ProductNotifications } from './ProductNotifications';

export interface AccountNotificationsProps {
  account: Account;
  notifications: AtlassifyNotification[];
  hasMoreNotifications: boolean;
  error: AtlassifyError | null;
  showAccountHeader: boolean;
}

const styles = cssMap({
  grid: {
    width: '100%',
    gridTemplateAreas: '"title close"',
  },
  closeContainer: {
    gridArea: 'close',
  },
  titleContainer: {
    gridArea: 'title',
  },
  root: {
    transitionDuration: '200ms',
    paddingBlock: token('space.050'),
    paddingInline: token('space.100'),
  },
  error: {
    backgroundColor: token('color.background.accent.red.subtler'),
  },
  light: {
    backgroundColor: token('color.background.accent.blue.subtler'),
  },
  dark: {
    backgroundColor: token('color.background.accent.gray.subtler'),
  },
  hoverLight: {
    '&:hover': {
      backgroundColor: token('color.background.accent.blue.subtler.hovered'),
    },
  },
  hoverDark: {
    '&:hover': {
      backgroundColor: token('color.background.accent.gray.subtler.hovered'),
    },
  },
});

export const AccountNotifications: FC<AccountNotificationsProps> = (
  props: AccountNotificationsProps,
) => {
  const { account, notifications, hasMoreNotifications, showAccountHeader } =
    props;

  const { t } = useTranslation();

  const { markNotificationsRead } = useAppContext();

  const [isAccountNotificationsVisible, setIsAccountNotificationsVisible] =
    useState(true);

  const [showMarkAccountAsReadModal, setShowMarkAccountAsReadModal] =
    useState(false);

  const actionOpenMarkAccountAsReadModal = () => {
    setShowMarkAccountAsReadModal(true);
  };

  const actionCloseMarkAccountAsReadModal = () => {
    setShowMarkAccountAsReadModal(false);
  };

  const sortedNotifications = useMemo(
    () => sortNotificationsByOrder(notifications),
    [notifications],
  );

  const groupNotificationsByProductAlphabetically = useSettingsStore(
    (s) => s.groupNotificationsByProductAlphabetically,
  );
  const groupByProduct = useSettingsStore((s) => s.groupNotificationsByProduct);

  const groupedNotifications = useMemo(
    () =>
      groupNotificationsByProductEntries(
        sortedNotifications,
        groupNotificationsByProductAlphabetically,
      ),
    [sortedNotifications, groupNotificationsByProductAlphabetically],
  );

  const actionToggleAccountNotifications = () => {
    setIsAccountNotificationsVisible(!isAccountNotificationsVisible);
  };

  const hasAccountNotifications = notifications.length > 0;

  const Chevron = getChevronDetails(
    hasAccountNotifications,
    isAccountNotificationsVisible,
    'account',
  );
  const ChevronIcon = Chevron.icon;

  return (
    <Stack>
      {showAccountHeader && (
        <Box
          as="div"
          onClick={actionToggleAccountNotifications}
          xcss={cx(
            styles.root,
            props.error
              ? styles.error
              : isLightMode()
                ? styles.light
                : styles.dark,
            isLightMode() ? styles.hoverLight : styles.hoverDark,
          )}
        >
          <Flex alignItems="center" justifyContent="space-between">
            <Inline alignBlock="center" space="space.100">
              <Tooltip
                content={t('notifications.account.open_profile')}
                position="right"
              >
                <AvatarItem
                  avatar={
                    <Avatar
                      appearance="circle"
                      borderColor={isLightMode() ? 'white' : 'gray'}
                      name={account.name}
                      size="xsmall"
                      src={account.avatar}
                    />
                  }
                  onClick={(event: MouseEvent<HTMLElement>) => {
                    event.stopPropagation();
                    openAccountProfile(account);
                  }}
                  primaryText={account.name}
                  testId="account-profile"
                />
              </Tooltip>{' '}
              <Badge max={Constants.MAX_NOTIFICATIONS_PER_ACCOUNT}>
                {hasMoreNotifications
                  ? Constants.MAX_NOTIFICATIONS_PER_ACCOUNT + 1
                  : notifications.length}
              </Badge>
            </Inline>

            <Inline space="space.100">
              <Tooltip
                content={t('notifications.account.pull_requests')}
                position="bottom"
              >
                <IconButton
                  appearance="subtle"
                  icon={(iconProps) => (
                    <BitbucketIcon
                      {...iconProps}
                      appearance="neutral"
                      size="xxsmall"
                    />
                  )}
                  label={t('notifications.account.pull_requests')}
                  onClick={(event: MouseEvent<HTMLElement>) => {
                    event.stopPropagation();
                    openMyPullRequests();
                  }}
                  shape="circle"
                  spacing="compact"
                  testId="account-pull-requests"
                />
              </Tooltip>

              <Tooltip
                content={t('notifications.account.mark_all_read')}
                position="bottom"
              >
                <IconButton
                  appearance="subtle"
                  icon={() => <StrokeWeightLargeIcon label="" />}
                  label={t('notifications.account.mark_all_read')}
                  onClick={(event: MouseEvent<HTMLElement>) => {
                    event.stopPropagation();
                    actionOpenMarkAccountAsReadModal();
                  }}
                  shape="circle"
                  spacing="compact"
                  testId="account-mark-as-read"
                />
              </Tooltip>
              <Tooltip content={Chevron.label} position="bottom">
                <IconButton
                  appearance="subtle"
                  icon={(iconProps) => (
                    <ChevronIcon {...iconProps} size="small" />
                  )}
                  label={Chevron.label}
                  shape="circle"
                  spacing="compact"
                  testId="account-toggle"
                />
              </Tooltip>
            </Inline>
          </Flex>
        </Box>
      )}

      {isAccountNotificationsVisible && (
        <Fragment>
          {props.error && <Oops error={props.error} />}

          {!hasAccountNotifications && !props.error && <AllRead />}

          {groupByProduct
            ? groupedNotifications.map(
                ([productType, productNotifications]) => (
                  <ProductNotifications
                    key={productType}
                    productNotifications={productNotifications}
                  />
                ),
              )
            : sortedNotifications.map((notification) => (
                <NotificationRow
                  isProductAnimatingExit={false}
                  key={notification.id}
                  notification={notification}
                />
              ))}
        </Fragment>
      )}

      <ModalTransition>
        {showMarkAccountAsReadModal && (
          <Modal onClose={actionCloseMarkAccountAsReadModal}>
            <ModalHeader>
              <Grid gap="space.200" xcss={styles.grid}>
                <Flex justifyContent="end" xcss={styles.closeContainer}>
                  <IconButton
                    appearance="subtle"
                    icon={CrossIcon}
                    label={t('common.close')}
                    onClick={actionCloseMarkAccountAsReadModal}
                    testId="account-mark-as-read-close"
                  />
                </Flex>
                <Flex justifyContent="start" xcss={styles.titleContainer}>
                  <ModalTitle appearance="warning">
                    {t('common.are_you_sure')}
                  </ModalTitle>
                </Flex>
              </Grid>
            </ModalHeader>
            <ModalBody>
              <p>
                {t('notifications.account.mark_read_confirm.description1')}{' '}
                <strong>
                  {t('notifications.account.mark_read_confirm.description2')}
                </strong>{' '}
                {t('notifications.account.mark_read_confirm.description3')}
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                appearance="subtle"
                onClick={actionCloseMarkAccountAsReadModal}
                testId="account-mark-as-read-cancel"
              >
                {t('common.cancel')}
              </Button>
              <Button
                appearance="warning"
                onClick={() => {
                  markNotificationsRead(notifications);
                  actionCloseMarkAccountAsReadModal();
                }}
                testId="account-mark-as-read-confirm"
              >
                {t('common.proceed')}
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </ModalTransition>
    </Stack>
  );
};
