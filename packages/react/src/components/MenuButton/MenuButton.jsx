import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { unstable_ContextMenu as ContextMenu } from 'carbon-components-react';
import { ChevronDown16, ChevronUp16 } from '@carbon/icons-react';

import { SplitMenuButton } from './SplitMenuButton';
import { SingleMenuButton } from './SingleMenuButton';

const propTypes = {
  testID: PropTypes.string,

  /**
   * Use by a split menu button to fire the event for clicking on the main button,
   * not the chevron to open the additional menu actions
   */
  onPrimaryActionClick: PropTypes.func,

  /**
   * The label on the primary button in a split button, or the whole button on a single menu button
   */
  label: PropTypes.string,

  /**
   * Optional prop to change the open icon on the button
   * Can be a React component class
   */
  renderOpenIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),

  /**
   * Optional prop to change the closed state icon on the button
   * Can be a React component class
   */
  renderCloseIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),

  /**
   * If specifying the `renderIcon` prop, provide a description for that icon that can
   * be read by screen readers
   */
  closeIconDescription: (props) => {
    if (props.renderCloseIcon && !props.closeIconDescription) {
      return new Error(
        'renderCloseIcon property specified without also providing an closeIconDescription property.'
      );
    }
    return undefined;
  },

  /**
   * If specifying the `renderIcon` prop, provide a description for that icon that can
   * be read by screen readers
   */
  openIconDescription: (props) => {
    if (props.renderOpenIcon && !props.openIconDescription) {
      return new Error(
        'renderOpenIcon property specified without also providing an openIconDescription property.'
      );
    }
    return undefined;
  },

  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

const defaultProps = {
  testID: 'menu-button',
  onPrimaryActionClick: null,
  label: null,
  openIconDescription: 'open menu button',
  closeIconDescription: 'close menu button',
  renderOpenIcon: ChevronDown16,
  renderCloseIcon: ChevronUp16,
};

const MenuButton = ({
  testID,
  onPrimaryActionClick,
  label,
  openIconDescription,
  closeIconDescription,
  renderOpenIcon,
  renderCloseIcon,
  children,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef(null);
  useLayoutEffect(() => {
    /* istanbul ignore else */
    if (buttonRef.current) {
      const { x, y, height } = buttonRef.current.getBoundingClientRect();
      setPosition({
        x,
        y: y + height,
      });
    }
  }, []);

  const handlePrimaryClick = useCallback(
    (e) => {
      if (typeof onPrimaryActionClick === 'function') {
        onPrimaryActionClick(e);
      } else {
        setIsMenuOpen((prev) => !prev);
      }
    },
    [onPrimaryActionClick]
  );

  const handleSecondaryClick = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleChildClick = useCallback(
    (onClick) => (e) => {
      /* istanbul ignore else */
      if (typeof onClick === 'function') {
        setIsMenuOpen((prev) => !prev);
        onClick(e);
      }
    },
    []
  );

  /**
   * Wrap the children onClick handlers to also close the menu when an
   * action is triggered.
   */
  const contextMenuItems = useMemo(
    () =>
      React.Children.map(children, (child) => {
        return React.cloneElement(
          child,
          Object.assign({}, child.props, {
            onClick:
              typeof child.props?.onClick === 'function'
                ? handleChildClick(child.props.onClick)
                : undefined,
          })
        );
      }),
    [children, handleChildClick]
  );

  const ButtonComponent =
    typeof onPrimaryActionClick === 'function' && label ? SplitMenuButton : SingleMenuButton;
  return (
    <>
      <ButtonComponent
        ref={buttonRef}
        onPrimaryActionClick={handlePrimaryClick}
        onSecondaryActionClick={handleSecondaryClick}
        iconDescription={isMenuOpen ? closeIconDescription : openIconDescription}
        renderIcon={isMenuOpen ? renderCloseIcon : renderOpenIcon}
        label={label}
        testID={testID}
      />
      <ContextMenu open={isMenuOpen} {...position}>
        {contextMenuItems}
      </ContextMenu>
    </>
  );
};

MenuButton.propTypes = propTypes;
MenuButton.defaultProps = defaultProps;

export default MenuButton;
