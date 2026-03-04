import { Command } from 'commander';
import chalk from 'chalk';
import { GitManager } from '../classes/GitManager';
import { Validator } from '../classes/Validator';
import { Logger } from '../classes/Logger';

export function registerQuick(program: Command, git: GitManager, validator: Validator) {
    program
        .command('quick <message>')
        .description('Stage all + commit with YOUR message + push  (no AI needed)')
        .option('--no-push', 'Skip push after committing')
        .action(async (message: string, options) => {
            if (!await validator.requireGitRepo()) return;
            if (!validator.validateCommitMessage(message)) return;

            Logger.info('Running quick commit…');
            try {
                Logger.info('Staging all files…');
                await git.stageAll();

                Logger.info('Committing…');
                await git.commit(message);

                if (options.push) {
                    Logger.info('Pushing…');
                    await git.push();
                    Logger.success(`Quick commit + push done: ${chalk.yellow.bold(message)}`);
                } else {
                    Logger.success(`Quick commit done: ${chalk.yellow.bold(message)}`);
                }
            } catch (err: any) {
                Logger.error('Quick commit failed');
                Logger.error(err.message);
            }
        });
}
