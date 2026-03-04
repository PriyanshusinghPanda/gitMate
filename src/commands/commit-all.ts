import { Command } from 'commander';
import chalk from 'chalk';
import { GitManager } from '../classes/GitManager';
import { GeminiAI } from '../classes/GeminiAI';
import { Validator } from '../classes/Validator';
import { Logger } from '../classes/Logger';

export function registerCommitAll(program: Command, git: GitManager, validator: Validator) {
    program
        .command('commit-all')
        .description('Stage ALL files + AI-generate commit message + push')
        .option('--no-push', 'Skip push after committing')
        .action(async (options) => {
            if (!await validator.requireGitRepo()) return;
            if (!await validator.requireApiKey(process.env.GEMINI_API_KEY, 'Gemini')) return;

            const ai = new GeminiAI(process.env.GEMINI_API_KEY!);
            Logger.info('Staging all files…');

            try {
                await git.stageAll();
                Logger.success('All files staged');

                const status = await git.getStatus();
                const stagedFiles = status.staged;

                if (stagedFiles.length === 0) {
                    Logger.error('Nothing to commit — working tree is clean');
                    return;
                }

                Logger.info('Analysing changes with Gemini AI…');
                const diff = await git.getDiffContent();
                const message = await ai.generateCommitMessage(diff, stagedFiles);
                Logger.success('AI commit message generated');

                Logger.aiBox(message);

                Logger.info('Committing…');
                await git.commit(message);
                Logger.success(`Committed: ${chalk.yellow.bold(message)}`);

                if (options.push) {
                    Logger.info('Pushing to remote…');
                    await git.push();
                    Logger.success('Pushed to remote');
                } else {
                    Logger.info('Skipped push (--no-push flag)');
                }

                Logger.success('Done! 🎉');
            } catch (err: any) {
                Logger.error('Something went wrong');
                Logger.error(err?.response?.data?.error?.message || err.message);
            }
        });
}
