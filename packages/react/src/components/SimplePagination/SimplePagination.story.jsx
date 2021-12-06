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
  title: '1 - Watson IoT/SimplePagination',

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
      i18n={{
        totalItemsText: text('total items display text (i18n.totalItemsText)', 'Assets'),
      }}
    />
  </StyledSimplePagination>
);

Default.storyName = 'default';
