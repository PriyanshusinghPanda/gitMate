import { GitManager } from './GitManager';
import { Logger } from './Logger';

export class Validator {
  private git: GitManager;

  constructor() {
    this.git = new GitManager();
  }

  /**
   * Ensures the current working directory is inside a git repository.
   */
  async requireGitRepo(): Promise<boolean> {
    const isRepo = await this.git.isGitRepo();
    if (!isRepo) {
      Logger.error('Not a git repository! Run `git init` first.');
    }
    return isRepo;
  }

  /**
   * Ensures an environment variable / API key exists.
   */
  requireApiKey(key: string | undefined, name: string): boolean {
    if (!key || key.trim() === '') {
      Logger.error(`${name} API key not found!`);
      Logger.info('Add it to your .env file. See .env.example for reference.');
      return false;
    }
    return true;
  }

  /**
   * Validates that a branch name doesn't contain illegal git characters.
   */
  validateBranchName(name: string): boolean {
    const hasIllegal = /[\s~^:?*\\[\]|@{}>]/.test(name);
    const startsWrong = name.startsWith('-') || name.startsWith('.');
    const hasDoubleDot = name.includes('..');

    if (hasIllegal || startsWrong || hasDoubleDot || name === '') {
      Logger.error(`Invalid branch name: "${name}"`);
      Logger.info('Branch names cannot contain spaces, ~, ^, :, ?, *, \\, [, ]');
      return false;
    }
    return true;
  }

  /**
   * Validates that a commit message is not empty and has reasonable length.
   */
  validateCommitMessage(message: string): boolean {
    if (!message || message.trim() === '') {
      Logger.error('Commit message cannot be empty');
      return false;
    }
    if (message.length > 72) {
      Logger.warning(`Commit message is ${message.length} chars. Convention recommends max 72.`);
    }
    return true;
  }
}
