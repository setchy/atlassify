import { type FC, Fragment, type MouseEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Avatar, { AvatarItem } from '@atlaskit/avatar';
import Badge from '@atlaskit/badge';
import Button, { IconButton } from '@atlaskit/button/new';
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
import { Box, Flex, Grid, Inline, Stack, xcss } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

import { Constants } from '../../constants';

import { useAppContext } from '../../hooks/useAppContext';
import useSettingsStore from '../../stores/useSettingsStore';

import type {
  Account,
  AtlassifyError,
  AtlassifyNotification,
} from '../../types';

import { getChevronDetails } from '../../utils/helpers';
import { openAccountProfile, openMyPullRequests } from '../../utils/links';
import { groupNotificationsByProduct } from '../../utils/notifications/group';
import { isLightMode } from '../../utils/theme';
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

export const AccountNotifications: FC<AccountNotificationsProps> = (
  props: AccountNotificationsProps,
) => {
  const { account, notifications, hasMoreNotifications, showAccountHeader } =
    props;

  const { markNotificationsRead } = useAppContext();

  const { t } = useTranslation();

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

  const gridStyles = xcss({
    width: '100%',
  });

  const closeContainerStyles = xcss({
    gridArea: 'close',
  });

  const titleContainerStyles = xcss({
    gridArea: 'title',
  });

  const sortedNotifications = useMemo(
    () => [...notifications].sort((a, b) => a.order - b.order),
    [notifications],
  );

  const groupNotificationsByProductAlphabetically = useSettingsStore(
    (s) => s.groupNotificationsByProductAlphabetically,
  );

  const groupedNotifications = useMemo(() => {
    const map = groupNotificationsByProduct(sortedNotifications);

    const notifications = Array.from(map.entries());

    if (groupNotificationsByProductAlphabetically) {
      notifications.sort((a, b) => a[0].localeCompare(b[0]));
    }

    return notifications;
  }, [sortedNotifications, groupNotificationsByProductAlphabetically]);

  const actionToggleAccountNotifications = () => {
    setIsAccountNotificationsVisible(!isAccountNotificationsVisible);
  };

  const hasNotifications = useMemo(
    () => notifications.length > 0,
    [notifications],
  );

  const Chevron = getChevronDetails(
    hasNotifications,
    isAccountNotificationsVisible,
    'account',
  );
  const ChevronIcon = Chevron.icon;

  const boxStyles = xcss({
    transitionDuration: '200ms',

    backgroundColor: props.error
      ? 'color.background.accent.red.subtler'
      : isLightMode()
        ? 'color.background.accent.blue.subtler'
        : 'color.background.accent.gray.subtler',

    ':hover': {
      backgroundColor: isLightMode()
        ? 'color.background.accent.blue.subtler.hovered'
        : 'color.background.accent.gray.subtler.hovered',
    },
  });

  return (
    <Stack>
      {showAccountHeader && (
        <Box
          as="div"
          onClick={actionToggleAccountNotifications}
          paddingBlock="space.050"
          paddingInline="space.100"
          xcss={boxStyles}
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
              <Badge
                appearance="primary"
                max={Constants.MAX_NOTIFICATIONS_PER_ACCOUNT}
              >
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
                    <BitbucketIcon {...iconProps} size="xxsmall" />
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

          {!hasNotifications && !props.error && <AllRead />}

          {useSettingsStore.getState().groupNotificationsByProduct
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
              <Grid
                gap="space.200"
                templateAreas={['title close']}
                xcss={gridStyles}
              >
                <Flex justifyContent="end" xcss={closeContainerStyles}>
                  <IconButton
                    appearance="subtle"
                    icon={CrossIcon}
                    label={t('common.close')}
                    onClick={actionCloseMarkAccountAsReadModal}
                    testId="account-mark-as-read-close"
                  />
                </Flex>
                <Flex justifyContent="start" xcss={titleContainerStyles}>
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
