import React from 'react';
import { action } from '@storybook/addon-actions';
import { number, text } from '@storybook/addon-knobs';
import styled from 'styled-components';

import SimplePagination from './SimplePagination';

const StyledSimplePagination = styled.div`
  &&& {
    min-width: 500px;
  }
`;

export default {
  title: 'Watson IoT/SimplePagination',

  parameters: {
    component: SimplePagination,
  },
};

export const Default = () => (
  <StyledSimplePagination>
    <SimplePagination
      page={number('page', 1)}
      maxPage={number('maxPage', 4)}
      onPage={action('onPage')}
      totalItems={number('totalItems', 10)}
      totalItemsText={text('total tems display text (totalItemsText)', 'Assets')}
    />
  </StyledSimplePagination>
);

Default.story = {
  name: 'default',
};
