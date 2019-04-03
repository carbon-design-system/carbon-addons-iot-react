import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

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
  switchers: PropTypes.shape({
    onChange: PropTypes.func,
    switcher: PropTypes.arrayOf(
      PropTypes.shape({
        switcherId: PropTypes.string,
        switcherText: PropTypes.string,
        onClick: PropTypes.func,
        disabled: PropTypes.bool,
      }).isRequired
    ),
  }),
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
  rightContent: null,
  switchers: {
    onChange: null,
    switcher: [],
  },
};

const StyledPageHero = styled.div`
  background: ${COLORS.white};
  border-bottom: 1px solid ${COLORS.lightGrey};
  ${'' /* display: flex; */}
  padding-top: ${PADDING.verticalPadding};
  padding-left: ${PADDING.horizontalWrapPadding};
  padding-right: ${PADDING.horizontalWrapPadding};
  padding-bottom: ${PADDING.verticalPadding};
  min-height: ${props => (props.big ? '193px' : 'unset')};
`;

const StyledPageHeroWrap = styled.div`
  align-items: center;
  display: flex;
  margin: 0 auto;
  width: 100%;
  justify-content: space-between;
  transition: padding 0.2s;
`;

const StyledPageBlurb = styled.p`
  margin-bottom: 1rem;
  color: ${COLORS.gray};
  font-size: 0.875rem;
  line-height: 1.5rem;
  max-width: 50rem;
  flex: 1 1 20%;
`;

/**
 * Renders the hero text and styles for the page.  Can either render Section and Title with blurb or support a narrow one with breadcrumbs.
 */
const PageHero = ({ section, title, blurb, className, crumb, rightContent, switchers }) => (
  <StyledPageHero className={className}>
    {crumb || (
      <div>
        <PageTitle section={section} title={title} />
        {switchers && switchers.switcher.length ? <PageSwitcher switchers={switchers} /> : null}
        <StyledPageHeroWrap>
          {blurb ? <StyledPageBlurb>{blurb}</StyledPageBlurb> : null}
          {rightContent}
        </StyledPageHeroWrap>
      </div>
    )}
  </StyledPageHero>
);

PageHero.propTypes = propTypes;
PageHero.defaultProps = defaultProps;

export default PageHero;
