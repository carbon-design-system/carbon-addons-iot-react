import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Button } from 'carbon-components-react';

import Example from './Example';

const ExampleProps = {
  onClick: action('click'),
  className: 'some-class',
};

storiesOf('Example', module).add(
  'default',

  () => (
    <Example {...ExampleProps}>
      <Button>Test Button</Button>
    </Example>
  ),
  {
    info: `
  Cards provide an at-a glance preview of the content they link to and frequently contain
  easily-consumable content. The example below shows an empty card. Create Card Content, Card Footer,
  Card Status and Card Actions components to add content to your card.
`,
  }
);
