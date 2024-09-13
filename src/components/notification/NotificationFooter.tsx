import Avatar from '@atlaskit/avatar';
import type { FC } from 'react';
import { Opacity } from '../../types';
import type { Notification } from '../../utils/api/typesGitHub';
import { cn } from '../../utils/cn';

interface INotificationFooter {
  notification: Notification;
}

export const NotificationFooter: FC<INotificationFooter> = ({
  notification,
}: INotificationFooter) => {
  // TODO Set correct product icon
  // TODO Fix icon sizes

  return (
    <div>
      <div
        className={cn(
          'flex flex-wrap items-center gap-1 text-xs',
          Opacity.MEDIUM,
        )}
      >
        <Avatar
          name={notification.entity.title}
          src={notification.entity.iconUrl}
          size="xsmall"
          appearance="square"
          // onClick={() => openAccountProfile(account)}
        />

        <div>{notification.entity.title}</div>
      </div>
      <div
        className={cn(
          'flex flex-wrap items-center gap-1 text-xs',
          Opacity.MEDIUM,
        )}
      >
        <notification.product.icon size="xsmall" appearance="brand" />
        {notification.path?.title}
      </div>
    </div>
  );
};
