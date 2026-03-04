import { Command } from 'commander';
import { Logger } from '../classes/Logger';

export function registerInfo(program: Command) {
    program
        .command('info')
        .description('Show GitMate info and all available commands')
        .action(() => {
            Logger.banner();
            program.outputHelp();
        });
}
