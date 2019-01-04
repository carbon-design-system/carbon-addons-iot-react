/* eslint-disable no-console */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Example from '../Example';
import { Button } from 'carbon-components-react';

const ExampleProps = {
  onClick: action('click'),
  className: 'some-class',
};

storiesOf('Example', module).addWithInfo(
  'default',
  `
      Cards provide an at-a glance preview of the content they link to and frequently contain
      easily-consumable content. The example below shows an empty card. Create Card Content, Card Footer,
      Card Status and Card Actions components to add content to your card.
    `,
  () => (
    <Example {...ExampleProps}>
      <Button>Test Button</Button>
    </Example>
  )
);
