import React from 'react';
import PropTypes from 'prop-types';
import { settings } from 'carbon-components';
import cn from 'classnames';
import { HeaderGlobalAction, HeaderPanel } from 'carbon-components-react/lib/components/UIShell';

import { HeaderActionPropTypes } from './HeaderAction';

const { prefix: carbonPrefix } = settings;

const propTypes = {
  ...HeaderActionPropTypes,
  /** Ref object to be attached to the parent that should receive focus when a menu is closed */
  focusRef: PropTypes.object.isRequired,
};

const defaultProps = {
  // eslint-disable-next-line
  isExpanded: false,
};

/**
 * This component renders both a Header Action and it's child Header Panel
 * It has no local state.
 * It calls the onToggleExpansion when it should be opened or closed
 */
const HeaderPanelAction = ({ item, index, onToggleExpansion, isExpanded, focusRef }) => {
  return (
    <>
      <HeaderGlobalAction
        className={`${carbonPrefix}--header-action-btn action-btn__trigger`}
        key={`menu-item-${item.label}-global`}
        title={item.label}
        aria-label={item.label}
        aria-haspopup="menu"
        aria-expanded={isExpanded}
        onClick={onToggleExpansion}
        ref={focusRef}
      >
        {item.btnContent}
      </HeaderGlobalAction>
      <HeaderPanel
        data-testid="action-btn__panel"
        tabIndex="-1"
        key={`panel-${index}`}
        aria-label="Header Panel"
        className={cn('action-btn__headerpanel', {
          'action-btn__headerpanel--closed': !isExpanded,
        })}
        expanded={isExpanded}
      >
        <ul aria-label={item.label}>
          {item.childContent.map((childItem, k) => {
            const ChildElement = childItem?.metaData?.element || 'a';
            return (
              <li key={`listitem-${item.label}-${k}`} className="action-btn__headerpanel-li">
                <ChildElement
                  key={`headerpanelmenu-item-${item.label +
                    item.childContent.indexOf(childItem)}-child-${index}`}
                  {...childItem.metaData}
                >
                  {childItem.content}
                </ChildElement>
              </li>
            );
          })}
        </ul>
      </HeaderPanel>
    </>
  );
};

HeaderPanelAction.propTypes = propTypes;
HeaderPanelAction.defaultProps = defaultProps;

export default React.forwardRef((props, ref) => {
  return <HeaderPanelAction {...props} focusRef={ref} />;
});
