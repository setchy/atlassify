export type BitbucketBuildState =
  | 'SUCCESSFUL'
  | 'FAILED'
  | 'INPROGRESS'
  | 'STOPPED';

export interface BitbucketCommitStatus {
  key: string;
  type: string;
  state: BitbucketBuildState;
  name: string;
  url: string;
  description: string;
  updated_on: string;
}

export interface BitbucketPR {
  id: number;
  title: string;
  draft: boolean;
  state: string;
  comment_count: number;
  task_count: number;
  created_on: string;
  updated_on: string;
  author: {
    display_name: string;
    links: { avatar: { href: string } };
  };
  destination: {
    branch: { name: string };
    repository: {
      name: string;
      full_name: string;
    };
  };
  reviewers: Array<{
    display_name: string;
    links: { avatar: { href: string } };
  }>;
  links: {
    html: { href: string };
  };
  extra: {
    commit_statuses: BitbucketCommitStatus[];
    approved: string | null;
    state: string | null;
    last_comment: string | null;
  };
}

export interface BitbucketYourWorkResponse {
  pullRequests: {
    reviewing: BitbucketPR[];
    authored: BitbucketPR[];
    closed: BitbucketPR[];
  };
}

export interface BitbucketWorkItem extends BitbucketPR {
  role: 'AUTHOR' | 'REVIEWER' | 'CLOSED';
  workspace: string;
}
