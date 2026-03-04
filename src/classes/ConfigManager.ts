import fs from 'fs';
import path from 'path';

export class ConfigManager {
    private static envPath = path.join(process.cwd(), '.env');

    /**
     * Updates or adds a key-value pair in the .env file.
     */
    static async set(key: string, value: string): Promise<void> {
        let content = '';

        if (fs.existsSync(this.envPath)) {
            content = fs.readFileSync(this.envPath, 'utf8');
        }

        const lines = content.split('\n');
        const existingIndex = lines.findIndex(line => line.startsWith(`${key}=`));

        if (existingIndex !== -1) {
            lines[existingIndex] = `${key}=${value}`;
        } else {
            lines.push(`${key}=${value}`);
        }

        fs.writeFileSync(this.envPath, lines.join('\n').trim() + '\n');
    }

    /**
     * Reloads process.env from the .env file.
     */
    static reload(): void {
        if (fs.existsSync(this.envPath)) {
            const content = fs.readFileSync(this.envPath, 'utf8');
            const lines = content.split('\n');
            lines.forEach(line => {
                const [key, ...rest] = line.split('=');
                if (key && rest.length > 0) {
                    process.env[key.trim()] = rest.join('=').trim();
                }
            });
        }
    }
}
