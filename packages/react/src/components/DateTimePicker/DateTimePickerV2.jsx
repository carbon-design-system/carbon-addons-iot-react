import React from 'react';
import PropTypes from 'prop-types';

import DateTimePickerNew from './DateTimePickerV2WithTimeSpinner';
import DateTimePickerOld from './DateTimePickerV2WithoutTimeSpinner';

const propTypes = {
  useNewTimeSpinner: PropTypes.bool,
};
const defaultProps = {
  useNewTimeSpinner: false,
};

const DateTimePicker = ({ useNewTimeSpinner, ...others }) => {
  return useNewTimeSpinner ? <DateTimePickerNew {...others} /> : <DateTimePickerOld {...others} />;
};

DateTimePicker.propTypes = propTypes;
DateTimePicker.defaultProps = defaultProps;

export default DateTimePicker;
