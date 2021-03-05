import './polyfills.js';

import { addDecorator, addParameters } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';
import { CarbonG100 } from './theme';

// load global styles
require('!style-loader!css-loader!postcss-loader!sass-loader!./preview.scss');

addParameters({
	options: {
		theme: CarbonG100,
		showRoots: true,
		storySort: (a, b) =>
			a[1].kind === b[1].kind
				? 0
				: a[1].id.localeCompare(b[1].id, undefined, { numeric: true }),
	},
});

addDecorator(withKnobs);
