import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import Info from '@carbon/icons-react/lib/information/20';
import { Breadcrumb, BreadcrumbItem, Tooltip, SkeletonText } from 'carbon-components-react';

const propTypes = {
  /** Title of the page  */
  title: PropTypes.node,
  /** Details about what the page shows */
  description: PropTypes.node,
  /** Optional What to render in the right side of the hero */
  rightContent: PropTypes.node,
  /** Optional what to render in the right side of the breadcrumb */
  rightContentBreadcrumb: PropTypes.node,
  /** Breadcrumbs to show */
  breadcrumb: PropTypes.arrayOf(PropTypes.node),
  tooltip: PropTypes.shape({
    message: PropTypes.string.isRequired,
    href: PropTypes.string,
    linkLabel: PropTypes.string,
  }),
  /** Is the page actively loading */
  isLoading: PropTypes.bool,
  className: PropTypes.string,
};

const defaultProps = {
  title: null,
  description: null,
  className: null,
  rightContent: null,
  rightContentBreadcrumb: null,
  breadcrumb: null,
  tooltip: null,
  isLoading: false,
};

const StyledHero = styled.div`
  padding: 1rem 2rem 0.5rem 2rem;
`;

const StyledTitleSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: ${props => (!props.breadcrumb ? '16px' : '0px')};
`;

const StyledTitle = styled.div`
  align-items: center;
  display: flex;
  font-weight: 400;
  font-size: 1.75rem;
  line-height: 2.25rem;
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
  margin-bottom: 0;
`;

const StyledBreadcrumbDiv = styled.div`
  display: flex;
  justify-content: space-between;
`;

/**
 * Renders the hero text and styles for the page.  Can either render Breadcrumb, Title with description and secundary nav.
 */
const Hero = ({
  title,
  description,
  className,
  rightContent,
  breadcrumb,
  rightContentBreadcrumb,
  tooltip,
  isLoading,
}) => (
  <StyledHero className={className}>
    {isLoading ? (
      <SkeletonText width="30%" />
    ) : (
      <Fragment>
        {breadcrumb ? (
          <StyledBreadcrumbDiv>
            <StyledBreadcrumb>
              {breadcrumb.map((crumb, index) => (
                <BreadcrumbItem key={`breadcrumb-${index}`}>{crumb}</BreadcrumbItem>
              ))}
            </StyledBreadcrumb>
            <StyledRightContent>{rightContentBreadcrumb}</StyledRightContent>
          </StyledBreadcrumbDiv>
        ) : null}

        <StyledTitleSection breadcrumb={!!breadcrumb}>
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
    )}
  </StyledHero>
);
Hero.propTypes = propTypes;
Hero.defaultProps = defaultProps;

export default Hero;
