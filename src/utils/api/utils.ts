import { Constants } from '../constants';

export function getAPIUrl(): URL {
  return new URL(Constants.ATLASSIAN_API);
}
