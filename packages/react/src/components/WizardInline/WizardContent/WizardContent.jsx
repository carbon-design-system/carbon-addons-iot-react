import React from 'react';
import PropTypes from 'prop-types';

const WizardContent = ({ component, testId }) => <div data-testid={testId}>{component}</div>;

WizardContent.propTypes = {
  component: PropTypes.element.isRequired,
  testId: PropTypes.string,
};

WizardContent.defaultProps = {
  testId: 'wizard-content',
};

export default WizardContent;
