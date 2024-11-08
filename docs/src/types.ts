export interface DownloadLink {
  os: string;
  name: string;
  url: string;
  isPrimary?: boolean;
}

export interface DownloadLinks {
  primary: DownloadLink[];
  alt: DownloadLink[];
}

export interface HeroData {
  downloadLinks: DownloadLinks;
  version: string;
  releaseDate: string;
}

export interface RepoStats {
  forksCount: number;
  stargazersCount: number;
  latestReleaseName: string;
}

export interface Repository {
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
}

export interface LatestRelease {
  url: string;
  assets_url: string;
  upload_url: string;
  html_url: string;
  id: number;
  author: UploaderOrAuthor;
  node_id: string;
  tag_name: string;
  target_commitish: string;
  name: string;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string;
  assets: Assets[];
  tarball_url: string;
  zipball_url: string;
  body: string;
  mentions_count: number;
}

export interface UploaderOrAuthor {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

export interface Assets {
  url: string;
  id: number;
  node_id: string;
  name: string;
  label: string;
  uploader: UploaderOrAuthor;
  content_type: string;
  state: string;
  size: number;
  download_count: number;
  created_at: string;
  updated_at: string;
  browser_download_url: string;
}
