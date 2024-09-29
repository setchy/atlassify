import type { AtlassifyError, ErrorType } from '../types';

export const Errors: Record<ErrorType, AtlassifyError> = {
  BAD_CREDENTIALS: {
    title: 'Bad Credentials',
    descriptions: [
      'Your credentials are either invalid or expired.',
      'Please try removing your account and authenticating again.',
    ],
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
