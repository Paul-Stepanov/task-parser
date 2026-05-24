import type {
  GitLabCommit,
  GitLabCommitsData,
  GitLabGroup,
  GitLabProject,
} from "@/types/gitlab"

export class GitLabAPI {
  private token: string
  private baseUrl: string

  constructor(token: string, baseUrl: string) {
    this.token = token
    this.baseUrl = baseUrl.replace(/\/+$/, "")
  }

  private getHeaders(): HeadersInit {
    return {
      "PRIVATE-TOKEN": this.token,
      "Content-Type": "application/json",
    }
  }

  private async fetchAllPages<T>(url: URL): Promise<T[]> {
    const items: T[] = []
    let page = 1

    while (true) {
      url.searchParams.set("page", page.toString())
      url.searchParams.set("per_page", "100")

      const response = await fetch(url.toString(), {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(
          `GitLab API error: ${response.status} ${response.statusText}`,
        )
      }

      const pageItems: T[] = await response.json()

      if (pageItems.length === 0) break

      items.push(...pageItems)
      page++
    }

    return items
  }

  async getGroups(): Promise<GitLabGroup[]> {
    const url = new URL(`${this.baseUrl}/api/v4/groups`)
    url.searchParams.set("per_page", "100")
    url.searchParams.set("all_available", "false")
    url.searchParams.set("order_by", "name")

    return this.fetchAllPages<GitLabGroup>(url)
  }

  async getProjectsByGroup(groupId: number): Promise<GitLabProject[]> {
    const url = new URL(
      `${this.baseUrl}/api/v4/groups/${groupId}/projects`,
    )
    url.searchParams.set("per_page", "100")
    url.searchParams.set("include_subgroups", "true")
    url.searchParams.set("order_by", "name")
    url.searchParams.set("sort", "asc")

    return this.fetchAllPages<GitLabProject>(url)
  }

  async getCommitsByBranch(
    projectId: number,
    branch: string,
    since?: Date,
  ): Promise<GitLabCommit[]> {
    const url = new URL(
      `${this.baseUrl}/api/v4/projects/${projectId}/repository/commits`,
    )
    url.searchParams.set("ref_name", branch)
    url.searchParams.set("per_page", "100")

    if (since) {
      url.searchParams.set("since", since.toISOString())
    }

    return this.fetchAllPages<GitLabCommit>(url)
  }

  async getCommitsData(
    projectId: number,
    branch: string,
    since?: Date,
  ): Promise<GitLabCommitsData> {
    const commits = await this.getCommitsByBranch(projectId, branch, since)

    return {
      commits,
      commitsText: this.formatCommitsText(commits),
      branch,
      repository: {
        url: `${this.baseUrl}/${projectId}`,
        projectId,
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
  gitlabUrl: string
}): Promise<GitLabAPI> {
  const api = new GitLabAPI(settings.token, settings.gitlabUrl)

  const isValid = await api.validateToken()
  if (!isValid) {
    throw new Error("Невалидный GitLab токен")
  }

  return api
}