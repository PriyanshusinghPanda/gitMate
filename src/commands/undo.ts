import { Command } from 'commander';
import chalk from 'chalk';
import { GitManager } from '../classes/GitManager';
import { Validator } from '../classes/Validator';
import { Logger } from '../classes/Logger';

export function registerUndo(program: Command, git: GitManager, validator: Validator) {
    program
        .command('undo')
        .description('Undo last commit — keeps changes staged (use --hard to discard)')
        .option('--hard', 'Discard all changes from the last commit (IRREVERSIBLE)')
        .action(async (options) => {
            if (!await validator.requireGitRepo()) return;

            if (options.hard) {
                Logger.warning('--hard will permanently discard all changes from the last commit!');
            }

            Logger.info('Undoing last commit…');
            try {
                await git.undoLastCommit(options.hard || false);
                if (options.hard) {
                    Logger.warning('Last commit undone — all changes discarded');
                    Logger.warning('Changes are gone permanently.');
                } else {
                    Logger.success('Last commit undone — changes are back in staging');
                    Logger.info('Your files are still there, just uncommitted.');
                }
            } catch (err: any) {
                Logger.error('Undo failed');
                Logger.error(err.message);
            }
        });
}
