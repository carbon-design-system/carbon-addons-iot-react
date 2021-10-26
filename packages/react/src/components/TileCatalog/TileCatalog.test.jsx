import React from 'react';
import { shallow } from 'enzyme';
import { render } from '@testing-library/react';

import { settings } from '../../constants/Settings';

import TileCatalog from './TileCatalog';
import { commonTileCatalogProps } from './TileCatalog.story';
import CatalogContent from './CatalogContent';

const { iotPrefix } = settings;

describe('TileCatalog', () => {
  it('error prop', () => {
    // If we have data, never show the error state
    const wrapper = shallow(<TileCatalog {...commonTileCatalogProps} error="In error state" />);
    expect(wrapper.find(`.${iotPrefix}--tile-catalog--empty-tile`)).toHaveLength(0);
    // If we have empty data then show the error state
    const wrapper2 = shallow(
      <TileCatalog {...commonTileCatalogProps} tiles={[]} error="In error state" />
    );
    expect(wrapper2.find(`.${iotPrefix}--tile-catalog--empty-tile`)).toHaveLength(1);
  });

  it("doesn't show an icon if none given", () => {
    // If we have data, never show the error state
    const { container } = render(
      <TileCatalog
        {...commonTileCatalogProps}
        tiles={[
          {
            id: 'test1',
            values: {
              title: 'Test Tile with really long title that should wrap',
              description: 'a description',
            },
            renderContent: ({ values }) => <CatalogContent {...values} icon={false} />,
          },
        ]}
        error="In error state"
      />
    );

    expect(container.querySelector(`${iotPrefix}--sample-tile-icon`)).toBeNull();
  });
});
