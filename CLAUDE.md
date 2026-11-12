@AGENTS.md

# Workflow for website changes

- Whenever I ask for a change to the website, make it locally and send me the local dev server link (http://localhost:3000) so I can check it. Do not commit, push, or open a PR at this stage.
- Only when I say "push to main": create a branch, commit, push, open a pull request to `main` on GitHub, and send me the PR link. I merge it myself.
- After I merge a pull request (when I tell you, or when you find an open PR of ours has been merged at the start of the next task): switch my computer to `main`, pull the latest version, delete the merged local branch, run `npm install` if dependencies changed, and restart the local dev server, so every new change starts from the latest website.
