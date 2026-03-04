import { Command } from 'commander';
import chalk from 'chalk';
import { GitManager } from '../classes/GitManager';
import { Validator } from '../classes/Validator';
import { Logger } from '../classes/Logger';

export function registerBranch(program: Command, git: GitManager, validator: Validator) {
    program
        .command('branch <name>')
        .description('Create and switch to a new branch')
        .action(async (name: string) => {
            if (!await validator.requireGitRepo()) return;
            if (!validator.validateBranchName(name)) return;

            Logger.info(`Creating branch: ${name}…`);
            try {
                await git.createAndSwitchBranch(name);
                Logger.success(`Switched to new branch: ${chalk.cyan.bold(name)}`);
            } catch (err: any) {
                Logger.error('Branch creation failed');
                Logger.error(err.message);
            }
        });
}
