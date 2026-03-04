import axios, { AxiosInstance } from 'axios';

export interface GitHubUser {
  login: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  location: string;
  html_url: string;
  created_at: string;
  avatar_url: string;
}

export interface GitHubRepo {
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string;
  default_branch: string;
  html_url: string;
  updated_at: string;
  watchers_count: number;
  topics: string[];
}

export class GitHubAPI {
  private client: AxiosInstance;

  constructor(token?: string) {
    const headers: Record<string, string> = {
      'Accept':     'application/vnd.github.v3+json',
      'User-Agent': 'GitMate-CLI/1.0.0',
    };

    if (token) {
      headers['Authorization'] = `token ${token}`;
    }

    this.client = axios.create({
      baseURL: 'https://api.github.com',
      headers,
    });
  }

  async getUserInfo(username: string): Promise<GitHubUser> {
    const response = await this.client.get<GitHubUser>(`/users/${username}`);
    return response.data;
  }

  async getRepoInfo(owner: string, repo: string): Promise<GitHubRepo> {
    const response = await this.client.get<GitHubRepo>(`/repos/${owner}/${repo}`);
    return response.data;
  }
}
