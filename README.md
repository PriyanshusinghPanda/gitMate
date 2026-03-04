# GitMate 🚀

> Your Smart Git Companion — AI-powered commit messages using Google Gemini

GitMate is a CLI tool built with **Node.js + TypeScript** that makes your Git workflow faster and smarter. It generates meaningful commit messages using Google Gemini AI, pulls GitHub profile/repo stats, and wraps common Git operations in a beautiful, coloured terminal UI.

---

## ✨ Features

- 🤖 **AI Commit Messages** — Gemini analyses your diff and writes a proper conventional commit
- 🎨 **Coloured Output** — Everything is colour-coded and easy to read
- 📦 **GitHub Integration** — Look up any user or your current repo stats
- 🔁 **Multiple Workflows** — Commit everything, just staged files, or quick manual commits
- 🛡️ **Validation Layer** — Checks for git repo, API keys, branch names, and more

---

## 🚀 Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Create your `.env` file
```bash
cp .env.example .env
```

Then fill in your keys:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GITHUB_TOKEN=your_github_token_here   # optional
```

**Getting a Gemini API key (free):**
1. Go to [https://aistudio.google.com/](https://aistudio.google.com/)
2. Click **"Get API Key"** → Create new key
3. The free tier uses `gemini-2.5-flash` — no billing required

**Getting a GitHub Token (optional):**
1. GitHub → Settings → Developer Settings → Personal Access Tokens
2. Generate token with `read:user` and `public_repo` scopes 
3. Increases rate limit from 60 → 5000 requests/hour

### 3. Build the project
```bash
npm run build
```

### 4. Link globally (use `gitmate` from anywhere)
```bash
npm link
```

---

## 📖 Available Commands

| Command | Description |
|---|---|
| `gitmate commit-all` | Stage all files + AI commit message + push |
| `gitmate commit-all --no-push` | Stage all files + AI commit message (no push) |
| `gitmate commit-staged` | Already-staged files + AI commit message + push |
| `gitmate commit-staged --no-push` | Already-staged files + AI commit message (no push) |
| `gitmate quick "message"` | Stage all + your message + push |
| `gitmate quick "message" --no-push` | Stage all + your message (no push) |
| `gitmate push` | Push current branch to remote |
| `gitmate status` | Pretty, coloured git status |
| `gitmate log` | Pretty commit history (last 10) |
| `gitmate log --limit 5` | Last N commits |
| `gitmate undo` | Undo last commit, keep changes staged |
| `gitmate undo --hard` | Undo last commit, discard all changes |
| `gitmate branch <name>` | Create and switch to a new branch |
| `gitmate whoami <username>` | GitHub profile info for any user |
| `gitmate repo-info` | GitHub stats for current repository |
| `gitmate diff` | Pretty diff/change summary |
| `gitmate suggest` | AI commit suggestion (no commit) |
| `gitmate info` | Show banner + all commands |
| `gitmate --version` | Show version number |

---

## 💡 Example Usage

```bash
# Made some changes? Let AI write the commit message:
gitmate commit-all

# Already staged specific files? Same but smarter:
git add src/auth.ts
gitmate commit-staged

# Quick commit with your own message:
gitmate quick "fix: resolve login redirect bug"

# Just want a suggestion without committing:
gitmate suggest

# Check your repo's GitHub stats:
gitmate repo-info

# Look up any GitHub user:
gitmate whoami torvalds

# Oops, wrong commit? Undo it:
gitmate undo

# See what's changed before committing:
gitmate diff
gitmate status
```

---

## 🏗️ Project Structure

```
gitmate/
├── src/
│   ├── index.ts                # CLI entry point (Commander setup, all commands)
│   └── classes/
│       ├── GitManager.ts       # Git operations (simple-git wrapper)
│       ├── GeminiAI.ts         # Google Gemini API integration
│       ├── GitHubAPI.ts        # GitHub REST API integration
│       ├── Logger.ts           # Coloured terminal output
│       └── Validator.ts        # Input & environment validation
├── dist/                       # Compiled JS output (after npm run build)
├── .env                        # Your API keys (not committed)
├── .env.example                # Template for .env
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🛠️ OOP Design

| Class | Responsibility |
|---|---|
| `GitManager` | Wraps `simple-git` — all local git operations |
| `GeminiAI` | Calls Gemini REST API to generate commit messages |
| `GitHubAPI` | Calls GitHub REST API for user and repo data |
| `Logger` | All coloured console output, boxes, banners |
| `Validator` | Validates git repo, API keys, branch names, messages |

---

## 📦 APIs Used

| API | Purpose | Free Tier |
|---|---|---|
| Google Gemini (`gemini-2.5-flash`) | AI commit message generation | ✅ Yes |
| GitHub REST API | User profiles & repo stats | ✅ Yes (60 req/hr unauthenticated) |

---

## 📜 Scripts

```bash
npm run build   # Compile TypeScript → dist/
npm run dev     # Run directly with ts-node (no build needed)
npm start       # Run compiled version from dist/
```
