import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Information } from '@carbon/react/icons';
import { spacing06, spacing03, spacing07 } from '@carbon/layout';
import { gray100 } from '@carbon/colors';
import warning from 'warning';
import { Breadcrumb, BreadcrumbItem, Tooltip, SkeletonText } from '@carbon/react';

import { settings } from '../../constants/Settings';

const { prefix } = settings;
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
  testId: PropTypes.string,
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
  testId: 'hero',
};

const StyledHero = styled.div`
  padding: ${spacing06} ${spacing07} ${spacing03} ${spacing07};
`;

const StyledTitleSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: ${(props) => (!props.breadcrumb ? '16px' : '0px')};
`;

const StyledTitle = styled.div`
  align-items: center;
  display: flex;
  font-weight: 400;
  font-size: 1.75rem;
  line-height: 2.25rem;
  color: ${gray100};
`;

const StyledPageDescription = styled.p`
  margin-top: ${spacing06};
  color: ${gray100};
  font-size: 0.875rem;
  line-height: 1.375rem;
  max-width: 40rem;
`;

const StyledRightContent = styled.div``;

const StyledBreadcrumb = styled(Breadcrumb)`
  margin-bottom: 0;
  padding-bottom: ${spacing03};
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
  testId,
}) => {
  if (__DEV__) {
    warning(
      false,
      'Hero component has been deprecated and will be removed in the next release of `carbon-addons-iot-react`. \n Refactor to use PageTitleBar component instead.'
    );
  }
  return (
    <StyledHero data-testid={testId} className={className}>
      {isLoading ? (
        <SkeletonText data-testid={`${testId}-loading`} width="30%" />
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
            <StyledTitle data-testid={`${testId}-title`}>
              {title}
              {tooltip ? (
                <Tooltip
                  clickToOpen
                  tabIndex={0}
                  triggerText=""
                  tooltipId="hero-tooltip"
                  triggerId="hero-tooltip-trigger"
                  renderIcon={React.forwardRef((props, ref) => (
                    <Information size={20} ref={ref} />
                  ))}
                  data-testid={`${testId}-tooltip`}
                >
                  <p>{tooltip.message}</p>
                  {tooltip.href && tooltip.linkLabel ? (
                    <div className={`${prefix}--tooltip__footer`}>
                      <a href={tooltip.href} className={`${prefix}--link`}>
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
                className={`${prefix}--modal-close`}
                type="button"
                data-modal-close
                aria-label={closeLabel}
                onClick={onClose}
                data-testid={`${testId}-close-button`}
              >
                <svg
                  className={`${prefix}--modal-close__icon`}
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
          {description ? (
            <StyledPageDescription data-testid={`${testId}-description`}>
              {description}
            </StyledPageDescription>
          ) : null}
        </Fragment>
      )}
    </StyledHero>
  );
};
Hero.propTypes = HeroPropTypes;
Hero.defaultProps = defaultProps;

export default Hero;
