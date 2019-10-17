# Contributing

## Prerequisites

Before contributing to `carbon-addons-iot-react`, you should make sure you have the following tools
installed:

- [Node.js](https://nodejs.org/en/download/) v10 or above here or follow their
  installation through a package manager
  [here](https://nodejs.org/en/download/package-manager/))
  - If you're on macOS, we recommend using
    [`nvm`](https://github.com/nvm-sh/nvm) to help manage different versions of
    Node.js [nvm](https://github.com/nvm-sh/nvm/blob/master/README.md) as your
    version manager for Node.
- Git
- [Yarn](https://yarnpkg.com/en/docs/install)

You'll also need a code editor to make changes. There are many to
choose from but some popular options are
[VSCode](https://code.visualstudio.com/), [Atom](https://atom.io), and
[Sublime](https://www.sublimetext.com/).

With that all in place, you're ready to start contributing!

### Developing on Windows 10

To get a Windows environment set up for contributing to this codebase, you'll need to set up the Windows Subsystem for Linux (WSL).

To set up WSL, follow [this guide published by the Carbon team](https://github.com/carbon-design-system/carbon/blob/master/docs/guides/setup/windows.md). The steps should be the same, except that you'll be cloning this repository instead of the Carbon repository.

```sh
git clone git@github.com:IBM/carbon-addons-iot-react.git
```

or with `https`:

```sh
git clone https://github.com/IBM/carbon-addons-iot-react.git
```

## Build and start the development server

From the root directory of the project, run:

```sh
# To install the project's dependencies
yarn install
```

To get your development server running and to start coding, run:

```sh
yarn start
```

This will start a development server where you can see any changes you are
making to components in our react components Storybook.

Once it's done building, you can edit source code or create new components. The
system is set up to automatically bundle your changes/additions. Visit
http://localhost:3000 to see the changes happen on the fly.

## Adding a new component or feature

You're ready to add a new component or feature to this library, THANK YOU! However, this is only a [_presentational_](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) component library. Please do not add components with any dependencies on internationalization libraries, redux, react-router, etc.

For a component request or feature enhancement to be considered ‘ready to implement’, a design spec and usage guidance should be provided in the issue. Associated code pull requests will not be merged without these artifacts.

## Dependencies

Dependencies must be added via `yarn add <packageName>`. Please do not use `npm install <packageName>`.

When adding new `dependencies` or `devDependencies` to the codebase, the associated pull request should include justification for the package and the alternatives considered.

Any change to `dependencies` (including version bumps) will impact consumers that are required to go through open source approvals within their organization. This approval process is not always a trivial task. `devDependencies` are less of a concern as they are not included in the exported package.

## Submitting pull requests and commits

Commits must follow the [conventional commit](https://www.conventionalcommits.org/en/v1.0.0-beta.2/#summary) format. You won't be able to create a commit unless you follow those rules. The [recent commits in the repository](https://github.com/IBM/carbon-addons-iot-react/commits/master) show examples of the format and how it's generally used.

Commits are preferred but not required to contain a link to an issue. If you choose to link commits to an issue, the 72 character limit can be avoided by placing the link in the body of the commit. Example:

```sh
git commit -m "fix(table): columns need unique ids" -m "#123"
```

Pull requests must contain a link to a relevant issue. If applicable, [automatically close issues from PRs via the keywords](https://help.github.com/en/articles/closing-issues-using-keywords).

## Styling new components

Components should have their own sass partial in which the corresponding styles are contained. If a component does not have one, please add it.

Do not use `styled-components`. Any components using it should be refactored to the sass partial approach. This helps promote consistency with the Carbon Design System.

## Testing changes

An automated unit test bucket runs when you execute `yarn test`.

Before every push, the test suite is ran automatically and takes snapshots of all of the current component stories. If you have made changes to a component, our tests will likely fail because the snapshots will no longer match. You will be prevented from pushing to git until you fix this error.

## Updating snapshots

After the unit test engine has detected a snapshot difference, all snapshots can be updated by running `yarn test:update`.

_Do not blindly update snapshots to pass the testcase._ Make sure the detected change is intentional and not unintentional before updating the snapshot.

## Minimum code coverage

Code coverage thresholds are enforced in the repository. If you add code but do not cover it with unit tests, the git push may fail because the coverage fell to a level under the required code coverage thresholds. Please add storybook stories or unit tests to cover your new code before checking in. _Do not reduce the code coverage threshold to get around this constraint._

To understand what lines of code are NOT covered by the current testcases, open the coverage/index.html file in a browser and investigate.

## Setting up VSCode to share settings and extensions

Some contributors to this repository are using some pretty cool VSCode extensions to make local development easier. If you'd like to reuse the same ones follow these instructions!

<http://shanalikhan.github.io/2015/12/15/Visual-Studio-Code-Sync-Settings.html>

Here's the Gist ID to download/share settings from:
5e3fb697c29f2aaa058145a3349a8229

After installing the VSCode Sync, restart VSCode, go to the Command Palette
and search for Sync. Select Sync : Advanced Options-> Sync : Download Settings from Public GIST

Then Sync : Download Settings. It will ask you for a Public GIST URL, here it is.

Here's the Public GIST URL:
<https://gist.github.com/scottdickerson/5e3fb697c29f2aaa058145a3349a8229>
