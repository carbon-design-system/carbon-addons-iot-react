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
import {
  Breadcrumb as CarbonBreadcrumb,
  OverflowMenu,
  OverflowMenuItem,
} from 'carbon-components-react';
// import { BreadcrumbTypes } from 'carbon-components-react/lib/prop-types/types';
// import { settings } from 'carbon-components';
import styled from 'styled-components';
import overflowIcon20 from '@carbon/icons-react/lib/overflow-menu--horizontal/20';

import BreadcrumbOverflowItem from './BreadcrumbOverflowItem';

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
const setThreshold = t => (t < MINIMUM_OVERFLOW_THRESHOLD ? MINIMUM_OVERFLOW_THRESHOLD : t);

// const TestChildren = ({closeMenu, handleOverflowMenuItemFocus, children, ...other}) => {
//   return (
//     <div
//       {...other}
//       closeMenu={closeMenu}
//       handleOverflowMenuItemFocus={handleOverflowMenuItemFocus}
//     >
//       {children}
//     </div>
//   )
// }

const Breadcrumb = props => {
  const { className, children, noTrailingSlash, threshold, ...other } = props;

  const xthreshold = setThreshold(threshold);
  const showOverflow = children ? children.length > xthreshold : false;

  /** childrenWithProps is array
   * wrap children with style and handle, same with overflow menu item.
   */
  // const childrenWithProps = React.Children.map(children,(c,i) => {
  //   if (i !== 0 && i !== children.length - 1) {
  //     return React.cloneElement(c, {
  //       'name': i,
  //       closeMenu: () => {},
  //       handleOverflowMenuItemFocus: () => {},
  //       className: "bx--overflow-menu-options__option",
  //     });
  //   }
  //   return null;
  // });
  // const childrenWithProps = React.Children.toArray(children).map((child, index) => {
  //   return React.cloneElement(child, {
  //     name: index,
  //     className: 'bx--overflow-menu-options__option',
  //   });
  // });

  /** wrapChildren wrapped children array as node */
  /**
   * 1. <ul class="bx--overflow-menu-options bx--overflow-menu-options--open" tabindex="-1" role="menu" aria-label="Menu" data-floating-menu-direction="bottom" style="top: 79.9826px; position: absolute; margin: 0px; opacity: 1; left: 540.658px; right: auto;">
   *      <div index="0">
   *        <li class="bx--breadcrumb-item">
   *          <a href="/" class="bx--link">Breadcrumb Item2</a>
   *        </li>
   *      </div>
   *    </ul>
   * ==> <li>
   * 2. <ul class="bx--overflow-menu-options bx--overflow-menu-options--open" tabindex="-1" role="menu" aria-label="Menu" data-floating-menu-direction="bottom" style="top: 111.979px; position: absolute; margin: 0px; opacity: 1; left: 396.543px; right: auto;">
   *      <li class="bx--overflow-menu-options__option" role="menuitem">
   *        <button class="bx--overflow-menu-options__btn" tabindex="-1" index="0">
   *          <div class="bx--overflow-menu-options__option-content">test1</div>
   *        </button>
   *      </li>
   *    </ul>
   * */
  // const wrapChildren = <li className="test">{childrenWithProps}</li>;

  return (
    <div className="bx--col-lg-16 bx--col-md-8 bx--col-sm-4">
      {showOverflow ? (
        <div className="for-test">
          <StyledBreadcrumb {...other} className={className} noTrailingSlash={noTrailingSlash}>
            {/* <CarbonBreadcrumb> */}
            {children[0]}
            <StyledOverflowMenu renderIcon={StyledOverflowIcon20}>
              {/* {wrapChildren} */}
              {/* {childrenWithProps} */}
              {/* {
                React.Children.map(children,(child) => {
                  return (
                    <BreadcrumbOverflowItem>{child}</BreadcrumbOverflowItem>
                  )
                })
              } */}
              <BreadcrumbOverflowItem>1</BreadcrumbOverflowItem>

              <li>test</li>
            </StyledOverflowMenu>
            {children[children.length - 1]}
            {/* </CarbonBreadcrumb> */}
          </StyledBreadcrumb>
          <OverflowMenu>
            <OverflowMenuItem href="/" itemText="test1" />
            <OverflowMenuItem itemText="test2" />
            <OverflowMenuItem itemText="test3" />
          </OverflowMenu>
        </div>
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
