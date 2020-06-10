import React from 'react';
import PropTypes from 'prop-types';
import { Button as CarbonButton, Loading } from 'carbon-components-react';
import { ButtonKinds } from 'carbon-components-react/es/prop-types/types';
import classNames from 'classnames';

import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;
const propTypes = {
  /** Show loading spinner, only new prop */
  loading: PropTypes.bool,
  /** Disable the button will be auto disabled when loading */
  disabled: PropTypes.bool,
  /** Button label */
  children: PropTypes.node,
  /** click handler */
  onClick: PropTypes.func, // eslint-disable-line react/require-default-props
  className: PropTypes.string,
  /** primary, secondary, etc from carbon */
  kind: PropTypes.oneOf([...ButtonKinds, 'icon-selection']),
  /** display green border to denote a recommended button to select, to be used with kind: 'icon-selection' */
  recommended: PropTypes.bool,
  /** Specify if the button is an icon-only button */
  hasIconOnly: PropTypes.bool,
  /** Toggle selected styling for buttons of kind=icon-selection */
  selected: PropTypes.bool,
};

const defaultProps = {
  loading: false,
  disabled: false,
  className: null,
  kind: 'primary',
  children: null,
  recommended: false,
  hasIconOnly: false,
  selected: false,
};

const Button = props => {
  const {
    children,
    loading,
    disabled,
    className,
    onClick,
    kind,
    recommended,
    hasIconOnly,
    selected,
    ...other
  } = props;

  return (
    <CarbonButton
      {...other}
      kind={kind === 'icon-selection' ? 'ghost' : kind}
      hasIconOnly={kind === 'icon-selection' ? true : hasIconOnly}
      onClick={onClick}
      className={classNames(className, `${iotPrefix}--btn`, {
        [`${iotPrefix}--btn-icon-selection`]: kind === 'icon-selection',
        [`${iotPrefix}--btn-icon-selection--recommended`]:
          kind === 'icon-selection' && !disabled && recommended,
        [`${iotPrefix}--btn-icon-selection--selected`]: kind === 'icon-selection' && selected,
      })}
      disabled={disabled || (loading !== undefined && loading !== false)}
    >
      {loading ? <Loading small withOverlay={false} /> : null}
      {kind === 'icon-selection' && !disabled && recommended ? (
        <div className={`${iotPrefix}--btn-icon-selection--recommended_marker`} />
      ) : null}

      {children}
    </CarbonButton>
  );
};

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;
