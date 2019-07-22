import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import Info from '@carbon/icons-react/lib/information/20';
import { Breadcrumb, BreadcrumbItem, Tooltip } from 'carbon-components-react';

const propTypes = {
  /** Title of the page  */
  title: PropTypes.node,
  /** Details about what the page shows */
  description: PropTypes.node,
  /** Optional What to render in the right side of the hero */
  rightContent: PropTypes.node,
  /** Breadcrumbs to show */
  breadcrumb: PropTypes.arrayOf(PropTypes.node),
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
  padding: 2rem 2rem 1.5rem 2rem;
`;

const StyledTitleSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledTitle = styled.div`
  align-items: center;
  display: flex;
  font-weight: 400;
  font-size: 1.75rem;
  color: #171717;
`;

const StyledPageDescription = styled.p`
  margin-top: 1.5rem;
  color: #171717;
  font-size: 0.875rem;
  line-height: 1.375rem;
  max-width: 40rem;
`;

const StyledRightContent = styled.div``;

const StyledBreadcrumb = styled(Breadcrumb)`
  margin-bottom: 0.75rem;
`;

/**
 * Renders the hero text and styles for the page.  Can either render Breadcrumb, Title with description and secundary nav.
 */
const Hero = ({ title, description, className, rightContent, breadcrumb, tooltip }) => (
  <StyledHero className={className}>
    <Fragment>
      <StyledBreadcrumb>
        {breadcrumb.map((crumb, index) => (
          <BreadcrumbItem key={`breadcrumb-${index}`}>{crumb}</BreadcrumbItem>
        ))}
      </StyledBreadcrumb>
      <StyledTitleSection>
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
        {rightContent ? <StyledRightContent>{rightContent}</StyledRightContent> : null}
      </StyledTitleSection>
      {description ? <StyledPageDescription>{description}</StyledPageDescription> : null}
    </Fragment>
  </StyledHero>
);

Hero.propTypes = propTypes;
Hero.defaultProps = defaultProps;

export default Hero;
