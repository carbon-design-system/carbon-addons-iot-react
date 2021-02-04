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
    render(<DashboardEditorCardRenderer type={CARD_TYPES.TIMESERIES} id="myid" />);
    expect(screen.getByText(/myid/)).toBeInTheDocument();
  });
  it('value card renders threshold icon', () => {
    const mockRenderIconByName = jest.fn(() => <div />);
    render(
      <DashboardEditorCardRenderer
        title="Alert Count"
        id="facilitycard"
        renderIconByName={mockRenderIconByName}
        content={{
          attributes: [
            {
              dataSourceId: 'alertCount',
              thresholds: [
                {
                  comparison: '>=',
                  value: 30,
                  color: 'red',
                  icon: 'Warning filled',
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
    expect(mockRenderIconByName).toHaveBeenCalledWith(
      'Warning filled',
      expect.objectContaining({ title: '>= 30', fill: 'red' })
    );
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
              content: {
                attributes: [{ dataItemId: 'mydataitem', dataSourceId: 'myDataSource' }],
              },
            },
          ],
        }}
      />
    );
    // Should find the correct User icon and text
    expect(screen.getByTitle('User')).toBeInTheDocument();
  });
  it('image card renders custom default icon', () => {
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
              color: 'purple',
              icon: 'Checkmark',
            },
          ],
        }}
      />
    );
    // Should find the correct Warning icon and text
    expect(screen.getByTitle('Checkmark')).toBeInTheDocument();
  });
  it('image card uses renderIconByName', () => {
    const mockRenderIconByName = jest.fn(() => <div />);
    render(
      <DashboardEditorCardRenderer
        title="Alert Count"
        id="facilitycard"
        size="LARGE"
        type="IMAGE"
        renderIconByName={mockRenderIconByName}
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
              color: 'purple',
              icon: 'Checkmark',
            },
          ],
        }}
      />
    );
    // Should find the correct Warning icon and text
    expect(mockRenderIconByName).toHaveBeenCalledWith('Checkmark', expect.anything());
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
