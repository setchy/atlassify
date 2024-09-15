import type { AtlasifyError, ErrorType } from '../types';

export const Errors: Record<ErrorType, AtlasifyError> = {
  BAD_CREDENTIALS: {
    title: 'Bad Credentials',
    descriptions: ['Your credentials are either invalid or expired.'],
    emojis: ['🔓'],
  },
  BAD_REQUEST: {
    title: 'Bad Request',
    descriptions: ['Something went wrong making the API request.'],
    emojis: ['😳'],
  },
  NETWORK: {
    title: 'Network Error',
    descriptions: [
      'Unable to connect to Atlassian Cloud.',
      'Please check your network connection, including whether you require a VPN, and try again.',
    ],
    emojis: ['🛜'],
  },
  UNKNOWN: {
    title: 'Oops! Something went wrong',
    descriptions: ['Please try again later.'],
    emojis: ['🤔', '🥲', '😳', '🫠', '🙃', '🙈'],
  },
};
