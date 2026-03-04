import readline from 'readline';
import { GitManager } from './GitManager';
import { Logger } from './Logger';
import { ConfigManager } from './ConfigManager';

export class Validator {
  private git: GitManager;

  constructor() {
    this.git = new GitManager();
  }

  async requireGitRepo(): Promise<boolean> {
    const isRepo = await this.git.isGitRepo();
    if (!isRepo) {
      Logger.error('Not a git repository! Run `git init` first.');
    }
    return isRepo;
  }

  /**
   * Ensures an API key exists. If missing, prompts the user to enter it.
   */
  async requireApiKey(key: string | undefined, name: string): Promise<boolean> {
    if (!key || key.trim() === '') {
      Logger.warning(`${name} API key not found in .env`);

      const input = await this.promptForApiKey(name);
      if (!input || input.trim() === '') {
        Logger.error(`${name} API key is required to proceed.`);
        return false;
      }

      // Save to .env
      const envKey = name.toUpperCase() === 'GEMINI' ? 'GEMINI_API_KEY' : 'GITHUB_TOKEN';
      await ConfigManager.set(envKey, input.trim());
      ConfigManager.reload();

      Logger.success(`${name} API key saved to .env`);
      return true;
    }
    return true;
  }

  private promptForApiKey(name: string): Promise<string> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const promptText = name.toLowerCase() === 'gemini'
      ? `🔑 Enter your Google Gemini API Key: `
      : `🔑 Enter your GitHub Personal Access Token: `;

    return new Promise((resolve) => {
      rl.question(promptText, (answer) => {
        rl.close();
        resolve(answer);
      });
    });
  }

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
