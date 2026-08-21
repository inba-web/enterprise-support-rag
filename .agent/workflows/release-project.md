---
description: Tag and publish a production release for thedal-rag
---

Follow these step-by-step instructions to create a tag and publish a GitHub release for thedal-rag:

1. **Staging and Committing Changes**:
   Ensure all changes are staged and committed:
   ```bash
   git add .
   git commit -m "chore: configure enterprise branding and database telemetry updates"
   ```

2. **Pushing Changes to Main**:
   Push the committed changes to your default branch on the remote:
   ```bash
   git push origin main
   ```

3. **Tagging the Release**:
   Create a semantic version tag (e.g., `v1.0.0`):
   ```bash
   git tag -a v1.0.0 -m "Release v1.0.0: Enterprise Branding Overhaul & Telemetry Status configurations"
   ```

4. **Pushing the Tag**:
   Transmit the tag to remote github repository:
   ```bash
   git push origin v1.0.0
   ```

5. **Publishing on GitHub**:
   * Open the repository page on GitHub.
   * On the right-hand panel, click on **Releases** -> **Draft a new release**.
   * Under **Choose a tag**, select `v1.0.0`.
   * Set the Release Title to `v1.0.0 - Initial Enterprise Release`.
   * Click **Generate release notes** to compile automated changelogs.
   * Click **Publish release**.
