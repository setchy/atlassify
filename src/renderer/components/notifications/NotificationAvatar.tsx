import type { FC } from 'react';

import Avatar, { type AppearanceType } from '@atlaskit/avatar';
import { Stack } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

import type { AtlassifyNotification } from '../../types';

import { categoryFilter } from '../../utils/notifications/filters';

export interface NotificationAvatarProps {
  notification: AtlassifyNotification;
  avatarAppearance: AppearanceType;
}

export const NotificationAvatar: FC<NotificationAvatarProps> = ({
  notification,
  avatarAppearance,
}: NotificationAvatarProps) => {
  const categoryDetails = categoryFilter.getTypeDetails(notification.category);
  const CategoryIcon = categoryDetails.icon;

  return (
    <Stack alignInline="center" space="space.050">
      <Tooltip content={notification.actor.displayName} position="right">
        <Avatar
          appearance={avatarAppearance}
          name={notification.actor.displayName}
          size="medium"
          src={notification.actor.avatarURL}
        />
      </Tooltip>
      <Tooltip content={categoryDetails.description} position="right">
        <CategoryIcon label={categoryDetails.description} />
      </Tooltip>
    </Stack>
  );
};
