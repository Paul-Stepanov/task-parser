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
  repositoryUrl: string
  projectId?: number
  defaultBranch?: string
  enabled: boolean
}