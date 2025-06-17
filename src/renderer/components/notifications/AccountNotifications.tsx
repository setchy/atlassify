import {
  type FC,
  Fragment,
  type MouseEvent,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import Avatar, { AvatarItem } from '@atlaskit/avatar';
import Badge from '@atlaskit/badge';
import Button, { IconButton } from '@atlaskit/button/new';
import CloseIcon from '@atlaskit/icon/core/close';
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

import { AppContext } from '../../context/App';
import type {
  Account,
  AtlassifyError,
  AtlassifyNotification,
} from '../../types';
import { Constants } from '../../utils/constants';
import { getChevronDetails } from '../../utils/helpers';
import { openAccountProfile, openMyPullRequests } from '../../utils/links';
import { isLightMode } from '../../utils/theme';
import { AllRead } from '../AllRead';
import { UnreadIcon } from '../icons/UnreadIcon';
import { Oops } from '../Oops';
import { NotificationRow } from './NotificationRow';
import { ProductNotifications } from './ProductNotifications';

interface IAccountNotifications {
  account: Account;
  notifications: AtlassifyNotification[];
  hasMoreNotifications: boolean;
  error: AtlassifyError | null;
}

export const AccountNotifications: FC<IAccountNotifications> = (
  props: IAccountNotifications,
) => {
  const { account, notifications, hasMoreNotifications } = props;
  const { t } = useTranslation();
  const { markNotificationsRead, settings } = useContext(AppContext);

  const [showAccountNotifications, setShowAccountNotifications] =
    useState(true);

  const [isOpen, setIsOpen] = useState(false);
  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const gridStyles = xcss({
    width: '100%',
  });

  const closeContainerStyles = xcss({
    gridArea: 'close',
  });

  const titleContainerStyles = xcss({
    gridArea: 'title',
  });

  const groupedNotifications = Object.values(
    notifications?.reduce(
      (acc: { [key: string]: AtlassifyNotification[] }, notification) => {
        const key = notification.product.name;
        if (!acc[key]) acc[key] = [];
        acc[key].push(notification);
        return acc;
      },
      {},
    ),
  );

  if (settings.groupNotificationsByProductAlphabetically) {
    groupedNotifications.sort((a, b) =>
      a[0].product.name.localeCompare(b[0].product.name),
    );
  }

  const toggleAccountNotifications = () => {
    setShowAccountNotifications(!showAccountNotifications);
  };

  const hasNotifications = useMemo(
    () => notifications.length > 0,
    [notifications],
  );

  const Chevron = getChevronDetails(
    hasNotifications,
    showAccountNotifications,
    'account',
  );

  const boxStyles = xcss({
    transitionDuration: '200ms',
    ':hover': {
      backgroundColor: isLightMode()
        ? 'color.background.accent.blue.subtler.hovered'
        : 'color.background.accent.gray.subtler.hovered',
    },
  });

  return (
    <Stack>
      <Box
        onClick={toggleAccountNotifications}
        paddingInline="space.100"
        paddingBlock="space.050"
        backgroundColor={
          props.error
            ? 'color.background.accent.red.subtler'
            : isLightMode()
              ? 'color.background.accent.blue.subtler'
              : 'color.background.accent.gray.subtler'
        }
        xcss={boxStyles}
      >
        <Flex alignItems="center" justifyContent="space-between">
          <Inline space="space.100" alignBlock="center">
            <Tooltip
              content={t('notifications.account.open_profile')}
              position="right"
            >
              <AvatarItem
                avatar={
                  <Avatar
                    name={account.name}
                    src={account.avatar}
                    size="xsmall"
                    appearance="circle"
                    borderColor={isLightMode() ? 'white' : 'gray'}
                  />
                }
                primaryText={account.name}
                onClick={(event: MouseEvent<HTMLElement>) => {
                  event.stopPropagation();
                  openAccountProfile(account);
                }}
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
                label={t('notifications.account.pull_requests')}
                icon={(iconProps) => (
                  <BitbucketIcon {...iconProps} size="xxsmall" />
                )}
                shape="circle"
                spacing="compact"
                appearance="subtle"
                onClick={(event: MouseEvent<HTMLElement>) => {
                  event.stopPropagation();
                  openMyPullRequests();
                }}
                testId="account-pull-requests"
              />
            </Tooltip>

            <Tooltip
              content={t('notifications.account.mark_all_read')}
              position="bottom"
            >
              <IconButton
                label={t('notifications.account.mark_all_read')}
                icon={() => <UnreadIcon />}
                shape="circle"
                spacing="compact"
                appearance="subtle"
                onClick={(event: MouseEvent<HTMLElement>) => {
                  event.stopPropagation();
                  openModal();
                }}
                testId="account-mark-as-read"
              />
            </Tooltip>
            <Tooltip content={Chevron.label} position="bottom">
              <IconButton
                label={Chevron.label}
                icon={Chevron.icon}
                shape="circle"
                spacing="compact"
                appearance="subtle"
                testId="account-toggle"
              />
            </Tooltip>
          </Inline>
        </Flex>
      </Box>

      {showAccountNotifications && (
        <Fragment>
          {props.error && <Oops error={props.error} />}
          {!hasNotifications && !props.error && <AllRead />}
          {settings.groupNotificationsByProduct
            ? Object.values(groupedNotifications).map(
                (productNotifications) => {
                  return (
                    <ProductNotifications
                      key={productNotifications[0].product.name}
                      productNotifications={productNotifications}
                    />
                  );
                },
              )
            : notifications.map((notification) => (
                <NotificationRow
                  key={notification.id}
                  notification={notification}
                />
              ))}
        </Fragment>
      )}

      <ModalTransition>
        {isOpen && (
          <Modal onClose={() => closeModal()}>
            <ModalHeader>
              <Grid
                gap="space.200"
                templateAreas={['title close']}
                xcss={gridStyles}
              >
                <Flex xcss={closeContainerStyles} justifyContent="end">
                  <IconButton
                    appearance="subtle"
                    icon={CloseIcon}
                    label={t('common.close')}
                    onClick={() => closeModal()}
                    testId="account-mark-as-read-close"
                  />
                </Flex>
                <Flex xcss={titleContainerStyles} justifyContent="start">
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
                onClick={() => closeModal()}
                testId="account-mark-as-read-cancel"
              >
                {t('common.cancel')}
              </Button>
              <Button
                appearance="warning"
                onClick={() => {
                  markNotificationsRead(notifications);
                  closeModal();
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
