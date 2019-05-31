# IoT Widget Library

[![Build Status](https://travis-ci.com/IBM/carbon-addons-iot-react.svg?branch=master)](https://travis-ci.com/IBM/carbon-addons-iot-react)
[![Coverage Status](https://coveralls.io/repos/github/IBM/carbon-addons-iot-react/badge.svg?branch=master)](https://coveralls.io/github/IBM/carbon-addons-iot-react?branch=master)

This library contains React components shared between all IBM IoT products to unify our look and feel. These widgets are usually based on the carbon-components-react widgets. These components cover additional usecases specific to our IoT product line, much like this repository does for the IBM Cloud team: <https://github.com/carbon-design-system/carbon-addons-cloud-react>

## Getting Started

Run the following command using [npm](https://www.npmjs.com/):

```bash
npm install -S carbon-components carbon-components-react carbon-icons carbon-addons-iot-react
```

If you prefer [Yarn](https://yarnpkg.com/en/), use the following command instead:

```bash
yarn add carbon-components carbon-components-react carbon-icons carbon-addons-iot-react
```

You can then import any component that you need by doing the following in your project:

```js
import { BaseModal } from 'carbon-addons-iot-react';
```

## Running Tests

If you are using our project with Jest tests, due to it's dependency on d3, you may have to add some mock to your
Jest setup script. See this issue for more details: https://github.com/facebook/jest/issues/5379

Here's an example setup script, update your jest config to point to a setup script:
setupFiles: ['setupJest.js'],

```js
setupJest.js contents:

class SVGPathElement extends HTMLElement {}

window.SVGPathElement = SVGPathElement;
```

## 📚 Docs

You can find more information about how to use each component by checking out our [Storybook](https://IBM.github.io/carbon-addons-iot-react/).

## Testing

You can find our component test statement [here](./src/components/COMPONENT_TEST)

## 🤲 Contributing

Please check out our [Contribution Guidelines](./.github/CONTRIBUTING.MD) for more info on how you can help out!
