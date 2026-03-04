import { Command } from 'commander';
import { Validator } from '../classes/Validator';
import { Logger } from '../classes/Logger';
import { ConfigManager } from '../classes/ConfigManager';

export function registerSetup(program: Command, validator: Validator) {
    program
        .command('setup')
        .description('Manually configure or update your API keys (Gemini & GitHub)')
        .action(async () => {
            Logger.info('--- GitMate Setup ---');

            const choices = ['Gemini API Key', 'GitHub Token', 'Update All', 'Exit'];
            Logger.info('Choose what you want to update:');

            // Since we don't have a list selector, we'll just prompt for both or use flags in the future.
            // For now, let's keep it simple: ask for Gemini, then ask for GitHub.

            const updateGemini = await validator.requireApiKey('', 'Gemini');
            const updateGitHub = await validator.requireApiKey('', 'GitHub');

            if (updateGemini || updateGitHub) {
                Logger.success('Setup completed! Your keys have been updated.');
            } else {
                Logger.info('Setup cancelled or no changes made.');
            }
        });
}
