import { Command } from 'commander';
import chalk from 'chalk';
import { GitManager } from '../classes/GitManager';
import { Validator } from '../classes/Validator';
import { Logger } from '../classes/Logger';

export function registerLog(program: Command, git: GitManager, validator: Validator) {
    program
        .command('log')
        .description('Show a pretty, coloured commit history')
        .option('-l, --limit <number>', 'Number of commits to show', '10')
        .action(async (options) => {
            if (!await validator.requireGitRepo()) return;
            try {
                const limit = parseInt(options.limit, 10) || 10;
                const log = await git.getLog(limit);
                const branch = await git.getCurrentBranch();

                console.log('');
                Logger.divider();
                console.log(chalk.bold(`  📜 Last ${limit} commits on `) + chalk.cyan(branch));
                Logger.divider();

                log.all.forEach(commit => {
                    const date = new Date(commit.date).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric'
                    });
                    const hash = chalk.yellow(commit.hash.substring(0, 7));
                    const msgText = chalk.white.bold(commit.message);
                    const author = chalk.dim(commit.author_name);
                    const dateStr = chalk.dim(date);
                    console.log(`\n  ${hash}  ${msgText}`);
                    console.log(`          ${author}  ·  ${dateStr}`);
                });

                console.log('');
            } catch (err: any) {
                Logger.error(err.message);
            }
        });
}
