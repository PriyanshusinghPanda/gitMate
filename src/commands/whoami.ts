import { Command } from 'commander';
import { GitHubAPI } from '../classes/GitHubAPI';
import { Logger } from '../classes/Logger';
import { Validator } from '../classes/Validator';

export function registerWhoAmI(program: Command, validator: Validator) {
    program
        .command('whoami [username]')
        .description('Look up a GitHub profile (yours by default)')
        .action(async (username?: string) => {
            if (!await validator.requireApiKey(process.env.GITHUB_TOKEN, 'GitHub')) return;

            const github = new GitHubAPI(process.env.GITHUB_TOKEN);

            try {
                if (username) {
                    Logger.info(`Fetching GitHub profile: ${username}…`);
                } else {
                    Logger.info('Fetching your own GitHub profile…');
                }

                let user;
                try {
                    user = username
                        ? await github.getUserInfo(username)
                        : await github.getAuthenticatedUser();
                } catch (error: any) {
                    if (error.response?.status === 401 || error.response?.status === 403) {
                        const updated = await validator.handleAuthError('GitHub');
                        if (updated) {
                            Logger.info('Please run the command again with your new token.');
                        }
                        return;
                    }
                    throw error;
                }

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
                    Logger.error(username ? `User "${username}" not found` : 'Your profile not found (check your token)');
                } else {
                    Logger.error(err.message);
                }
            }
        });
}
