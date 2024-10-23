import {
  type FC,
  Fragment,
  type MouseEvent,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import Avatar, { AvatarItem } from '@atlaskit/avatar';
import Badge from '@atlaskit/badge';
import Button, { IconButton } from '@atlaskit/button/new';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import HipchatMediaAttachmentCountIcon from '@atlaskit/icon/glyph/hipchat/media-attachment-count';
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
import { Oops } from '../Oops';
import { NotificationRow } from './NotificationRow';
import { ProductNotifications } from './ProductNotifications';
interface IAccountNotifications {
  account: Account;
  notifications: AtlassifyNotification[];
  error: AtlassifyError | null;
}

export const AccountNotifications: FC<IAccountNotifications> = (
  props: IAccountNotifications,
) => {
  const { account, notifications } = props;

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
              : 'color.background.accent.gray.subtlest'
        }
      >
        <Flex alignItems="center" justifyContent="space-between">
          <Inline space="space.100" alignBlock="center">
            <Tooltip content="Open account profile" position="right">
              <AvatarItem
                avatar={
                  <Avatar
                    name={account.name}
                    src={account.avatar}
                    size="xsmall"
                    appearance="circle"
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
              max={Constants.MAX_NOTIFICATIONS_PER_ACCOUNT - 1}
            >
              {notifications.length}
            </Badge>
          </Inline>

          <Inline space="space.100">
            <Tooltip content="My pull requests" position="bottom">
              <IconButton
                label="My pull requests"
                icon={(iconProps) => (
                  <BitbucketIcon {...iconProps} size="xsmall" />
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
              content="Mark all account notifications as read"
              position="bottom"
            >
              <IconButton
                label="Mark all account notifications as read"
                icon={(iconProps) => (
                  <HipchatMediaAttachmentCountIcon
                    {...iconProps}
                    size="small"
                  />
                )}
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
                    icon={CrossIcon}
                    label="Close"
                    onClick={() => closeModal()}
                    testId="account-mark-as-read-close"
                  />
                </Flex>
                <Flex xcss={titleContainerStyles} justifyContent="start">
                  <ModalTitle appearance="warning">Are you sure?</ModalTitle>
                </Flex>
              </Grid>
            </ModalHeader>
            <ModalBody>
              <p>
                Please confirm that you want to mark{' '}
                <strong>all account notifications</strong> as read
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                appearance="subtle"
                onClick={() => closeModal()}
                testId="account-mark-as-read-cancel"
              >
                Cancel
              </Button>
              <Button
                appearance="warning"
                onClick={() => {
                  markNotificationsRead(notifications);
                  closeModal();
                }}
                testId="account-mark-as-read-confirm"
              >
                Proceed
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </ModalTransition>
    </Stack>
  );
};
