import type { AtlassifyError, ErrorType } from '../types';

export const Errors: Record<ErrorType, AtlassifyError> = {
  BAD_CREDENTIALS: {
    title: 'errors.badCredentials.title',
    descriptions: [
      'errors.badCredentials.description1',
      'errors.badCredentials.description2',
    ],
    emojis: ['🔓'],
  },
  BAD_REQUEST: {
    title: 'errors.badRequest.title',
    descriptions: ['errors.badRequest.description'],
    emojis: ['😳'],
  },
  NETWORK: {
    title: 'errors.network.title',
    descriptions: [
      'errors.network.description1',
      'errors.network.description2',
    ],
    emojis: ['🛜'],
  },
  UNKNOWN: {
    title: 'errors.unknown.title',
    descriptions: ['errors.unknown.description'],
    emojis: ['🤔', '🥲', '🫠', '🙃', '🙈'],
  },
};
