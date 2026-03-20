import type { FC } from 'react';

import Avatar from '@atlaskit/avatar';
import AvatarGroup, { type AvatarProps } from '@atlaskit/avatar-group';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives';

import type { AtlassifyNotification } from '../../types';

import { formatNotificationUpdatedAt } from '../../utils/notifications/formatters';
import { blockAlignmentByLength } from '../../utils/ui/display';

export interface NotificationContentProps {
  notification: AtlassifyNotification;
  bodyText: string;
  footerText: string;
  onClick: () => void;
}

export const NotificationContent: FC<NotificationContentProps> = ({
  notification,
  bodyText,
  footerText,
  onClick,
}: NotificationContentProps) => {
  const updatedAt = formatNotificationUpdatedAt(notification);

  const avatarGroup: AvatarProps[] =
    notification.notificationGroup.additionalActors.map((actor) => ({
      key: actor.displayName,
      name: actor.displayName,
      href: '#',
      src: actor.avatarURL,
    }));

  const displayGroupSize = notification.notificationGroup.size - 1;
  const displayUpdateVerbiage = displayGroupSize > 1 ? 'updates' : 'update';

  return (
    <Box
      as="div"
      id="notification-details"
      onClick={onClick}
      testId="notification-details"
    >
      <div className="cursor-pointer">
        <Stack space="space.025">
          <Box as="div" id="notification-title">
            <Text>{notification.message}</Text>
            &nbsp;&nbsp;
            <Text align="end" as="em" size="small">
              {updatedAt}
            </Text>
          </Box>

          <Box as="div" id="notification-metadata">
            <Stack space="space.025">
              <Box
                as="div"
                hidden={!bodyText}
                id="notification-entity"
                paddingInlineStart={
                  notification.entity.iconUrl ? 'space.0' : 'space.025'
                }
              >
                <Inline
                  alignBlock={blockAlignmentByLength(bodyText)}
                  space={
                    notification.entity.iconUrl ? 'space.050' : 'space.075'
                  }
                >
                  {notification.entity.iconUrl ? (
                    <Avatar
                      appearance="square"
                      name={bodyText}
                      size="xsmall"
                      src={notification.entity.iconUrl}
                    />
                  ) : (
                    <notification.product.logo
                      appearance="brand"
                      shouldUseNewLogoDesign
                      size="xxsmall"
                    />
                  )}
                  <Text size="small">{bodyText}</Text>
                </Inline>
              </Box>

              <Box
                as="div"
                id="notification-product"
                paddingInlineStart="space.025"
              >
                <Inline
                  alignBlock={blockAlignmentByLength(footerText)}
                  space="space.075"
                >
                  <notification.product.logo
                    appearance="brand"
                    shouldUseNewLogoDesign
                    size="xxsmall"
                  />
                  <Text size="small">{footerText}</Text>
                </Inline>
              </Box>

              <Box as="div" id="notification-group">
                {notification.notificationGroup.size > 1 && (
                  <Inline alignBlock="center" space="space.050">
                    {notification.notificationGroup.additionalActors.length >
                      0 && (
                      // @ts-expect-error We're forcing the xsmall size for Avatar Groups
                      <AvatarGroup data={avatarGroup} size="xsmall" />
                    )}
                    <Text size="small">
                      +{displayGroupSize}{' '}
                      {notification.notificationGroup.additionalActors.length >
                      0
                        ? `${displayUpdateVerbiage} from ${notification.notificationGroup.additionalActors[0].displayName}`
                        : `other ${displayUpdateVerbiage}`}
                      {notification.notificationGroup.additionalActors.length >
                        1 && ' and others'}
                    </Text>
                  </Inline>
                )}
              </Box>
            </Stack>
          </Box>
        </Stack>
      </div>
    </Box>
  );
};
