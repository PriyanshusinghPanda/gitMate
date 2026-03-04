import { Command } from 'commander';
import { GitHubAPI } from '../classes/GitHubAPI';
import { Logger } from '../classes/Logger';
import { Validator } from '../classes/Validator';

export function registerWhoAmI(program: Command, validator: Validator) {
    program
        .command('whoami <username>')
        .description('Look up a GitHub profile  (e.g. gitmate whoami torvalds)')
        .action(async (username: string) => {
            if (!await validator.requireApiKey(process.env.GITHUB_TOKEN, 'GitHub')) return;

            const github = new GitHubAPI(process.env.GITHUB_TOKEN);
            Logger.info(`Fetching GitHub profile: ${username}…`);

            try {
                const user = await github.getUserInfo(username);
                Logger.success(`Found: ${user.name || user.login}`);

                Logger.infoBox(`👤 GitHub Profile — @${user.login}`, {
                    '🔖 Name': user.name || 'N/A',
                    '📝 Bio': user.bio || 'N/A',
                    '📦 Public Repos': String(user.public_repos),
                    '👥 Followers': String(user.followers),
                    '➡️  Following': String(user.following),
                    '📍 Location': user.location || 'N/A',
                    '🗓️  Joined': new Date(user.created_at).getFullYear().toString(),
                    '🔗 URL': user.html_url,
                });
            } catch (err: any) {
                Logger.error('Failed to fetch profile');
                if (err?.response?.status === 404) {
                    Logger.error(`User "${username}" not found on GitHub`);
                } else {
                    Logger.error(err.message);
                }
            }
        });
}
