# Development Technolgies and Libraries

### _last updated:_ 01/05/2022

The following is a brief breakdown into the technolgies used to develop, test, and ship components in the AI Application's Pattern Asset Library. This is not meant to be an exhaustive intro into these technologies but a good "crash course" overview with links to more information.

### Table of Contents

1. [JavaScript](#JavaScript)
2. [Node](#Node)
3. [NPM](#NPM)
4. [Yarn](#Yarn)
5. [Storybook](#Storybook)

---

## JavaScript

The main skill needed and primary language used for this project is [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript),

> an object-oriented programming language for performing computations and manipulating computational objects within a host environment.

Javscript is used to run our development server, run test, author markup, and manage the state and lifecyle of the component.

I won't go deeply into every aspect of JavaScript but there are a few features of the language that you will use often when building React components.

1. [Destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
   You will see destructring used throughout the codebase. Whether using them to destructure our props from the prop object passed to components

```js
function Component({ propOne, propTwo }) {
  ...
}
// vs
function Component(props) {
  const propOne = props.propOne;
  const propTwo = props.propTwo;
}
```

or defining the value and setterFunction from the return of a hook

```js
const [value, setValue] = useState();
// vs
const value = useState()[0];
const setValue = useState()[1];
```

or getting individual values from a deeply nested object in order to not have to reference the long chain

```js
const { value1, value2, value3 } = this.props.obj.deepNestedObj.evenDeeperObj;
// vs
const value1 = this.props.obj.deepNestedObj.evenDeeperObj.value1;
const value2 = this.props.obj.deepNestedObj.evenDeeperObj.value2;
const value3 = this.props.obj.deepNestedObj.evenDeeperObj.value3;
```

destructuring is a great addtion to the language that cleans up the code base.

Additional Resources:

- https://developer.mozilla.org/en-US/docs/Web/JavaScript
- https://262.ecma-international.org/12.0/
- https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/What_is_JavaScript
- https://javascript.info/
- https://eloquentjavascript.net/
- https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/basic-javascript/
- https://www.udemy.com/course/javascript-essentials/

---

## Node

Many modern day JavaScript applications are built using [NodeJS](https://nodejs.org/en/), which is an

> asynchronous event-driven JavaScript runtime, designed to build scalable network applications.

Node is versatile and comes with a huge ecosystem for sharing and publishing code as well as a package manager, [NPM](https://www.npmjs.com/), for handling project dependencies. Our [library](https://www.npmjs.com/package/carbon-addons-iot-react) is published to the NPM registry.

For PAL developement you will need to have node installed. While we support multiple node versions, development is done using the LTS (Long Term Support) [version](https://nodejs.org/en/about/releases/). You will be able to find the supported node versions in the `"engines"` section of the `package.json` file, located in the root of the project.

> It is highly recommended that you use [NVM](https://github.com/nvm-sh/nvm#install--update-script) (Node Versioning Manager) to download and manage your node versions.

## NPM

All NPM packages contain a `package.json` file which holds various metadata relevant to the project. Find out more about the various fields [here](https://docs.npmjs.com/cli/v8/configuring-npm/package-json) and see the PAL react package.json [here](https://github.com/carbon-design-system/carbon-addons-iot-react/blob/next/packages/react/package.json)

```json
{
  "name": "carbon-addons-iot-react",
  "engines": {
    "node": "12.x || 14.x || 16.x"
  },
  "browser": "es/index.js",
  "main": "lib/index.js",
  "unpkg": "umd/carbon-addons-iot-react.js",
  "repository": {
    "type": "git",
    "url": "https://github.com/carbon-design-system/carbon-addons-iot-react.git"
  },
  "dependencies": [],
  "peerDependencies": [],
  "devDependencies": [],
  ...
}
```

Some relevant sections of this file are:

- `"engines"`: specify the version of node that your project works on. If none specified than any will do.
- `"main/browser/unpkg"`: primary entry point to your program.
- `"dependencies"`: Project dependencies, specified in a simple object that maps a package name to a version range. More information on specifying ranges [here](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#dependencies)
- `"devDependencies"`: these are project dependencies needed for development but are not bundled with your package.
- `"peerDependencies"`: these are project dependencies that you do not wish to bundle but consuming applications will have to import in order to use your package.
- `"scripts"`: a dictionary containing script commands that are run at various times in the lifecycle of your package. The key is the lifecycle event, and the value is the command to run at that point.

## Yarn

The project uses legacy [Yarn](https://classic.yarnpkg.com/en/) (1.X) instead of the built in NPM to manage dependecies. So all command swill be run using the Yarn alternative

```js
npm install <package-name>

//becomes

yarn add <package-name>
```

You will also use yarn to instantiate the scripts in `package.json`.

```js
yarn start
```

The project has a `yarn.lock`. This is autogenerated and shows the entire dependency chain for both direct and sub dependencies. You should never manually change this file. Yarn lock allows us to have finer control of the dependecy resolution for the entire team.

When starting a new branch for development you will want to make sure you pull from next and run

```
yarn
```

to ensure your dependencies are up to date.

Additional resources:

- https://classic.yarnpkg.com/en/docs/cli/

## Storybook

Our development environment is a node app called Storybook which acts as a code sandbox and provides documentation for our users
