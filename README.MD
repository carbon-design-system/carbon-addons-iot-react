<p align="center">
  <a href="https://pages.github.ibm.com/Watson-IoT/IoT-Design-Site/">
    <img alt="Carbon add-ons for Watson IoT" src="https://user-images.githubusercontent.com/3360588/59875762-3add3180-9367-11e9-8a65-a6cf7efa5061.png" width="100%" />
  </a>
</p>
<h1 align="center">
  Carbon add-ons for Watson IoT
</h1>

> Carbon add-ons for Watson IoT is an open-source react component library built by IBM Watson Internet Of Things. With the Carbon Design System and IBM Design Language as its foundation, the library consists of working code, resources, and a vibrant community of contributors.

<p align="center">
  <a href="https://carbon-addons-iot-react.com">
    <img src="https://cdn.jsdelivr.net/gh/storybookjs/brand@master/badge/badge-storybook.svg" alt="Our Storybook" />
  </a>
  <a href="https://app.netlify.com/sites/carbon-addons-iot-react/deploys">
    <img src="https://api.netlify.com/api/v1/badges/d037c99a-d51a-4729-bf7c-589679e2663e/deploy-status" alt="Netlify status" />
  </a>
  <a href="https://travis-ci.org/IBM/carbon-addons-iot-react">
    <img src="https://travis-ci.org/IBM/carbon-addons-iot-react.svg?branch=beta" alt="Build Status" />
  </a>
  <a href="https://www.npmjs.com/package/carbon-addons-iot-react">
    <img src="https://img.shields.io/npm/v/carbon-addons-iot-react/beta.svg" alt="@beta release" />
  </a>
  <a href="https://coveralls.io/github/IBM/carbon-addons-iot-react?branch=beta">
    <img src="https://coveralls.io/repos/github/IBM/carbon-addons-iot-react/badge.svg?branch=beta" alt="Coverage Report" />
  </a>
  <a href="https://github.com/IBM/carbon-addons-iot-react/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-Apache--2.0-blue.svg" alt="Carbon add-ons for Watson IoT is released under the Apache-2.0 license" />
  </a>
  <a href="https://github.com/IBM/carbon-addons-iot-react/blob/master/.github/CONTRIBUTING.MD">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome" />
  </a>
</p>

## Getting Started

Add the `@beta` suffix to the package name to install the latest release from the `beta` branch:

Run the following command using [npm](https://www.npmjs.com/):

```bash
npm install -S carbon-addons-iot-react@beta
```

If you prefer [Yarn](https://yarnpkg.com/en/), use the following command instead:

```bash
yarn add carbon-addons-iot-react@beta
```

You can then import any component that you need by doing the following in your project:

```js
import { BaseModal } from 'carbon-addons-iot-react';
```

## Styling

What's included

```
carbon-addons-iot-react/
├── css
│   ├── carbon-addons-iot-react.css
│   └── carbon-components.css.map
├── scss
│   └── components
│       └── modal
│           └── _modal.scss
│       └── ...
│   └── globals
│       └── scss
│           └── _vars.scss
│           └── ...
```

Compiled CSS files are provided for ease of use getting started.

Using individual sass files (instead of the compiled .css) infers usage of a SCSS pre-processor. All Sass files use the `*.scss` file extension. For transpiling Sass code, use node-sass based Sass compilers, for example, WebPack sass-loader or gulp-sass. Make sure your build process uses autoprefixer to ensure vendor prefixes are automatically added to your output CSS.

At this time we only provide the individual partial files for `global` and `components`. This will require you to construct the central entrypoint in your application, such as the ./src/styles.scss file in this repo used to generate the provided .css files.

Feedback and improvement requests regarding this configuration would be appreciated, [please contribute to this issue](https://github.com/IBM/carbon-addons-iot-react/issues/426).

## Dependencies

Usage of this package does not require you to instal additional Carbon packages; `carbon-components`, `carbon-icons`, or `@carbon` packages (`@carbon/grid`, `@carbon-layout`, etc) as peer dependencies. You may still need these packages if you use them directly in your project.

## 📚 Docs

You can find more information about how to use each component by checking out our [Storybook](https://IBM.github.io/carbon-addons-iot-react/).

## 🤲 Contributing

Please check out our [Contribution Guidelines](./.github/CONTRIBUTING.MD) for more info on how you can help out!

## Testing

You can find our component test statement [here](./src/components/COMPONENT_TEST)

If you are using our project with Jest tests, due to it's dependency on d3, you may have to add some mock to your Jest setup script. See this issue for more details: https://github.com/facebook/jest/issues/5379

Here's an example setup script, update your jest config to point to a setup script:
setupFiles: ['setupJest.js'],

```js
setupJest.js contents:

class SVGPathElement extends HTMLElement {}

window.SVGPathElement = SVGPathElement;
```

<a href="https://www.netlify.com">
    <img src="https://www.netlify.com/img/global/badges/netlify-light.svg" alt="Deploys by Netlify" />
</a>
