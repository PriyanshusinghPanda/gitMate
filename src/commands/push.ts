import { Command } from 'commander';
import chalk from 'chalk';
import { GitManager } from '../classes/GitManager';
import { Validator } from '../classes/Validator';
import { Logger } from '../classes/Logger';

export function registerPush(program: Command, git: GitManager, validator: Validator) {
    program
        .command('push')
        .description('Push current branch to remote')
        .action(async () => {
            if (!await validator.requireGitRepo()) return;
            Logger.info('Pushing…');
            try {
                await git.push();
                Logger.success('Pushed successfully!');
            } catch (err: any) {
                Logger.error('Push failed');
                Logger.error(err.message);
            }
        });
}
