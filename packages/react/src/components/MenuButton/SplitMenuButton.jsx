import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import { settings } from '../../constants/Settings';
import Button from '../Button';

const { iotPrefix } = settings;

const propTypes = {
  testId: PropTypes.string.isRequired,

  /**
   * The label on a single menu button
   */
  label: PropTypes.string.isRequired,

  /**
   * These are passed from the MenuButton to open to the menu.
   */
  onSecondaryActionClick: PropTypes.func.isRequired,

  /**
   * This is passed from the MenuButton to trigger the primary action
   * on this split button.
   */
  onPrimaryActionClick: PropTypes.func.isRequired,

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

  /**
   * The size of the button and the dropdown items
   */
  size: PropTypes.oneOf(['sm', 'md', 'default']).isRequired,

  /**
   * The kind of button to render
   */
  kind: PropTypes.oneOf(['primary', 'secondary', 'tertiary']).isRequired,
};

export const SplitMenuButton = React.forwardRef(
  (
    {
      label,
      iconDescription,
      renderIcon,
      onPrimaryActionClick,
      onSecondaryActionClick,
      size,
      testId,
      kind,
    },
    ref
  ) => {
    return (
      <>
        <Button
          className={classnames(`${iotPrefix}--menu-button__primary`)}
          onClick={onPrimaryActionClick}
          testId={`${testId}-primary`}
          size={size}
          kind={kind}
        >
          {label}
        </Button>
        <Button
          ref={ref}
          className={classnames(
            `${iotPrefix}--menu-button__secondary`,
            `${iotPrefix}--menu-button__trigger`
          )}
          hasIconOnly
          iconDescription={iconDescription}
          renderIcon={renderIcon}
          onClick={onSecondaryActionClick}
          testId={`${testId}-secondary`}
          size={size}
          kind={kind}
        />
      </>
    );
  }
);

SplitMenuButton.propTypes = propTypes;
