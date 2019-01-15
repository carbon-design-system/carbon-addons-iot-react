# IoT Widget Library

This library contains React components shared between all IBM IoT products to unify our look and feel. These widgets are usually based on the carbon-components-react widgets. These components cover additional usecases specific to our IoT product line, much like this repository does for the IBM Cloud team: <https://github.com/carbon-design-system/carbon-addons-cloud-react>

## Setting up the project

if you don't already have yarn on your Mac then '**brew install yarn**' first

```bash
yarn install
```

## Exploring components

To explore our components and their documentation we use storybook. To start the storybook server, run: `yarn storybook` then open a browser to http://localhost:3000.

## Testing changes

To run our test suite locally execute `yarn test:watch`.

## Adding a dependency

Please use `yarn add` to add dependencies to the project not `npm install`

## Updating snapshots

We have an automated unit test bucket that runs automatically when you push to git. We automatically run our test suite and compare snapshots of all of our current storybook stories.
If you have made visual changes to a component, our tests will fail because the snapshots will no longer match. _You will be prevented from pushing to git until you fix this error_.
To update the snapshot, type `u` after the snapshot difference has been detected by our unit test engine.
_Do not blindly update snapshots to pass the testcase._ Make sure the detected change is intentional and not unintentional before updating the snapshot.

## Minimum Code Coverage

We enforce code coverage thresholds in our project. If you add code but do not cover it with unit tests, the git push may fail because we have fallen under our code coverage thresholds. Please add storybook stories or unit tests to cover your new code before checking in. _Do not reduce the code coverage threshold to get around this constraint._
To understand what lines of code are NOT covered by our current testcases, open the coverage/index.html file in a browser and investigate.

## Setting up VSCode to share our Settings/Extensions

<http://shanalikhan.github.io/2015/12/15/Visual-Studio-Code-Sync-Settings.html>

Here's our Gist ID to download/share settings from:
5e3fb697c29f2aaa058145a3349a8229

After installing the VSCode Sync, restart VSCode, go to the Command Palette
and search for Sync. Select Sync : Advanced Options-> Sync : Download Settings from Public GIST

Then Sync : Download Settings. It will ask you for a Public GIST URL, here it is.

Here's the Public GIST URL:
<https://gist.github.com/scottdickerson/5e3fb697c29f2aaa058145a3349a8229>
