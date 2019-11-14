import React from 'react';
import PropTypes from 'prop-types';
import List from '@carbon/icons-react/lib/list/32';
import Grid from '@carbon/icons-react/lib/grid/32';

import { ContentSwitcher, Switch } from '../../index';

const propTypes = {
  /** Callback from when content switcher is changes */
  onChange: PropTypes.func,
  /** Index of the current item selected */
  selectedIndex: PropTypes.number,
  i18n: PropTypes.shape({
    listText: PropTypes.string,
    gridText: PropTypes.string,
  }),
};

const defaultProps = {
  onChange: () => {},
  selectedIndex: 0,
  i18n: {
    listText: 'List',
    gridText: 'Grid',
  },
};

const TileGalleryViewSwitcher = ({ onChange, selectedIndex, i18n }) => {
  return (
    <ContentSwitcher onChange={onChange} selectedIndex={selectedIndex}>
      <Switch name="list" text={i18n.listText} />
      <Switch name="grid" text={i18n.gridText} />
    </ContentSwitcher>
  );
};

TileGalleryViewSwitcher.propTypes = propTypes;
TileGalleryViewSwitcher.defaultProps = defaultProps;

export default TileGalleryViewSwitcher;
