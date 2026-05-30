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
    const MAX_PAGES = 100

    while (page <= MAX_PAGES) {
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

  async getCommitsData(
    projectId: number,
    branch: string,
  ): Promise<GitLabCommitsData> {
    const project = await this.getProject(projectId)
    const mergeRequests = await this.findMergeRequests(projectId, branch)

    if (mergeRequests.length === 0) {
      throw new Error(
        `Merge Request для ветки "${branch}" не найден`,
      )
    }

    const allCommits = await this.collectCommitsFromMergeRequests(
      projectId,
      mergeRequests,
    )

    return {
      commits: allCommits,
      commitsText: this.formatCommitsText(allCommits),
      branch,
      repository: {
        url: project.web_url,
        projectId,
      },
      fetchedAt: new Date().toISOString(),
      totalCount: allCommits.length,
      mergeRequestUrl: mergeRequests[0].web_url,
    }
  }

  private async getProject(
    projectId: number,
  ): Promise<GitLabProject> {
    const url = new URL(
      `${this.baseUrl}/api/v4/projects/${projectId}`,
    )

    const response = await fetch(url.toString(), {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(
        `GitLab API error: ${response.status} ${response.statusText}`,
      )
    }

    return response.json()
  }

  private async findMergeRequests(
    projectId: number,
    sourceBranch: string,
  ): Promise<{ iid: number; web_url: string }[]> {
    const url = new URL(
      `${this.baseUrl}/api/v4/projects/${projectId}/merge_requests`,
    )
    url.searchParams.set("source_branch", sourceBranch)
    url.searchParams.set("order_by", "updated_at")
    url.searchParams.set("sort", "desc")

    const response = await fetch(url.toString(), {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(
        `GitLab API error: ${response.status} ${response.statusText}`,
      )
    }

    return response.json()
  }

  private async collectCommitsFromMergeRequests(
    projectId: number,
    mergeRequests: { iid: number }[],
  ): Promise<GitLabCommit[]> {
    const seen = new Set<string>()
    const commits: GitLabCommit[] = []

    for (const mr of mergeRequests) {
      const mrCommits = await this.getMergeRequestCommits(projectId, mr.iid)

      for (const commit of mrCommits) {
        if (!seen.has(commit.id)) {
          seen.add(commit.id)
          commits.push(commit)
        }
      }
    }

    return commits
  }

  private async getMergeRequestCommits(
    projectId: number,
    mergeRequestIid: number,
  ): Promise<GitLabCommit[]> {
    const url = new URL(
      `${this.baseUrl}/api/v4/projects/${projectId}/merge_requests/${mergeRequestIid}/commits`,
    )

    return this.fetchAllPages<GitLabCommit>(url)
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