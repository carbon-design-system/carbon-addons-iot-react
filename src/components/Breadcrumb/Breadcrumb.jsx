import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Breadcrumb as CarbonBreadcrumb, OverflowMenu } from 'carbon-components-react';
import overflowIcon20 from '@carbon/icons-react/lib/overflow-menu--horizontal/20';

import BreadcrumbOverflowItem from './BreadcrumbOverflowItem';

// TODO: set style process multi media
const StyledBreadcrumb = styled(CarbonBreadcrumb)`
  overflow: hidden;
  text-overflow: ellipsis;
`;

// TODO: slash should not be click
const StyledOverflowMenu = styled(OverflowMenu)`
  &::after {
    content: '/';
    color: #171717;
    margin-left: 0.5rem;
  }
  margin-right: 0.5rem;
`;

const StyledOverflowIcon20 = styled(overflowIcon20)`
  & > circle {
    cy: 26;
  }
`;

const MINIMUM_OVERFLOW_THRESHOLD = 4;

const propTypes = {
  /** Pass in the BreadcrumbItem's for your Breadcrumb */
  children: PropTypes.node,
  /** Specify an optional className to be applied to the container node */
  className: PropTypes.string,
  /** Optional prop to omit the trailing slash for the breadcrumb */
  noTrailingSlash: PropTypes.bool,
  /** Define to show how many items */
  threshold: PropTypes.number,
};

const defaultProps = {
  children: null,
  className: null,
  noTrailingSlash: false,
  threshold: 0,
};

/**
 * @param {number} t, threshold must be a valid number
 */
const setThreshold = t => (t < MINIMUM_OVERFLOW_THRESHOLD ? MINIMUM_OVERFLOW_THRESHOLD : t);

const Breadcrumb = props => {
  const { className, children, noTrailingSlash, threshold, ...other } = props;

  const t = setThreshold(threshold);
  const showOverflow = children ? children.length > t : false;

  return (
    <div className="bx--col-lg-16 bx--col-md-8 bx--col-sm-4">
      {showOverflow ? (
        <StyledBreadcrumb {...other} className={className} noTrailingSlash={noTrailingSlash}>
          {children[0]}
          <StyledOverflowMenu renderIcon={StyledOverflowIcon20}>
            {React.Children.map(children, (child, i) => {
              if (i !== 0 && i !== children.length - 1) {
                return <BreadcrumbOverflowItem>{child}</BreadcrumbOverflowItem>;
              }
              return null;
            })}
          </StyledOverflowMenu>
          {children[children.length - 1]}
        </StyledBreadcrumb>
      ) : (
        <StyledBreadcrumb {...other} className={className} noTrailingSlash={noTrailingSlash}>
          {children}
        </StyledBreadcrumb>
      )}
    </div>
  );
};

Breadcrumb.propTypes = propTypes;
Breadcrumb.defaultProps = defaultProps;

export default Breadcrumb;
