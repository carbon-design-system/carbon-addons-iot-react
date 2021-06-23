#!/usr/bin/env bash

set -e # exit with nonzero exit code if anything fails

cd packages/styles
yarn sync
yarn build
cd ../angular
yarn postinstall
