import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { spacing05, spacing07 } from '@carbon/layout';

const StyledDiv = styled.div`
  width: 100%;
  padding: ${spacing05} ${spacing07};
`;

const propTypes = {
  isOpen: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

const defaultProps = {
  isOpen: false,
};

/** work area with transitions */
const PageWorkArea = ({ isOpen, children }) => (isOpen ? <StyledDiv>{children}</StyledDiv> : null);

PageWorkArea.propTypes = propTypes;
PageWorkArea.defaultProps = defaultProps;
export default PageWorkArea;
