import type {
  GitLabCommit,
  GitLabCommitsData,
  GitLabRepository,
} from "@/types/gitlab"

export class GitLabAPI {
  private token: string
  private baseUrl: string
  private projectId: number

  constructor(token: string, repositoryUrl: string, projectId?: number) {
    this.token = token
    this.baseUrl = this.extractBaseUrl(repositoryUrl)
    this.projectId = projectId || this.extractProjectId(repositoryUrl)
  }

  private extractBaseUrl(url: string): string {
    const match = url.match(/https?:\/\/([^/]+)/)
    return match ? `https://${match[1]}` : "https://gitlab.com"
  }

  private extractProjectId(url: string): number {
    const match = url.match(/\/projects\/(\d+)/)
    return match ? parseInt(match[1], 10) : 0
  }

  private getHeaders(): HeadersInit {
    return {
      "PRIVATE-TOKEN": this.token,
      "Content-Type": "application/json",
    }
  }

  async getCommitsByBranch(
    branch: string,
    since?: Date,
  ): Promise<GitLabCommit[]> {
    const url = new URL(
      `${this.baseUrl}/api/v4/projects/${this.projectId}/repository/commits`,
    )
    url.searchParams.set("ref_name", branch)

    if (since) {
      url.searchParams.set("since", since.toISOString())
    }

    const allCommits: GitLabCommit[] = []
    let page = 1
    let hasMore = true

    while (hasMore && page <= 10) {
      url.searchParams.set("page", page.toString())

      const response = await fetch(url.toString(), {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(
          `GitLab API error: ${response.status} ${response.statusText}`,
        )
      }

      const commits: GitLabCommit[] = await response.json()
      allCommits.push(...commits)

      hasMore = commits.length > 0 && commits.length === 20
      page++
    }

    return allCommits
  }

  async getCommitsData(
    branch: string,
    since?: Date,
  ): Promise<GitLabCommitsData> {
    const commits = await this.getCommitsByBranch(branch, since)

    return {
      commits,
      commitsText: this.formatCommitsText(commits),
      branch,
      repository: {
        url: `${this.baseUrl}/${this.projectId}`,
        projectId: this.projectId,
      },
      fetchedAt: new Date().toISOString(),
      totalCount: commits.length,
    }
  }

  private formatCommitsText(commits: GitLabCommit[]): string {
    return commits
      .map((commit) => {
        const date = new Date(commit.created_at).toLocaleDateString("ru-RU")
        return `[${date}] ${commit.author_name}: ${commit.title}`
      })
      .join("\n")
  }

  async validateToken(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v4/user`, {
        headers: this.getHeaders(),
      })
      return response.ok
    } catch {
      return false
    }
  }
}

export async function createGitLabAPI(settings: {
  token: string
  repositoryUrl: string
  projectId?: number
}): Promise<GitLabAPI> {
  const api = new GitLabAPI(
    settings.token,
    settings.repositoryUrl,
    settings.projectId,
  )

  const isValid = await api.validateToken()
  if (!isValid) {
    throw new Error("Невалидный GitLab токен")
  }

  return api
}
