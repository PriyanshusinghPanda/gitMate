#!/usr/bin/env node

import { Command } from 'commander';
import dotenv from 'dotenv';

import { GitManager } from './classes/GitManager';
import { Validator } from './classes/Validator';
import { Logger } from './classes/Logger';

// Import commands
import { registerCommitAll } from './commands/commit-all';
import { registerCommitStaged } from './commands/commit-staged';
import { registerQuick } from './commands/quick';
import { registerPush } from './commands/push';
import { registerStatus } from './commands/status';
import { registerLog } from './commands/log';
import { registerUndo } from './commands/undo';
import { registerBranch } from './commands/branch';
import { registerWhoAmI } from './commands/whoami';
import { registerRepoInfo } from './commands/repo-info';
import { registerDiff } from './commands/diff';
import { registerSuggest } from './commands/suggest';
import { registerInfo } from './commands/info';

dotenv.config();

const program = new Command();
const git = new GitManager();
const validator = new Validator();

program
  .name('gitmate')
  .description('Your Smart Git Companion — AI-powered commits with Google Gemini')
  .version('1.0.0', '-v, --version', 'Show GitMate version');

// Register all commands
registerCommitAll(program, git, validator);
registerCommitStaged(program, git, validator);
registerQuick(program, git, validator);
registerPush(program, git, validator);
registerStatus(program, git, validator);
registerLog(program, git, validator);
registerUndo(program, git, validator);
registerBranch(program, git, validator);
registerWhoAmI(program, validator);
registerRepoInfo(program, git, validator);
registerDiff(program, git, validator);
registerSuggest(program, git, validator);
registerInfo(program);

program.parse(process.argv);

if (process.argv.slice(2).length === 0) {
  Logger.banner();
  program.outputHelp();
}
