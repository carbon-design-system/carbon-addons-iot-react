import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { COLORS } from '../../styles/styles';

const StyledPageTitle = styled.div`
  max-width: 50rem;
  flex: 1 1 20%;
`;

const StyledPageSection = styled.span`
  color: ${COLORS.blue};
  padding-right: 0.5rem;
`;

const StyledPageTitleH1 = styled.h1`
  align-items: center;
  display: flex;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 400;
  line-height: 1.25rem;
`;

const propTypes = {
  /** Section is an element that describes the category of this page */
  section: PropTypes.node,
  /** Title of the page  */
  title: PropTypes.node,
};

const defaultProps = {
  section: null,
  title: null,
};

const PageTitle = ({ title, section }) => (
  <StyledPageTitle>
    {title ? (
      <StyledPageTitleH1>
        {section ? <StyledPageSection>{`${section} /`}</StyledPageSection> : null}
        {title}
      </StyledPageTitleH1>
    ) : null}
  </StyledPageTitle>
);

PageTitle.propTypes = propTypes;
PageTitle.defaultProps = defaultProps;
export default PageTitle;
