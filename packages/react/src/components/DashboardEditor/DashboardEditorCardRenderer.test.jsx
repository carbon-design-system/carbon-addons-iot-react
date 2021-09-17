import React from 'react';
import { render, screen } from '@testing-library/react';

import { CARD_SIZES, CARD_TYPES } from '../../constants/LayoutConstants';

import DashboardEditorCardRenderer from './DashboardEditorCardRenderer';

const commonProps = { style: { x: '10', y: '20' } };

describe('DashboardEditorCardRenderer', () => {
  it('default card just renders id', () => {
    render(<DashboardEditorCardRenderer {...commonProps} type="custom" id="myid" />);
    expect(screen.getByText(/myid/)).toBeInTheDocument();
  });
  it('timeseries card just renders id', () => {
    render(<DashboardEditorCardRenderer {...commonProps} type={CARD_TYPES.TIMESERIES} id="myid" />);
    expect(screen.getByText(/myid/)).toBeInTheDocument();
  });
  it('value card renders threshold icon', () => {
    const mockRenderIconByName = jest.fn(() => <div />);
    render(
      <DashboardEditorCardRenderer
        title="Alert Count"
        id="facilitycard"
        {...commonProps}
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
        {...commonProps}
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
  it('renderCardPreview should be respected', () => {
    render(
      <DashboardEditorCardRenderer
        title="Alert Count"
        id="facilitycard"
        size="LARGE"
        type="IMAGE"
        {...commonProps}
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
              content: {},
            },
          ],
        }}
        renderCardPreview={() => <div>Hi there</div>}
      />
    );
    // Should find the correct card preview
    expect(screen.getByText('Hi there')).toBeInTheDocument();
  });
  it('image card renders custom default icon', () => {
    render(
      <DashboardEditorCardRenderer
        title="Alert Count"
        id="facilitycard"
        {...commonProps}
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
              content: {},
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
        {...commonProps}
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
              content: {},
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
        {...commonProps}
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
        {...commonProps}
        size={CARD_SIZES.SMALL}
      />
    );
    expect(screen.getByText(/defaultCard/)).toBeInTheDocument();
  });

  it('should call onFetchDynamicDemoHotspots when the function is available and dynamic hotspots are passed', () => {
    const onCardChange = jest.fn();

    const onFetchDynamicDemoHotspots = jest
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => resolve([{ x: 75, y: 10, type: 'text' }]))
      );

    render(
      <DashboardEditorCardRenderer
        {...commonProps}
        size={CARD_SIZES.MEDIUM}
        type="IMAGE"
        onCardChange={onCardChange}
        content={{
          src: 'landscape',
          image: 'landscape',
          alt: 'Sample image',
          zoomMax: 10,
          hasInsertFromUrl: true,
        }}
        onFetchDynamicDemoHotspots={onFetchDynamicDemoHotspots}
        values={{
          hotspots: [
            {
              color: 'purple',
              icon: 'Checkmark',
              type: 'dynamic',
            },
          ],
        }}
      />
    );

    expect(onFetchDynamicDemoHotspots).toHaveBeenCalled();
  });
});
