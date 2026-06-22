# Distribution & publishing

## Putting it on GitHub

This folder is a self-contained repo. From it:

```bash
git init
git add -A
git commit -m "agentkan: initial commit"
git branch -M main
git remote add origin git@github.com:HasanKhatib/agentkan.git
git push -u origin main
```

## Publishing to npm

`agentkan@0.1.0` is already on npm. To publish updates:

1. Create a fresh **automation token** at npmjs.com → Access Tokens. Never paste
   a token into a chat or commit it.
2. Locally:

   ```bash
   npm login
   npm test
   npm version patch     # optional: bump semver and create a git tag
   npm publish --access public
   git push --follow-tags
   ```

After publishing, anyone can use it with no install:

```bash
npx agentkan init
```

## Testing the package without publishing

To verify the real install path without touching the registry:

```bash
npm pack                              # builds agentkan-x.y.z.tgz
cd /tmp && mkdir t && cd t && npm init -y
npm install /path/to/agentkan-x.y.z.tgz
npx agentkan init && npx agentkan validate
```

This installs the exact tarball npm would ship. CI (`.github/workflows/ci.yml`)
runs the smoke test on Node 18/20/22 on every push.

## Versioning

Semver. Patch for fixes, minor for new commands/fields (keep the schema
backward-compatible — additive), major if the data model changes in a way that
breaks existing boards. If you change the schema, bump `version` inside the JSON
files and handle migration in `init`/`validate`.
