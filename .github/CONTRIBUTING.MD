# Setting up the project

if you don't already have yarn on your Mac then '**brew install yarn**' first

```bash
yarn install
```

## Exploring components

To explore our components and their documentation we use storybook. To start the storybook server, run: `yarn storybook` then open a browser to <http://localhost:3000>.

## Adding a new component

You're ready to add a new component to this library, THANK YOU! However, this is only a [PRESENTATIONAL](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) component library. Please do not add components with any dependencies on internationalization libraries, redux, or react-router.
Feel free to add any other types of lower-level dependencies you might need for your components (i.e. lodash, etc), but please use `yarn add` to add dependencies to the project not `npm install`.

## For all new components and features

For a component request or feature enhancement to be considered ‘ready to implement’, a design spec and usage guidance should be provided in the issue. Associated code pull requests will not be merged without these artifacts. 

## Submitting PRs and Commits

We require all commits to follow [conventional commit](https://www.conventionalcommits.org/en/v1.0.0-beta.2/) standards. You won't be able to create a commit unless you follow those rules.

## Styling new components

We've decided to use [styled-components](https://www.styled-components.com/) to apply css styles to our React components. Please don't add any new CSS-in-JS library as a dependency.

## Testing changes

We have an automated unit test bucket that runs when you execute `yarn test:watch`.
Before every push, we automatically run our test suite and take snapshots of all of our current component fixtures. If you have made visual changes to a component, our tests will
fail because the snapshots will no longer match. You will be prevented from pushing to git until you fix this error.

## Updating snapshots

To update the snapshot, type `u` after the snapshot difference has been detected by our unit test engine.
_Do not blindly update snapshots to pass the testcase._ Make sure the detected change is intentional and not unintentional before updating the snapshot.

## Minimum Code Coverage

We enforce code coverage thresholds in our project. If you add code but do not cover it with unit tests, the git push may fail because we have fallen under our code coverage thresholds. Please add storybook stories or unit tests to cover your new code before checking in. _Do not reduce the code coverage threshold to get around this constraint._
To understand what lines of code are NOT covered by our current testcases, open the coverage/index.html file in a browser and investigate.

## Setting up VSCode to share our Settings/Extensions

We're using some pretty cool VSCode extensions to make our internal development easier. If you'd like to reuse the same ones follow these instructions!

<http://shanalikhan.github.io/2015/12/15/Visual-Studio-Code-Sync-Settings.html>

Here's our Gist ID to download/share settings from:
5e3fb697c29f2aaa058145a3349a8229

After installing the VSCode Sync, restart VSCode, go to the Command Palette
and search for Sync. Select Sync : Advanced Options-> Sync : Download Settings from Public GIST

Then Sync : Download Settings. It will ask you for a Public GIST URL, here it is.

Here's the Public GIST URL:
<https://gist.github.com/scottdickerson/5e3fb697c29f2aaa058145a3349a8229>
