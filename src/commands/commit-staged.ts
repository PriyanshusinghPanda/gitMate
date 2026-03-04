import { Command } from 'commander';
import chalk from 'chalk';
import { GitManager } from '../classes/GitManager';
import { GeminiAI } from '../classes/GeminiAI';
import { Validator } from '../classes/Validator';
import { Logger } from '../classes/Logger';

export function registerCommitStaged(program: Command, git: GitManager, validator: Validator) {
    program
        .command('commit-staged')
        .description('Use already-staged files + AI-generate commit message + push')
        .option('--no-push', 'Skip push after committing')
        .action(async (options) => {
            if (!await validator.requireGitRepo()) return;
            if (!await validator.requireApiKey(process.env.GEMINI_API_KEY, 'Gemini')) return;

            const ai = new GeminiAI(process.env.GEMINI_API_KEY!);
            Logger.info('Checking staged files…');

            try {
                const status = await git.getStatus();

                if (status.staged.length === 0) {
                    Logger.error('No staged files found. Run `git add <files>` or use `gitmate commit-all`');
                    return;
                }

                Logger.success(`Found ${status.staged.length} staged file(s)`);

                Logger.info('Generating AI commit message…');
                const diff = await git.getDiffContent();

                let message: string;
                try {
                    message = await ai.generateCommitMessage(diff, status.staged);
                } catch (err: any) {
                    if (err.message === 'AUTH_ERROR_GEMINI') {
                        const updated = await validator.handleAuthError('Gemini');
                        if (updated) {
                            Logger.info('Please run the command again with your new key.');
                        }
                        return;
                    }
                    throw err;
                }

                Logger.success('AI commit message generated');

                Logger.aiBox(message);

                Logger.info('Committing…');
                await git.commit(message);
                Logger.success(`Committed: ${chalk.yellow.bold(message)}`);

                if (options.push) {
                    Logger.info('Pushing…');
                    await git.push();
                    Logger.success('Pushed to remote');
                } else {
                    Logger.info('Skipped push (--no-push flag)');
                }

                Logger.success('Done! 🎉');
            } catch (err: any) {
                Logger.error('Failed');
                Logger.error(err?.response?.data?.error?.message || err.message);
            }
        });
}
