import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { number } from '@storybook/addon-knobs';
import styled from 'styled-components';

import SimplePagination from './SimplePagination';

const StyledSimplePagination = styled.div`
  &&& {
    min-width: 500px;
  }
`;

storiesOf('Watson IoT|SimplePagination', module).add('default', () => (
  <StyledSimplePagination>
    <SimplePagination
      page={number('page', 1)}
      maxPage={number('maxPage', 4)}
      onPage={action('onPage')}
    />
  </StyledSimplePagination>
));
