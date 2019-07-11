import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import Info from '@carbon/icons-react/lib/information/20';
import { Breadcrumb, BreadcrumbItem, Tooltip } from 'carbon-components-react';

import { COLORS } from '../../styles/styles';

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
  tooltip: PropTypes.shape({
    message: PropTypes.string.isRequired,
    href: PropTypes.string,
    linkLabel: PropTypes.string,
  }),
  className: PropTypes.string,
};

const defaultProps = {
  title: null,
  description: null,
  className: null,
  rightContent: null,
  breadcrumb: [],
  tooltip: null,
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

const StyledBreadcrumb = styled(Breadcrumb)`
  margin-bottom: 24px;
`;

/**
 * Renders the hero text and styles for the page.  Can either render Breadcrumb, Title with description and secundary nav.
 */
const Hero = ({ title, description, className, rightContent, breadcrumb, tooltip }) => (
  <StyledHero className={className}>
    <Fragment>
      <StyledTitleSection>
        <StyledBreadcrumb noTrailingSlash>
          {breadcrumb.map(({ href = undefined, isCurrentPage = false, label }) => (
            <BreadcrumbItem href={href} isCurrentPage={isCurrentPage}>
              <a href={href}>{label}</a>
            </BreadcrumbItem>
          ))}
        </StyledBreadcrumb>
        <StyledTitle>
          {title}
          {tooltip ? (
            <Tooltip
              clickToOpen
              tabIndex={0}
              triggerText=""
              triggerId="tooltip"
              renderIcon={React.forwardRef((props, ref) => (
                <Info ref={ref} />
              ))}
            >
              <p>{tooltip.message}</p>
              {tooltip.href && tooltip.linkLabel ? (
                <div className="bx--tooltip__footer">
                  <a href={tooltip.href} className="bx--link">
                    {tooltip.linkLabel}
                  </a>
                </div>
              ) : null}
            </Tooltip>
          ) : null}
        </StyledTitle>
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
