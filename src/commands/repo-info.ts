import { Command } from 'commander';
import chalk from 'chalk';
import { GitManager } from '../classes/GitManager';
import { GitHubAPI } from '../classes/GitHubAPI';
import { Validator } from '../classes/Validator';
import { Logger } from '../classes/Logger';

export function registerRepoInfo(program: Command, git: GitManager, validator: Validator) {
    program
        .command('repo-info')
        .description('Show GitHub stats for the current repository')
        .action(async () => {
            if (!await validator.requireGitRepo()) return;

            const github = new GitHubAPI(process.env.GITHUB_TOKEN);
            Logger.info('Fetching repo info…');

            try {
                const details = await git.getRepoDetails();
                if (!details) {
                    Logger.error('Could not detect a GitHub remote URL in this repo');
                    Logger.info('Make sure you have an "origin" remote pointing to GitHub');
                    return;
                }

                const repo = await github.getRepoInfo(details.owner, details.repo);
                Logger.success(`Fetched: ${repo.full_name}`);

                Logger.infoBox(`📦 Repo — ${repo.full_name}`, {
                    '📝 Description': repo.description || 'N/A',
                    '⭐ Stars': String(repo.stargazers_count),
                    '🍴 Forks': String(repo.forks_count),
                    '👁️  Watchers': String(repo.watchers_count),
                    '🐛 Open Issues': String(repo.open_issues_count),
                    '💻 Language': repo.language || 'N/A',
                    '🌿 Default Branch': repo.default_branch,
                    '🔗 URL': repo.html_url,
                });
            } catch (err: any) {
                Logger.error('Failed to fetch repo info');
                if (err?.response?.status === 404) {
                    Logger.error('Repository not found on GitHub (may be private — add GITHUB_TOKEN to .env)');
                } else {
                    Logger.error(err.message);
                }
            }
        });
}
