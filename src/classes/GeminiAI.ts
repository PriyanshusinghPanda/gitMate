import axios from 'axios';

export class GeminiAI {
  private apiKey: string;
  // gemini-2.5-flash is free-tier and fast
  private model: string = 'gemini-2.5-flash';
  private baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta/models';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Sends the git diff and file list to Gemini and returns a
   * conventional-commit style message.
   */
  async generateCommitMessage(diff: string, stagedFiles: string[]): Promise<string> {
    const filesStr = stagedFiles.join(', ');
    // Keep the diff concise to stay within free-tier token limits
    const diffSummary = diff.substring(0, 3000);

    const prompt = `You are an expert Git commit message writer.

Given the following changed files and git diff, write ONE concise commit message.

Rules:
- Follow Conventional Commits: type(scope): short description
- Valid types: feat, fix, docs, style, refactor, test, chore
- Max 72 characters on the first line
- Use imperative mood ("add" not "added")
- Be specific — no vague messages like "update stuff"
- Return ONLY the commit message string, nothing else, no quotes, no markdown, no explanation

Changed files: ${filesStr}

Git diff:
${diffSummary}`;

    try {
      const response = await axios.post(
        `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 100,
          },
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const text: string | undefined =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) throw new Error('Gemini returned an empty response');

      // Strip any accidental surrounding quotes
      return text.trim().replace(/^["'`]|["'`]$/g, '');
    } catch (error: any) {
      if (error.response?.status === 400 && error.response?.data?.error?.message?.includes('API key not valid')) {
        throw new Error('AUTH_ERROR_GEMINI');
      }
      throw error;
    }
  }
}
