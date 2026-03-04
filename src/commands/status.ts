import { Command } from 'commander';
import chalk from 'chalk';
import { GitManager } from '../classes/GitManager';
import { Validator } from '../classes/Validator';
import { Logger } from '../classes/Logger';

export function registerStatus(program: Command, git: GitManager, validator: Validator) {
    program
        .command('status')
        .description('Show a pretty, coloured git status')
        .action(async () => {
            if (!await validator.requireGitRepo()) return;
            try {
                const status = await git.getStatus();
                const branch = status.current || 'unknown';

                console.log('');
                Logger.divider();
                console.log(chalk.bold('  📍 Branch: ') + chalk.cyan.bold(branch));
                Logger.divider();

                if (status.staged.length > 0) {
                    console.log(chalk.green.bold('\n  ✅ Staged for commit:'));
                    status.staged.forEach(f => console.log(chalk.green(`    +  ${f}`)));
                }
                if (status.modified.length > 0) {
                    console.log(chalk.yellow.bold('\n  📝 Modified (not staged):'));
                    status.modified.forEach(f => console.log(chalk.yellow(`    ~  ${f}`)));
                }
                if (status.not_added.length > 0) {
                    console.log(chalk.dim.bold('\n  ❓ Untracked:'));
                    status.not_added.forEach(f => console.log(chalk.dim(`    ?  ${f}`)));
                }
                if (status.deleted.length > 0) {
                    console.log(chalk.red.bold('\n  🗑️  Deleted:'));
                    status.deleted.forEach(f => console.log(chalk.red(`    -  ${f}`)));
                }
                if (status.conflicted.length > 0) {
                    console.log(chalk.red.bold('\n  💥 Conflicted:'));
                    status.conflicted.forEach(f => console.log(chalk.red(`    !!  ${f}`)));
                }

                const totalChanges =
                    status.staged.length + status.modified.length +
                    status.not_added.length + status.deleted.length;

                console.log('');
                if (totalChanges === 0) {
                    Logger.success('Nothing to commit — working tree clean');
                } else {
                    Logger.info(`${totalChanges} change(s) detected`);
                }
            } catch (err: any) {
                Logger.error(err.message);
            }
        });
}
