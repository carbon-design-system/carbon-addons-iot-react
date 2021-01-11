import React from 'react';
import { render, screen } from '@testing-library/react';

import { CARD_SIZES, CARD_TYPES } from '../../constants/LayoutConstants';

import DashboardEditorCardRenderer from './DashboardEditorCardRenderer';

describe('DashboardEditorCardRenderer', () => {
  it('default card just renders id', () => {
    render(
      <DashboardEditorCardRenderer type={CARD_TYPES.TIMESERIES} id="myid" />
    );
    expect(screen.getByText(/myid/)).toBeInTheDocument();
  });
  it('list card renders list', () => {
    const listCardData = [
      {
        id: 'row-1',
        value: 'Row content 1',
        link: 'https://internetofthings.ibmcloud.com/',
      },
    ];
    render(
      <DashboardEditorCardRenderer
        type={CARD_TYPES.LIST}
        id="listCard"
        isResizable
        key="listCard"
        title="ListCard render"
        size={CARD_SIZES.SMALL}
        data={listCardData}
        hasMoreData={false}
        loadData={() => {}}
      />
    );
    expect(screen.getByText(/Row content 1/)).toBeInTheDocument();
  });
  it('should render default', () => {
    render(
      <DashboardEditorCardRenderer
        type="unsupported card type"
        id="defaultCard"
        size={CARD_SIZES.SMALL}
      />
    );
    expect(screen.getByText(/defaultCard/)).toBeInTheDocument();
  });
});
