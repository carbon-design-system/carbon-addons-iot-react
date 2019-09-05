import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import warning from 'warning';

import { COLORS, PADDING } from '../../styles/styles';

import PageTitle from './PageTitle';
import PageSwitcher from './PageSwitcher';

const propTypes = {
  /** Section is an element that describes the category of this page */
  section: PropTypes.node,
  /** Title of the page  */
  title: PropTypes.node,
  /** Details about what the page shows */
  blurb: PropTypes.node,
  /** Whether or not we need to reserve a lot of height */
  big: PropTypes.bool, //eslint-disable-line
  /** The breadcrumb to render */
  crumb: (props, propName, componentName) => {
    const { crumb, title } = props;
    if (!crumb && !title) {
      return new Error(`One of props 'crumb' or 'title' was not specified in '${componentName}'.`);
    }
    if (crumb) {
      PropTypes.checkPropTypes(
        {
          crumb: PropTypes.node, // or any other PropTypes you want
        },
        { crumb: props.crumb },
        'prop',
        componentName
      );
    }
    return null;
  },
  /** The switcher actions */
  switcher: PropTypes.shape({
    onChange: PropTypes.func,
    selectedIndex: PropTypes.number,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        text: PropTypes.string,
        onClick: PropTypes.func,
        disabled: PropTypes.bool,
      })
    ).isRequired,
  }),
  /** Optional what to render in the left side of the hero */
  leftContent: PropTypes.node,
  /** Optional What to render in the right side of the hero */
  rightContent: PropTypes.node,
  className: PropTypes.string,
};

const defaultProps = {
  section: null,
  title: null,
  blurb: null,
  className: null,
  big: false,
  crumb: null,
  leftContent: null,
  rightContent: null,
  switcher: null,
};

const StyledPageHero = styled.div`
  background: ${COLORS.white};
  border-bottom: 1px solid ${COLORS.lightGrey};
  ${'' /* display: flex; */}
  padding-top: ${PADDING.verticalPadding};
  padding-left: ${PADDING.horizontalWrapPadding};
  padding-right: ${PADDING.horizontalWrapPadding};
  padding-bottom: ${PADDING.verticalPadding};
  display: flex;
  flex: 1 1;
  flex-flow: row nowrap;
  min-height: ${props => (props.big ? '193px' : 'unset')};
`;

const StyledPageHeroWrap = styled.div`
  align-items: flex-start;
  display: flex;
  margin: 0 auto;
  width: 100%;
  justify-content: space-between;
  transition: padding 0.2s;
`;

const StyledPageBlurb = styled.p`
  margin-bottom: 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  max-width: 50rem;
  flex: 1 1 20%;
`;

const StyledTitle = styled.div`
  flex-basis: 75%;
`;

const StyledRightContent = styled.div`
  padding-top: ${PADDING.verticalPadding};
  flex-basis: 25%;
`;

const StyledLeftContent = styled.div`
  padding-top: ${PADDING.verticalPadding};
`;

/**
 * Renders the hero text and styles for the page.  Can either render Section and Title with blurb or support a narrow one with breadcrumbs.
 */
const PageHero = ({
  section,
  title,
  blurb,
  className,
  crumb,
  leftContent,
  rightContent,
  switcher,
}) => {
  if (__DEV__) {
    warning(
      false,
      'PageHero component has been deprecated and will be removed in the next release of `carbon-addons-iot-react`. \n Refactor to use PageTitleBar component instead.'
    );
  }
  return (
    <StyledPageHero className={className}>
      {crumb || (
        <Fragment>
          {leftContent ? <StyledLeftContent>{leftContent}</StyledLeftContent> : null}
          <StyledTitle>
            <PageTitle section={section} title={title} />
            {switcher && switcher.options.length ? <PageSwitcher switcher={switcher} /> : null}
            <StyledPageHeroWrap>
              {blurb ? <StyledPageBlurb>{blurb}</StyledPageBlurb> : null}
            </StyledPageHeroWrap>
          </StyledTitle>
          {rightContent ? <StyledRightContent>{rightContent}</StyledRightContent> : null}
        </Fragment>
      )}
    </StyledPageHero>
  );
};

PageHero.propTypes = propTypes;
PageHero.defaultProps = defaultProps;

export default PageHero;
