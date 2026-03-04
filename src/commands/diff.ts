import { Command } from 'commander';
import chalk from 'chalk';
import { GitManager } from '../classes/GitManager';
import { Validator } from '../classes/Validator';
import { Logger } from '../classes/Logger';

export function registerDiff(program: Command, git: GitManager, validator: Validator) {
    program
        .command('diff')
        .description('Show a summary of current staged/unstaged changes')
        .action(async () => {
            if (!await validator.requireGitRepo()) return;
            try {
                const diffSummary = await git.getDiff();
                const status = await git.getStatus();

                console.log('');
                Logger.divider();
                console.log(chalk.bold.cyan('  📊 Changes Summary'));
                Logger.divider();

                if (!diffSummary && status.modified.length === 0 && status.staged.length === 0) {
                    Logger.info('No changes detected');
                    return;
                }

                if (diffSummary) {
                    console.log(chalk.white(diffSummary));
                } else {
                    [...status.staged, ...status.modified].forEach(f => {
                        console.log(chalk.yellow(`  ~  ${f}`));
                    });
                }
            } catch (err: any) {
                Logger.error(err.message);
            }
        });
}
