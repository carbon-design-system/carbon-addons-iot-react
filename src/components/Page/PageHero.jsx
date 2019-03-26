import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import { COLORS, PADDING } from '../../styles/styles';

import PageTitle from './PageTitle';

const StyledPageHero = styled.div`
  background: ${COLORS.white};
  border-bottom: rem(1) solid ${COLORS.lightGrey};
  display: flex;
  padding: ${PADDING.verticalSpace};
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
};

/**
 * Renders the hero text and styles for the page.  Can either render Section and Title with blurb or support a narrow one with breadcrumbs.
 */
const Page = ({ section, title, blurb, className, crumb, rightContent }) => (
  <StyledPageHero className={className}>
    <StyledPageHeroWrap>
      {crumb || <PageTitle section={section} title={title} blurb={blurb} />}
      {rightContent}
    </StyledPageHeroWrap>
  </StyledPageHero>
);

Page.propTypes = propTypes;
Page.defaultProps = defaultProps;

export default Page;
