import chalk from 'chalk';

export class Logger {
  static success(message: string): void {
    console.log(chalk.green('✓ ') + chalk.green(message));
  }

  static error(message: string): void {
    console.log(chalk.red('✗ ') + chalk.red(message));
  }

  static info(message: string): void {
    console.log(chalk.cyan('ℹ ') + message);
  }

  static warning(message: string): void {
    console.log(chalk.yellow('⚠ ') + chalk.yellow(message));
  }

  static ai(message: string): void {
    console.log(chalk.magenta('🤖 ') + chalk.magenta(message));
  }

  static divider(): void {
    console.log(chalk.dim('─'.repeat(54)));
  }

  static banner(): void {
    console.log('');
    console.log(chalk.magenta.bold('   ██████╗ ██╗████████╗███╗   ███╗ █████╗ ████████╗███████╗'));
    console.log(chalk.magenta.bold('  ██╔════╝ ██║╚══██╔══╝████╗ ████║██╔══██╗╚══██╔══╝██╔════╝'));
    console.log(chalk.magenta.bold('  ██║  ███╗██║   ██║   ██╔████╔██║███████║   ██║   █████╗  '));
    console.log(chalk.magenta.bold('  ██║   ██║██║   ██║   ██║╚██╔╝██║██╔══██║   ██║   ██╔══╝  '));
    console.log(chalk.magenta.bold('  ╚██████╔╝██║   ██║   ██║ ╚═╝ ██║██║  ██║   ██║   ███████╗'));
    console.log(chalk.magenta.bold('   ╚═════╝ ╚═╝   ╚═╝   ╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝'));
    console.log('');
    console.log(chalk.dim('  Your Smart Git Companion — Powered by Google Gemini 🤖'));
    console.log('');
  }

  static aiBox(message: string): void {
    const lines = message.split('\n').filter(l => l.trim());
    const width = 48;

    console.log('');
    console.log(chalk.green('  ╔' + '═'.repeat(width) + '╗'));
    console.log(chalk.green('  ║') + chalk.bold.white('  🤖 AI Generated Commit Message') + ' '.repeat(width - 32) + chalk.green('║'));
    console.log(chalk.green('  ╠' + '═'.repeat(width) + '╣'));
    lines.forEach(line => {
      const truncated = line.length > width - 4 ? line.substring(0, width - 7) + '...' : line;
      const padded = truncated.padEnd(width - 2);
      console.log(chalk.green('  ║') + '  ' + chalk.yellow.bold(padded) + chalk.green('║'));
    });
    console.log(chalk.green('  ╚' + '═'.repeat(width) + '╝'));
    console.log('');
  }

  static infoBox(title: string, data: Record<string, string>): void {
    const width = 48;
    console.log('');
    console.log(chalk.cyan('  ╔' + '═'.repeat(width) + '╗'));
    const titlePad = title.padEnd(width - 2);
    console.log(chalk.cyan('  ║') + '  ' + chalk.bold.white(titlePad) + chalk.cyan('║'));
    console.log(chalk.cyan('  ╠' + '═'.repeat(width) + '╣'));
    Object.entries(data).forEach(([key, value]) => {
      const valTrunc = value.length > 28 ? value.substring(0, 25) + '...' : value;
      const line = `${key}`.padEnd(16) + chalk.white(valTrunc);
      const raw = `${key.padEnd(16)}${valTrunc}`;
      const pad = ' '.repeat(Math.max(0, width - 2 - raw.length));
      console.log(chalk.cyan('  ║') + '  ' + chalk.yellow(key.padEnd(16)) + chalk.white(valTrunc) + pad + chalk.cyan('║'));
    });
    console.log(chalk.cyan('  ╚' + '═'.repeat(width) + '╝'));
    console.log('');
  }
}
