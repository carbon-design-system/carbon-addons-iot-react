import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Breadcrumb, BreadcrumbItem } from 'carbon-components-react';

const propTypes = {
  /** Title of the page  */
  title: PropTypes.node,
  /** Details about what the page shows */
  description: PropTypes.node,
  /** Optional What to render in the right side of the hero */
  rightContent: PropTypes.node,
  /** Breadcrumbs to show */
  breadcrumb: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
      isCurrentPage: PropTypes.bool, // defaults to false
    })
  ),
  className: PropTypes.string,
};

const defaultProps = {
  title: null,
  description: null,
  className: null,
  rightContent: null,
  breadcrumb: [],
};

const StyledHero = styled.div`
  padding: 2rem 2rem 1.5rem 2rem;
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
  margin-top: 1.5rem;
  color: #171717;
  font-size: 0.875rem;
  line-height: 1.5rem;
  max-width: 50rem;
  flex: 1 1 20%;
`;

const StyledRightContent = styled.div`
  flex-basis: 25%;
`;

const StyledBreadcrumb = styled(Breadcrumb)`
  margin-bottom: 0.5rem;
`;

/**
 * Renders the hero text and styles for the page.  Can either render Breadcrumb, Title with description and secundary nav.
 */
const Hero = ({ title, description, className, rightContent, breadcrumb }) => (
  <StyledHero className={className}>
    <Fragment>
      <StyledTitleSection>
        <StyledBreadcrumb noTrailingSlash>
          {breadcrumb.map(({ href = undefined, isCurrentPage = false, label }) => (
            <BreadcrumbItem href={href} isCurrentPage={isCurrentPage}>
              <span>{label}</span>
            </BreadcrumbItem>
          ))}
        </StyledBreadcrumb>
        <StyledTitle>{title}</StyledTitle>
        <StyledHeroWrap>
          {description ? <StyledPageDescription>{description}</StyledPageDescription> : null}
        </StyledHeroWrap>
      </StyledTitleSection>
      {rightContent ? <StyledRightContent>{rightContent}</StyledRightContent> : null}
    </Fragment>
  </StyledHero>
);

Hero.propTypes = propTypes;
Hero.defaultProps = defaultProps;

export default Hero;
