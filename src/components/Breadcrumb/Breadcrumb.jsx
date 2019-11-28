/* TODO
👌1. follow angular 
👌2. pass in <Array>BreadcrumbItems
👌3. threshold, content
4. calculate font size, style, e.g. `valuecard` 76 line
5. `BreadcrumbItem` (as a child) need to be wrapped as a `overviewItem`
  ❌a. check every parameters from `BreadcrumbItem` 
  ❓b. ref
  c. wrap bx--breadcrumb-item style, same with `overviewItem`
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb as CarbonBreadcrumb, OverflowMenu } from 'carbon-components-react';
// import { BreadcrumbTypes } from 'carbon-components-react/lib/prop-types/types';
// import { settings } from 'carbon-components';
import styled from 'styled-components';
import overflowIcon20 from '@carbon/icons-react/lib/overflow-menu--horizontal/20';

const StyledBreadcrumb = styled(CarbonBreadcrumb)``;

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
  /**  */
};

const defaultProps = {
  children: null,
  className: null,
  noTrailingSlash: false,
  threshold: 0,
};

/**
 *
 * @param {number} t, threshold must be a valid number
 */
const setThreshold = t => {
  if (t < MINIMUM_OVERFLOW_THRESHOLD) {
    return MINIMUM_OVERFLOW_THRESHOLD;
  }
  return t;
};

const Breadcrumb = ({ className, children, noTrailingSlash, threshold, ...other }) => {
  const xthreshold = setThreshold(threshold);
  const showOverflow = children ? children.length > xthreshold : false;
  const wrapChildren = React.Children.toArray(children).filter((c, i) => {
    if (i !== 0 && i !== children.length - 1) {
      return React.cloneElement(c, {
        name: i,
      });
    }
    return null;
  });

  // const OverflowItems = () => {
  //   return showOverflow ? children[0: children.length-2] : null;
  // }

  return (
    <div className="bx--col-lg-16 bx--col-md-8 bx--col-sm-4">
      <StyledBreadcrumb {...other} className={className} noTrailingSlash={noTrailingSlash}>
        {showOverflow ? (
          <CarbonBreadcrumb>
            {children[0]}
            <StyledOverflowMenu renderIcon={StyledOverflowIcon20}>
              {/* {React.Children.map(children,(c, index) => {
                    if(index !== 0 || index !== children.length - 1){
                        return (
                
                            React.cloneElement(c, {
                            
                            color: "red",
                            name: index,
                            
                            })
                        )
                    } 
                    return null;
                // console.log(c)
                })} */}
              {wrapChildren}
            </StyledOverflowMenu>
            {children[children.length - 1]}
          </CarbonBreadcrumb>
        ) : (
          <div>{children}</div>
        )}
      </StyledBreadcrumb>
    </div>
  );
};

Breadcrumb.propTypes = propTypes;
Breadcrumb.defaultProps = defaultProps;

export default Breadcrumb;
