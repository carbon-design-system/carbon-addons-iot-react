import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { settings } from 'carbon-components';
import classnames from 'classnames';
import { HeaderGlobalAction, HeaderPanel } from 'carbon-components-react/es/components/UIShell';
import { Close16 } from '@carbon/icons-react';
import { white } from '@carbon/colors';

import { APP_SWITCHER } from '../Header';
import { handleSpecificKeyDown } from '../../../utils/componentUtilityFunctions';

import { HeaderActionPropTypes } from './HeaderAction';

const { prefix: carbonPrefix } = settings;

const propTypes = {
  ...HeaderActionPropTypes,
  /** Ref object to be attached to the parent that should receive focus when a menu is closed */
  focusRef: PropTypes.oneOfType([
    // Either a function
    PropTypes.func,
    // Or the instance of a DOM native element (see the note about SSR)
    PropTypes.shape({
      current: typeof Element === 'undefined' ? PropTypes.any : PropTypes.instanceOf(Element),
    }),
  ]).isRequired,
};

const defaultProps = {
  // disabled b/c these are pulled in via the HeaderActionPropTypes above.
  /* eslint-disable react/default-props-match-prop-types */
  isExpanded: false,
  renderLabel: false,
  i18n: {
    closeMenu: 'close menu',
  },
  /* eslint-enable react/default-props-match-prop-types */
};

/**
 * This component renders both a Header Action and it's child Header Panel
 * It has no local state.
 * It calls the onToggleExpansion when it should be opened or closed
 */
const HeaderActionPanel = ({
  item,
  index,
  onToggleExpansion,
  isExpanded,
  focusRef,
  renderLabel,
  i18n,
}) => {
  const mergedI18n = useMemo(
    () => ({
      ...defaultProps.i18n,
      ...i18n,
    }),
    [i18n]
  );
  return (
    <>
      <HeaderGlobalAction
        className={`${carbonPrefix}--header-action-btn action-btn__trigger`}
        key={`menu-item-${item.label}-global`}
        title={item.label}
        aria-label={item.label}
        aria-haspopup="menu"
        aria-expanded={isExpanded}
        onClick={() => onToggleExpansion()}
        ref={focusRef}
      >
        {renderLabel ? (
          item.label
        ) : isExpanded ? (
          <Close16 fill={white} description={mergedI18n.closeMenu} />
        ) : (
          item.btnContent
        )}
      </HeaderGlobalAction>
      <HeaderPanel
        data-testid="action-btn__panel"
        tabIndex="-1"
        key={`panel-${index}`}
        aria-label="Header Panel"
        className={
          item.label !== APP_SWITCHER
            ? classnames('action-btn__headerpanel', {
                'action-btn__headerpanel--closed': !isExpanded,
              })
            : classnames(`${carbonPrefix}--app-switcher`, {
                [item.childContent[0].className]: item.childContent[0].className,
              })
        }
        expanded={isExpanded}
      >
        <ul aria-label={item.label}>
          {item.childContent.map((childItem, k) => {
            const ChildElement = childItem?.metaData?.element || 'a';
            const onKeyDownClick = (e) => e.target.click();

            // otherwise if the item is an A and doesn't have an onClick event
            // do nothing. An A tag doesn't need an onClick handler.
            const onClick =
              ChildElement === 'a' && !childItem?.metaData?.onClick
                ? undefined
                : // otherwise, if an onClick exists use that, or fallback to a noop.
                  childItem?.metaData?.onClick || (() => {});

            // if item has onKeyDown use that otherwise, fallback to onClick if it exists
            // or create a custom handler to trigger the click
            const onKeyDown = childItem?.metaData?.onKeyDown
              ? childItem.metaData.onKeyDown
              : onClick || onKeyDownClick;

            return (
              <li key={`listitem-${item.label}-${k}`} className="action-btn__headerpanel-li">
                <ChildElement
                  key={`headerpanelmenu-item-${item.label}-${index}-child-${k}`}
                  {...childItem.metaData}
                  onClick={onClick}
                  onKeyDown={handleSpecificKeyDown(['Enter', ' '], onKeyDown)}
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

HeaderActionPanel.propTypes = propTypes;
HeaderActionPanel.defaultProps = defaultProps;

export default React.forwardRef((props, ref) => {
  return <HeaderActionPanel {...props} focusRef={ref} />;
});
