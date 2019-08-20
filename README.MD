# Carbon Addons for Watson IoT

> v1.x - Carbon v9 implementation

[![Build Status](https://travis-ci.org/IBM/carbon-addons-iot-react.svg?branch=1.x)](https://travis-ci.org/IBM/carbon-addons-iot-react/branches)
[![Coverage Status](https://coveralls.io/repos/github/IBM/carbon-addons-iot-react/badge.svg?branch=1.x)](https://coveralls.io/github/IBM/carbon-addons-iot-react?branch=1.x)
[![Netlify Status](https://api.netlify.com/api/v1/badges/d037c99a-d51a-4729-bf7c-589679e2663e/deploy-status)](https://app.netlify.com/sites/carbon-addons-iot-react/deploys)
[![Netlify Notice](https://www.netlify.com/img/global/badges/netlify-light.svg)](https://www.netlify.com)

This library contains React components shared between IBM IoT products to unify our look and feel. These widgets are usually based on the carbon-components-react components. These components cover additional usecases specific to our IoT product line, much like this repository does for the IBM Cloud team: <https://github.com/carbon-design-system/carbon-addons-cloud-react>

## Getting Started

Run the following command using [npm](https://www.npmjs.com/):

```bash
npm install -S carbon-components carbon-components-react carbon-icons carbon-addons-iot-react@release-1.x
```

If you prefer [Yarn](https://yarnpkg.com/en/), use the following command instead:

```bash
yarn add carbon-components carbon-components-react carbon-icons carbon-addons-iot-react@release-1.x
```

You can then import any component that you need by doing the following in your project:

```js
import { BaseModal } from 'carbon-addons-iot-react';
```

> Note: You can choose to install the package and follow all v1 releases by using the dist-tag like above, `release-1.x`. Alternatively, you can modify your existing `package.json` to specify an appropriate [caret range](https://yarnpkg.com/en/docs/dependency-versions#toc-caret-ranges), e.g., `^1.90.0`.

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
