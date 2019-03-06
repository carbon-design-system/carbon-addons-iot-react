import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const propTypes = {
  sidebar: PropTypes.element,
};

const defaultProps = {
  sidebar: null,
};

const StyledSidebar = styled.div`
  min-width: 200px;
`;

const WizardSidebar = ({ sidebar }) => <StyledSidebar>{sidebar}</StyledSidebar>;

WizardSidebar.propTypes = propTypes;
WizardSidebar.defaultProps = defaultProps;

export default WizardSidebar;
