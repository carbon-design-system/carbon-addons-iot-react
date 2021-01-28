#!/usr/bin/env bash

set -e # exit with nonzero exit code if anything fails

if [[ $GITHUB_ACTOR == "cal-smith" ]]; then
  # exit early, since we don't want to try publishing _again_
  exit 0;
fi

# set username and email so git knows who we are
git config user.name "cal-smith"
git config user.email "callums@ca.ibm.com"

# authenticate with the npm registry
npm config set //registry.npmjs.org/:_authToken=$NPM_TOKEN -q

if [[ $GITHUB_REF =~ "master" ]]; then
  # graduate the relase with --conventional-graduate
  lerna version --conventional-commits --conventional-graduate --create-release github --yes
  # publish the packages that were just versioned
  lerna publish from-git --dist-tag latest --yes
fi

if [[ $GITHUB_REF =~ "next" ]]; then
  # version a prerelease to the `next` dist-tag with the `next` preid
  lerna version --conventional-commits --conventional-prerelease --preid next --create-release github --yes
  # publish the packages that were just versioned
  lerna publish from-git --dist-tag next --yes
fi

# just to be sure we exit cleanly
exit 0;
