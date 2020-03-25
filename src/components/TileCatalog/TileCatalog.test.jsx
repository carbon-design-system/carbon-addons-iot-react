import React from 'react';
import { shallow } from 'enzyme';

import TileCatalog from './TileCatalog';
import { commonTileCatalogProps } from './TileCatalog.story';

describe('TileCatalog tests', () => {
  test('error prop', () => {
    // If we have data, never show the error state
    const wrapper = shallow(<TileCatalog {...commonTileCatalogProps} error="In error state" />);
    expect(wrapper.find('.iot--tile-catalog--empty-tile')).toHaveLength(0);
    // If we have empty data then show the error state
    const wrapper2 = shallow(
      <TileCatalog {...commonTileCatalogProps} tiles={[]} error="In error state" />
    );
    expect(wrapper2.find('.iot--tile-catalog--empty-tile')).toHaveLength(1);
  });
});
