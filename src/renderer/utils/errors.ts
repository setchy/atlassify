import i18n from '../i18n';
import type { AtlassifyError, ErrorType } from '../types';

export const Errors: Record<ErrorType, AtlassifyError> = {
  BAD_CREDENTIALS: {
    title: i18n.t('errors.badCredentials.title'),
    descriptions: [
      i18n.t('errors.badCredentials.description1'),
      i18n.t('errors.badCredentials.description2'),
    ],
    emojis: ['🔓'],
  },
  BAD_REQUEST: {
    title: i18n.t('errors.badRequest.title'),
    descriptions: [i18n.t('errors.badRequest.description1')],
    emojis: ['😳'],
  },
  NETWORK: {
    title: i18n.t('errors.network.title'),
    descriptions: [
      i18n.t('errors.network.description1'),
      i18n.t('errors.network.description2'),
    ],
    emojis: ['🛜'],
  },
  UNKNOWN: {
    title: i18n.t('errors.unknown.title'),
    descriptions: [i18n.t('errors.unknown.description1')],
    emojis: ['🤔', '🥲', '🫠', '🙃', '🙈'],
  },
};
