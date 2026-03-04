import { Command } from 'commander';
import chalk from 'chalk';
import { GitManager } from '../classes/GitManager';
import { GeminiAI } from '../classes/GeminiAI';
import { Validator } from '../classes/Validator';
import { Logger } from '../classes/Logger';

export function registerSuggest(program: Command, git: GitManager, validator: Validator) {
    program
        .command('suggest')
        .description('Get an AI-powered commit message suggestion without committing')
        .action(async () => {
            if (!await validator.requireGitRepo()) return;
            if (!await validator.requireApiKey(process.env.GEMINI_API_KEY, 'Gemini')) return;

            const ai = new GeminiAI(process.env.GEMINI_API_KEY!);
            Logger.info('Analysing your changes…');

            try {
                const status = await git.getStatus();
                const files = [...status.staged, ...status.modified];

                if (files.length === 0) {
                    Logger.error('No changes found to analyse');
                    return;
                }

                const diff = await git.getDiffContent();

                let message: string;
                try {
                    message = await ai.generateCommitMessage(diff, files);
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

                Logger.success('Suggestion ready!');

                Logger.aiBox(message);
                Logger.info(`To use it: ${chalk.cyan(`gitmate quick "${message}"`)}`);
            } catch (err: any) {
                Logger.error('Failed to generate suggestion');
                Logger.error(err?.response?.data?.error?.message || err.message);
            }
        });
}
