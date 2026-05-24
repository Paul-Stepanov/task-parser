export interface GitLabCommit {
  id: string
  short_id: string
  title: string
  author_name: string
  author_email: string
  created_at: string
  message: string
  web_url: string
}

export interface GitLabGroup {
  id: number
  name: string
  path: string
  full_path: string
  full_name: string
  web_url: string
  description: string
  avatar_url: string | null
}

export interface GitLabProject {
  id: number
  name: string
  path: string
  path_with_namespace: string
  web_url: string
  description: string
  default_branch: string | null
  avatar_url: string | null
}

export interface GitLabRepository {
  url: string
  projectId?: number
  defaultBranch?: string
}

export interface GitLabCommitsData {
  commits: GitLabCommit[]
  commitsText: string
  branch: string
  repository: GitLabRepository
  fetchedAt: string
  totalCount: number
}

export interface GitLabSettings {
  token: string
  gitlabUrl: string
  groupId?: number
  groupName?: string
  projectId?: number
  projectName?: string
  defaultBranch?: string
  enabled: boolean
}