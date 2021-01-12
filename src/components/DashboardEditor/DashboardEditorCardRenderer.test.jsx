import React from 'react';
import { render, screen } from '@testing-library/react';

import { CARD_SIZES, CARD_TYPES } from '../../constants/LayoutConstants';

import DashboardEditorCardRenderer from './DashboardEditorCardRenderer';

describe('DashboardEditorCardRenderer', () => {
  it('default card just renders id', () => {
    render(<DashboardEditorCardRenderer type="custom" id="myid" />);
    expect(screen.getByText(/myid/)).toBeInTheDocument();
  });
  it('timeseries card just renders id', () => {
    render(
      <DashboardEditorCardRenderer type={CARD_TYPES.TIMESERIES} id="myid" />
    );
    expect(screen.getByText(/myid/)).toBeInTheDocument();
  });
  it('value card renders threshold icon', () => {
    render(
      <DashboardEditorCardRenderer
        title="Alert Count"
        id="facilitycard"
        content={{
          attributes: [
            {
              dataSourceId: 'alertCount',
              thresholds: [
                {
                  comparison: '>=',
                  value: 30,
                  color: 'red',
                  icon: 'Warning alt',
                },
                {
                  comparison: '<=',
                  value: 5,
                  color: 'green',
                  icon: 'Warning alt',
                },
                {
                  comparison: '<',
                  value: 30,
                  color: 'orange',
                  icon: 'Warning alt',
                },
              ],
            },
          ],
        }}
        breakpoint="lg"
        size="LARGE"
        type="VALUE"
        values={{ alertCount: 35 }}
      />
    );
    expect(screen.getByTitle('>= 30')).toBeInTheDocument();
  });
  it('image card renders custom hotspot icon', () => {
    render(
      <DashboardEditorCardRenderer
        title="Alert Count"
        id="facilitycard"
        size="LARGE"
        type="IMAGE"
        content={{
          src: 'landscape',
          image: 'landscape',
          alt: 'Sample image',
          zoomMax: 10,
          hasInsertFromUrl: true,
        }}
        breakpoint="lg"
        values={{
          hotspots: [
            {
              x: 35,
              y: 65,
              icon: 'User',
              color: 'purple',
            },
          ],
        }}
      />
    );
    // Should find the correct User icon and text
    expect(screen.getByTitle('User')).toBeInTheDocument();
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
});
