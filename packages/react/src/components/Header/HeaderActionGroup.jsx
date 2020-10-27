import React from 'react';
import { HeaderGlobalBar } from 'carbon-components-react/es/components/UIShell';
import PropTypes from 'prop-types';

import HeaderAction from './HeaderAction/HeaderAction';
import { HeaderActionItemPropTypes } from './Header';

const propTypes = {
  actionItems: PropTypes.arrayOf(PropTypes.shape(HeaderActionItemPropTypes)).isRequired,
};

/**
 * Keeps track of the state of which header menu item is currently expanded
 *
 * Renders all the actions that can be clicked to navigate, open header panels (side panels),
 * or dropdown menus, passing an onToggleExpansion to each action
 */
const HeaderActionGroup = ({ actionItems }) => {
  return (
    <>
      <HeaderGlobalBar>
        {actionItems.map((item, i) => (
          <HeaderAction item={item} index={i} key={`header-action-item-${item.label}-${i}`} />
        ))}
      </HeaderGlobalBar>
    </>
  );
};

HeaderActionGroup.propTypes = propTypes;

export default HeaderActionGroup;
