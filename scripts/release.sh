#!/usr/bin/env bash

set -e # exit with nonzero exit code if anything fails

if [[ $GITHUB_ACTOR == "carbon-bot" ]]; then
  # exit early — carbon-bot pushed the version commit, don't publish again
  exit 0
fi

# set username and email so git knows who we are
git config user.name "carbon-bot"
git config user.email "carbon@us.ibm.com"

# Add github token to git credentials
git config credential.helper "store --file=.git/credentials"
echo "https://${GH_TOKEN}:@github.com" >.git/credentials 2>/dev/null

# fetch everything to make sure our refs are up to date
git fetch --all

# if we're on the master branch, check if we're up to date, otherwise kill the build
if [[ $GITHUB_REF =~ "master" ]]; then
  currentRef=$(git rev-parse master)     # sha of the local branch
  headRef=$(git rev-parse origin/master) # sha of the remote branch
  if [[ $currentRef == $headRef ]]; then
    echo "up to date"
  else
    echo "current branch ahead/behind origin exiting"
    exit 0
  fi
fi

if [[ $GITHUB_REF =~ "2.x.x" ]]; then
  currentRef=$(git rev-parse 2.x.x)     # sha of the local branch
  headRef=$(git rev-parse origin/2.x.x) # sha of the remote branch
  if [[ $currentRef == $headRef ]]; then
    echo "up to date"
  else
    echo "current branch ahead/behind origin exiting"
    exit 0
  fi
fi

# Set npm registry (authentication will be handled via OIDC/provenance)
npm config set registry https://registry.npmjs.org/

# If triggered manually (workflow_dispatch), skip lerna version and publish whatever
# version is currently in packages/react/package.json directly.
if [[ $GITHUB_EVENT_NAME == "workflow_dispatch" ]]; then
  echo "Manual dispatch detected — skipping lerna version, publishing current package version..."
  if [[ $GITHUB_REF =~ "master" ]]; then
    (cd packages/react && npm publish --provenance --tag latest --access public --registry https://registry.npmjs.org/)
  elif [[ $GITHUB_REF =~ "2.x.x" ]]; then
    (cd packages/react && npm publish --tag legacy --access public --registry https://registry.npmjs.org/)
  fi
  exit 0
fi

if [[ $GITHUB_REF =~ "master" ]]; then
  # graduate the release with --graduate-prereleases
  # --force-publish ensures CI-only commits (workflow/script fixes) still bump
  lerna version --conventional-commits --graduate-prereleases --force-publish --create-release github --yes --message "chore: release %s [ci skip]"

  # Only publish if lerna created a new version (check if there's a new git tag)
  if git describe --exact-match --tags HEAD >/dev/null 2>&1; then
    echo "New version detected, publishing..."
    (cd packages/react && npm publish --provenance --tag latest --access public --registry https://registry.npmjs.org/)
  else
    echo "No new version created, skipping publish"
  fi
fi

if [[ $GITHUB_REF =~ "2.x.x" ]]; then
  # always bump patch on every merge to 2.x.x
  # --force-publish bypasses lerna's CI change detection so workflow/script
  # only commits still produce a version bump and publish
  lerna version patch --force-publish --yes --message "chore: release %s [ci skip]"

  # publish under the "legacy" dist-tag — "v2" is a valid SemVer range and
  # npm 11 rejects it; "latest" is owned by master and must not be overwritten
  (cd packages/react && npm publish --provenance --tag legacy --access public --registry https://registry.npmjs.org/)
fi

# just to be sure we exit cleanly
exit 0
