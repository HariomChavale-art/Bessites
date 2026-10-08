
# Webdock

Professional discovery engine and creator suite.

## Git Configuration & Synchronization

To ensure your changes are pushed to GitHub correctly from Firebase Studio, follow these steps:

### 1. Initial Setup (One-time)
Run this command to link your repository and set the main branch:
```bash
npm run setup-git
```

### 2. Authentication
If you haven't set up credentials yet, run:
```bash
npm run auth-git
```
Then run a manual `git push`. When prompted:
- **Username**: Your GitHub username
- **Password**: Your GitHub Personal Access Token (PAT)

### 3. Daily Sync
To commit and push all current changes to GitHub:
```bash
npm run sync
```

## Quick Commands Reference

- `npm run dev`: Start development server
- `npm run sync`: Fast commit and push to GitHub
- `npm run pull-git`: Pull latest changes from GitHub (rebase mode)
- `npm run check-git`: Verify the remote Git URL
