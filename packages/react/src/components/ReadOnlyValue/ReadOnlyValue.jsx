import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

const propTypes = {
  type: PropTypes.oneOf(['stacked', 'inline']),
  label: PropTypes.string,
  value: PropTypes.string,
  testId: PropTypes.string,
};

const defaultProps = {
  type: 'stacked',
  label: '',
  value: '',
  testId: 'testId',
};
const ReadOnlyValue = ({ type, label, value, className, testId }) => {
  return (
    <div
      data-testid={testId}
      className={classnames(className, `${iotPrefix}--read-only-value`, {
        [`${iotPrefix}--read-only-value__stacked`]: type === 'stacked',
      })}
    >
      <p data-testid={`${testId}--label`}>{label}</p>
      <span data-testid={`${testId}--value`}>{value}</span>
    </div>
  );
};

ReadOnlyValue.propTypes = propTypes;
ReadOnlyValue.defaultProps = defaultProps;
export default ReadOnlyValue;
