import React from 'react';
import PropTypes from 'prop-types';

import { settings } from '../../constants/Settings';
import Button from '../Button';

const { iotPrefix } = settings;

const propTypes = {
  /**
   * The label on a single menu button
   */
  label: PropTypes.string,

  /**
   * These are passed from the MenuButton to open to the menu.
   */
  onSecondaryActionClick: PropTypes.func,

  onPrimaryActionClick: PropTypes.func,

  /**
   * Optional prop to change the closed state icon on the button
   * Can be a React component class
   */
  renderIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,

  /**
   * If specifying the `renderIcon` prop, provide a description for that icon that can
   * be read by screen readers
   */
  iconDescription: PropTypes.string.isRequired,

  testId: PropTypes.string.isRequired,

  /**
   * The size of the button and the dropdown items
   */
  size: PropTypes.oneOf(['sm', 'md', 'default']).isRequired,
};

const defaultProps = {
  label: '',
  onSecondaryActionClick: null,
  onPrimaryActionClick: null,
};

export const SingleMenuButton = React.forwardRef(
  (
    {
      onSecondaryActionClick,
      onPrimaryActionClick,
      label,
      iconDescription,
      renderIcon,
      testId,
      size,
    },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        className={`${iotPrefix}--menu-button__trigger`}
        onClick={label ? onPrimaryActionClick : onSecondaryActionClick}
        iconDescription={iconDescription}
        renderIcon={renderIcon}
        hasIconOnly={!label}
        kind={!label ? 'ghost' : 'primary'}
        testId={label ? `${testId}-single` : `${testId}-icon`}
        size={size}
      >
        {label}
      </Button>
    );
  }
);

SingleMenuButton.propTypes = propTypes;
SingleMenuButton.defaultProps = defaultProps;
