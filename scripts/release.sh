#!/usr/bin/env bash

set -e # exit with nonzero exit code if anything fails

echo "hi"

if [[ $GITHUB_REF =~ "master" ]]; then
  # graduate the relase with --conventional-graduate
  lerna version --conventional-commits --conventional-graduate --create-release github --yes
  # publish the packages that were just versioned
  lerna publish from-package --dist-tag next --yes
fi

if [[ $GITHUB_REF =~ "next" ]]; then
  # publish a prerelease to the next dist-tag with the next preid
  lerna version --conventional-commits --conventional-prerelease --preid next --create-release github --yes
  # publish the packages that were just versioned
  lerna publish from-package --dist-tag latest --yes
fi

# just to be sure we exit cleanly
exit 0;
