import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import Info from '@carbon/icons-react/lib/information/20';
import warning from 'warning';
import { Breadcrumb, BreadcrumbItem, Tooltip, SkeletonText } from 'carbon-components-react';

export const HeroPropTypes = {
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
  /** support closing the page, this causes a close button to show */
  onClose: PropTypes.func,
  i18n: PropTypes.shape({ closeLabel: PropTypes.string }),
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
  onClose: null,
  i18n: { closeLabel: 'Close' },
  isLoading: false,
};

const StyledHero = styled.div`
  padding: 1.5rem 2rem 0.5rem 2rem;
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
  padding-bottom: 0.5rem;
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
  i18n: { closeLabel },
  onClose,
}) => {
  if (__DEV__) {
    warning(
      false,
      'Hero component has been deprecated and will be removed in the next release of `carbon-addons-iot-react`. \n Refactor to use PageTitleBar component instead.'
    );
  }
  return (
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
                  tooltipId="hero-tooltip"
                  triggerId="hero-tooltip-trigger"
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
            {onClose ? (
              <button
                className="bx--modal-close"
                type="button"
                data-modal-close
                aria-label={closeLabel}
                onClick={onClose}
              >
                <svg
                  className="bx--modal-close__icon"
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>{closeLabel}</title>
                  <path
                    d="M6.32 5L10 8.68 8.68 10 5 6.32 1.32 10 0 8.68 3.68 5 0 1.32 1.32 0 5 3.68 8.68 0 10 1.32 6.32 5z"
                    fillRule="nonzero"
                  />
                </svg>
              </button>
            ) : null}
          </StyledTitleSection>
          {description ? <StyledPageDescription>{description}</StyledPageDescription> : null}
        </Fragment>
      )}
    </StyledHero>
  );
};
Hero.propTypes = HeroPropTypes;
Hero.defaultProps = defaultProps;

export default Hero;
