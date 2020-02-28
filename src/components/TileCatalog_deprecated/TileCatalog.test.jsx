import React from 'react';
import { shallow } from 'enzyme';

import TileCatalog_deprecated from './TileCatalog_deprecated';
import { commonTileCatalogProps } from './TileCatalog_deprecated.story';

describe('TileCatalog_deprecated tests', () => {
  test('error prop', () => {
    // If we have data, never show the error state
    const wrapper = shallow(
      <TileCatalog_deprecated {...commonTileCatalogProps} error="In error state" />
    );
    expect(wrapper.find('TileCatalog_deprecated__StyledEmptyTile')).toHaveLength(0);
    // If we have empty data then show the error state
    const wrapper2 = shallow(
      <TileCatalog_deprecated {...commonTileCatalogProps} tiles={[]} error="In error state" />
    );
    expect(wrapper2.find('TileCatalog_deprecated__StyledEmptyTile')).toHaveLength(1);
  });
});
