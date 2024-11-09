import type { components } from '@octokit/openapi-types';

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
  version: string | null;
  releaseDate: string;
}

export interface RepoStats {
  forksCount: number;
  stargazersCount: number;
  latestReleaseName: string | null;
}

// GitHub API types
export type ReleaseAsset = components['schemas']['release-asset'];
