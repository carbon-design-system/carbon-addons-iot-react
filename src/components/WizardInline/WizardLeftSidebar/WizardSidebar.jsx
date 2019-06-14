import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const propTypes = {
  sidebar: PropTypes.element,
  width: PropTypes.number,
};

const defaultProps = {
  sidebar: null,
  width: 200,
};

const StyledSidebar = styled.div`
  min-width: ${props => `${props.width}px`};
  width: 25%;
  padding-left: 1rem;
`;

const WizardSidebar = ({ sidebar, width }) => (
  <StyledSidebar width={width}>{sidebar}</StyledSidebar>
);

WizardSidebar.propTypes = propTypes;
WizardSidebar.defaultProps = defaultProps;

export default WizardSidebar;
