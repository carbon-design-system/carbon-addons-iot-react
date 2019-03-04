import React from 'react';
import PropTypes from 'prop-types';

const WizardContent = ({ component }) => <div>{component}</div>;

WizardContent.propTypes = {
  component: PropTypes.element.isRequired,
};

export default WizardContent;
