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

const StyledPageTitleH2 = styled.h2`
  align-items: center;
  display: flex;
  margin-bottom: 0.9em;
`;
const StyledPageBlurb = styled.p`
  margin-bottom: 1rem;
  color: ${COLORS.gray};
`;

const propTypes = {
  /** Section is an element that describes the category of this page */
  section: PropTypes.node,
  /** Title of the page  */
  title: PropTypes.node,
  /** Details about what the page shows */
  blurb: PropTypes.node,
};

const defaultProps = {
  section: null,
  title: null,
  blurb: null,
};

const PageTitle = ({ title, section, blurb }) => (
  <StyledPageTitle>
    {title ? (
      <StyledPageTitleH2>
        {section ? <StyledPageSection>{`${section} /`}</StyledPageSection> : null}
        {title}
      </StyledPageTitleH2>
    ) : null}
    {blurb ? <StyledPageBlurb>{blurb}</StyledPageBlurb> : null}
  </StyledPageTitle>
);

PageTitle.propTypes = propTypes;
PageTitle.defaultProps = defaultProps;
export default PageTitle;
