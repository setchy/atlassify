import { TextDecoder, TextEncoder } from 'node:util';

/**
 * Prevent the following errors with jest:
 * - ReferenceError: TextEncoder is not defined
 * - ReferenceError: TextDecoder is not defined
 */
if (!global.TextEncoder || !global.TextDecoder) {
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}
