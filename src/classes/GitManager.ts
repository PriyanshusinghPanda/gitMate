import simpleGit, { SimpleGit, StatusResult, LogResult } from 'simple-git';

export class GitManager {
  private git: SimpleGit;

  constructor() {
    this.git = simpleGit();
  }

  async isGitRepo(): Promise<boolean> {
    try {
      await this.git.status();
      return true;
    } catch {
      return false;
    }
  }

  async stageAll(): Promise<void> {
    await this.git.add('.');
  }

  async getStatus(): Promise<StatusResult> {
    return await this.git.status();
  }

  async getDiff(): Promise<string> {
    const staged = await this.git.diff(['--staged', '--stat']);
    if (staged) return staged;
    return await this.git.diff(['--stat']);
  }

  async getDiffContent(): Promise<string> {
    // Prioritise staged diff for AI analysis; fall back to unstaged
    const staged = await this.git.diff(['--staged']);
    if (staged) return staged;
    return await this.git.diff();
  }

  async getCurrentBranch(): Promise<string> {
    const status = await this.git.status();
    return status.current || 'unknown';
  }

  async getLog(limit: number = 10): Promise<LogResult> {
    return await this.git.log({ maxCount: limit });
  }

  async getRemoteUrl(): Promise<string> {
    try {
      const remotes = await this.git.getRemotes(true);
      const origin = remotes.find((r: { name: string }) => r.name === 'origin');
      return origin?.refs?.fetch || '';
    } catch {
      return '';
    }
  }

  /**
   * Parses the remote URL to extract { owner, repo } for GitHub API calls.
   * Supports both HTTPS and SSH remote formats.
   */
  async getRepoDetails(): Promise<{ owner: string; repo: string } | null> {
    const url = await this.getRemoteUrl();
    if (!url) return null;

    const httpsMatch = url.match(/github\.com\/([^/]+)\/([^/.]+)/);
    const sshMatch = url.match(/github\.com:([^/]+)\/([^/.]+)/);
    const match = httpsMatch || sshMatch;
    if (!match) return null;

    return {
      owner: match[1],
      repo: match[2].replace(/\.git$/, ''),
    };
  }

  async commit(message: string): Promise<void> {
    await this.git.commit(message);
  }

  async push(): Promise<void> {
    await this.git.push();
  }

  async undoLastCommit(hard: boolean = false): Promise<void> {
    const mode = hard ? '--hard' : '--soft';
    await this.git.reset([mode, 'HEAD~1']);
  }

  async createAndSwitchBranch(name: string): Promise<void> {
    await this.git.checkoutLocalBranch(name);
  }
}
