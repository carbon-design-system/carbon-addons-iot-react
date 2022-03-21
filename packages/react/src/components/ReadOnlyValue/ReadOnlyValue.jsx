import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

const propTypes = {
  type: PropTypes.oneOf(['stacked', 'inline', 'inline_small']),
  label: PropTypes.string,
  value: PropTypes.string,
  testId: PropTypes.string,
};

const defaultProps = {
  type: 'stacked',
  label: '',
  value: '',
  testId: 'read-only-value',
};
const ReadOnlyValue = ({ type, label, value, className, testId }) => {
  return (
    <div
      data-testid={testId}
      className={classnames(className, `${iotPrefix}--read-only-value`, {
        [`${iotPrefix}--read-only-value__inline`]: type === 'inline' || type === 'inline_small',
        [`${iotPrefix}--read-only-value__inline_small`]: type === 'inline_small',
      })}
    >
      <label data-testid={`${testId}--label`} htmlFor={`readonly-${label}`}>
        {label}
        <textarea
          data-testid={`${testId}--value`}
          type="text"
          id={`readonly-${label}`}
          name={value}
          value={value}
          readOnly
        />
      </label>
    </div>
  );
};

ReadOnlyValue.propTypes = propTypes;
ReadOnlyValue.defaultProps = defaultProps;
export default ReadOnlyValue;
