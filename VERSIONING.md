# Semantic Versioning Guide

This project uses [Semantic Versioning](https://semver.org/) with automated changelog generation via [standard-version](https://github.com/conventional-changelog/standard-version).

## Version Format

**MAJOR.MINOR.PATCH** (e.g., `1.2.3`)

- **MAJOR**: Breaking changes (incompatible API changes)
- **MINOR**: New features (backward-compatible)
- **PATCH**: Bug fixes (backward-compatible)

## Conventional Commits

All commits should follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>: <description>

[optional body]

[optional footer]
```

### Commit Types

| Type | Version Bump | Description | Included in Changelog |
|------|--------------|-------------|----------------------|
| `feat` | MINOR | New feature | ✓ |
| `fix` | PATCH | Bug fix | ✓ |
| `docs` | PATCH | Documentation changes | ✓ |
| `refactor` | PATCH | Code refactoring | ✓ |
| `perf` | PATCH | Performance improvements | ✓ |
| `style` | PATCH | Code style changes | ✗ |
| `test` | PATCH | Test additions/changes | ✗ |
| `chore` | PATCH | Build/tooling changes | ✗ |

### Breaking Changes

To trigger a MAJOR version bump, add `BREAKING CHANGE:` in the commit footer:

```
feat: redesign authentication system

BREAKING CHANGE: The old auth API has been completely removed.
Users must migrate to the new authentication flow.
```

## Release Workflow

### 1. Make Changes with Conventional Commits

```bash
git commit -m "feat: add user profile page"
git commit -m "fix: resolve login button styling"
git commit -m "docs: update API documentation"
```

### 2. Create a Release

#### Automatic Version Bump (Recommended)
Based on your commits, standard-version will automatically determine the version:

```bash
npm run release
```

This will:
- Analyze commits since the last release
- Determine version bump (major/minor/patch)
- Update `package.json` version
- Generate/update `CHANGELOG.md`
- Create a git commit and tag

#### Manual Version Bump
Force a specific version bump:

```bash
# Patch: 0.1.0 → 0.1.1
npm run release:patch

# Minor: 0.1.0 → 0.2.0
npm run release:minor

# Major: 0.1.0 → 1.0.0
npm run release:major
```

#### First Release
For the initial release only:

```bash
npm run release:first
```

### 3. Push Changes and Tags

```bash
git push --follow-tags origin main
```

### 4. Deploy (Vercel)

Since the frontend is hosted on Vercel with CI/CD:
- Pushing to `main` automatically triggers a deployment
- Vercel will build and deploy the new version
- No manual deployment steps needed

## Examples

### Feature Release (Minor Version)

```bash
# Make feature commits
git commit -m "feat: add business analytics dashboard"
git commit -m "feat: implement export to CSV"
git commit -m "fix: correct date formatting"

# Create release (0.1.0 → 0.2.0)
npm run release

# Push
git push --follow-tags origin main
```

### Bug Fix Release (Patch Version)

```bash
# Make fix commits
git commit -m "fix: resolve authentication timeout"
git commit -m "fix: correct chart rendering"

# Create release (0.2.0 → 0.2.1)
npm run release

# Push
git push --follow-tags origin main
```

### Breaking Change Release (Major Version)

```bash
# Make breaking change commit
git commit -m "feat: redesign API integration

BREAKING CHANGE: Replaced mock data with real API calls.
All components now require API_URL environment variable."

# Create release (0.2.1 → 1.0.0)
npm run release

# Push
git push --follow-tags origin main
```

## Changelog

The `CHANGELOG.md` file is automatically generated and includes:
- Version number and release date
- Grouped changes by type (Features, Bug Fixes, etc.)
- Links to commits and comparisons
- Breaking change warnings

**Do not manually edit** `CHANGELOG.md` - it's managed by standard-version.

## Best Practices

1. **Commit Often**: Make small, focused commits
2. **Use Conventional Format**: Always follow the commit message format
3. **One Logical Change**: Each commit should represent one logical change
4. **Descriptive Messages**: Write clear, descriptive commit messages
5. **Test Before Release**: Run `npm run lint` and `npm run build` before releasing
6. **Regular Releases**: Release frequently to keep changelog manageable
7. **Review Changelog**: Check the generated changelog before pushing

## Troubleshooting

### Wrong Version Bump

If standard-version bumps the wrong version:

```bash
# Reset the release commit and tag
git reset --hard HEAD~1
git tag -d v0.x.x

# Use manual version bump
npm run release:patch  # or :minor or :major
```

### Skipping Release

To create a release without bumping version:

```bash
npx standard-version --skip.bump
```

### Dry Run

Preview what standard-version will do:

```bash
npx standard-version --dry-run
```

## Additional Resources

- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [standard-version Documentation](https://github.com/conventional-changelog/standard-version)
- [Keep a Changelog](https://keepachangelog.com/)
