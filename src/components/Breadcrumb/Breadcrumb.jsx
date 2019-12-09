/** 
👌 * 1. get container width
👌 * 2. calculate items total width
 * 3. compare container width and total width
 * 4. truncated if container width also small than total width.
*/

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Breadcrumb as CarbonBreadcrumb,
  OverflowMenu as CarbonOverflowMenu,
} from 'carbon-components-react';
import useResizeObserver from 'use-resize-observer';
import overflowIcon20 from '@carbon/icons-react/lib/overflow-menu--horizontal/20';
import styled from 'styled-components';

import BreadcrumbOverflowItem from './BreadcrumbOverflowItem';

import './_breadcrumb.scss';

const StyledOverflowIcon20 = styled(overflowIcon20)`
  & > circle {
    cy: 26;
  }
`;

const propTypes = {
  /** Pass in the BreadcrumbItem's for your Breadcrumb */
  children: PropTypes.node,
  breakpoint: PropTypes.number,
};

const defaultProps = {
  children: null,
  breakpoint: 10,
};

const Breadcrumb = props => {
  const { children, breakpoint, ...other } = props;

  // const breadcrumbRef = useRef(null);
  const { ref: breadcrumbRef, width: containerWidth, height: containerHeight } = useResizeObserver({
    useDefaults: false,
  });
  const [itemsWidth, setItemWidth] = useState(0);
  // const [overflowIndex, setOverflowIndex] = useState(1);

  useEffect(() => {
    let breadcrumbItemsWidth = 0;
    const breadcrumb = breadcrumbRef.current;
    console.log('breadcrumb: ', breadcrumb);
    const breadcrumItems = breadcrumb.querySelectorAll('li.bx--breadcrumb-item');
    console.log('breadcrum items', breadcrumItems);
    for (let i = breadcrumItems.length - 1; i >= 0; i -= 1) {
      console.log(i, ' length ', breadcrumItems[i].offsetWidth);
      breadcrumbItemsWidth += breadcrumItems[i].offsetWidth;
    }
    setItemWidth(breadcrumbItemsWidth);
  }, [breadcrumbRef]);

  // useEffect(() => {
  //     console.log("container: ",containerWidth);
  //     const breadcrumb = breadcrumbRef.current;
  //     const breadcrumItems = breadcrumb.querySelectorAll('li.bx--breadcrumb-item');
  //     let currentWidth = 0;
  //     for (let i = breadcrumItems.length - 1; i >= 0; i -= 1) {
  //         console.log(i, ' +length ', breadcrumItems[i].offsetWidth);
  //         currentWidth += breadcrumItems[i].offsetWidth;
  //     }
  //     console.log("current: ", currentWidth);

  //     if (currentWidth > containerWidth) {
  //         for (let i = 1; i <= breadcrumItems.length - 2; i += 1) {
  //             console.log(i, ' -length ', breadcrumItems[i].offsetWidth);
  //             currentWidth -= breadcrumItems[i].offsetWidth;
  //             if (currentWidth <= containerWidth) {
  //                 setOverflowIndex(i);
  //                 break;
  //             }
  //         }
  //         if (currentWidth > containerWidth) {
  //             setOverflowIndex(-1);
  //         }

  //     }
  // }, [containerWidth]);

  return (
    <div className="breadcrumb-container" ref={breadcrumbRef} {...other}>
      {containerWidth}x{containerHeight}
      children width: {itemsWidth}
      <CarbonBreadcrumb>{children}</CarbonBreadcrumb>
      {containerWidth >= itemsWidth ? (
        <CarbonBreadcrumb>{children}</CarbonBreadcrumb>
      ) : (
        <CarbonBreadcrumb {...other}>
          {children[0]}
          <CarbonOverflowMenu renderIcon={StyledOverflowIcon20}>
            {React.Children.map(children, (child, i) => {
              if (i !== 0 && i !== children.length - 1) {
                return <BreadcrumbOverflowItem>{child}</BreadcrumbOverflowItem>;
              }
              return null;
            })}
          </CarbonOverflowMenu>
          {children[children.length - 1]}
        </CarbonBreadcrumb>
      )}
    </div>
  );
};

Breadcrumb.propTypes = propTypes;
Breadcrumb.defaultProps = defaultProps;

export default Breadcrumb;
