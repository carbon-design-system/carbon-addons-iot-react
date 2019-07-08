import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import styled from 'styled-components';

import { COLORS } from '../../styles/styles';

const propTypes = {
  /** Title of the page  */
  title: PropTypes.node,
  /** Details about what the page shows */
  description: PropTypes.node,
  /** Optional What to render in the right side of the hero */
  rightContent: PropTypes.node,
  /** Breadcrumb to show */
  breadcrumb: PropTypes.node,
  /** secundary nav to show */
  secundaryNav: PropTypes.node,
  className: PropTypes.string,
};

const defaultProps = {
  title: null,
  description: null,
  className: null,
  rightContent: null,
  breadcrumb: null,
  secundaryNav: null,
};

const StyledHero = styled.div`
  background: ${COLORS.white};
  padding-top: 32px;
  padding-left: 32px;
  padding-right: 32px;
  padding-bottom: 24px;
  display: flex;
  flex: 1 1;
  flex-flow: row nowrap;
`;

const StyledTitleSection = styled.div`
  flex-basis: 75%;
`;

const StyledTitle = styled.div`
  align-items: center;
  display: flex;
  font-weight: 400;
  line-height: 1.25rem;
  margin-bottom: 24px;
  font-size: 1.75rem;
  color: #171717;
`;

const StyledHeroWrap = styled.div`
  align-items: flex-start;
  display: flex;
  margin: 0 auto;
  width: 100%;
  justify-content: space-between;
  transition: padding 0.2s;
`;

const StyledPageDescription = styled.p`
  margin-bottom: 24px;
  color: #171717;
  font-size: 0.875rem;
  line-height: 1.5rem;
  max-width: 50rem;
  flex: 1 1 20%;
`;

const StyledRightContent = styled.div`
  flex-basis: 25%;
`;

const StyledBreadcrumb = styled.div`
  margin-bottom: 24px;
`;

/**
 * Renders the hero text and styles for the page.  Can either render Breadcrumb, Title with description and secundary nav.
 */
const Hero = ({ title, description, className, rightContent, breadcrumb, secundaryNav }) => (
  <StyledHero className={className}>
    <Fragment>
      <StyledTitleSection>
        <StyledBreadcrumb>{breadcrumb || null}</StyledBreadcrumb>
        <StyledTitle>{title}</StyledTitle>
        <StyledHeroWrap>
          {' '}
          {description ? <StyledPageDescription>{description}</StyledPageDescription> : null}{' '}
        </StyledHeroWrap>
        {secundaryNav}
      </StyledTitleSection>
      {rightContent ? <StyledRightContent>{rightContent}</StyledRightContent> : null}
    </Fragment>
  </StyledHero>
);

Hero.propTypes = propTypes;
Hero.defaultProps = defaultProps;

export default Hero;
