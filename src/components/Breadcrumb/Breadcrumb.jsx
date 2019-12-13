import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Breadcrumb as CarbonBreadcrumb,
  OverflowMenu as CarbonOverflowMenu,
} from 'carbon-components-react';
import useResizeObserver from 'use-resize-observer';

// import styled from 'styled-components';
import BreadcrumbOverflowItem from './BreadcrumbOverflowItem';

const propTypes = {
  /** Pass in the BreadcrumbItem's for your Breadcrumb */
  children: PropTypes.node,
};

const defaultProps = {
  children: null,
};

const Breadcrumb = props => {
  const { children, ...other } = props;

  // const [isInitial, setIsInitial] = useState(true);
  // console.log('container width: ', containerWidth);
  const [breadcrumbItemsWidth, setBreadcrumbItemsWidth] = useState([0]);
  const [totalWidth, setTotalWidth] = useState(0);
  const { ref: breadcrumbRef, width: containerWidth, height: containerHeight } = useResizeObserver({
    useDefaults: false,
  });

  const [breadcrumbChildren, setBreadcrumbChildren] = useState(children);
  const [overflowIndex, setOverflowIndex] = useState(0);

  // for initial
  useEffect(() => {
    console.log('is initial: ', true);
    console.log('container size: ', containerWidth);

    // 🧐 measure child total width
    const itemsWidth = [];
    const breadcrumb = breadcrumbRef.current;
    // console.log('breadcrumb ref: ', breadcrumbRef);
    console.log('breadcrumb: ', breadcrumb);
    const breadcrumItems = breadcrumb.querySelectorAll('li.bx--breadcrumb-item');
    console.log('breadcrum items', breadcrumItems);
    if (breadcrumItems.length > 0) {
      for (let i = 0; i <= breadcrumItems.length - 1; i += 1) {
        console.log(i, ' length ', breadcrumItems[i].offsetWidth);
        // itemsWidth += breadcrumItems[i].offsetWidth;
        itemsWidth.push(breadcrumItems[i].offsetWidth);
      }
      setBreadcrumbItemsWidth(itemsWidth);
      const curTotalWidth = itemsWidth.reduce((acc, cur) => acc + cur);
      console.log('current total width: ', curTotalWidth);
      setTotalWidth(curTotalWidth);
    }
    // setIsInitial(false);
  }, [breadcrumbRef, containerWidth]);

  // 🧐 set breadcrumb children & responce container change
  useEffect(() => {
    console.log('container width: ', containerWidth);
    console.log('total width: ', breadcrumbItemsWidth);

    let curTotalWidth = breadcrumbItemsWidth.reduce((acc, cur) => acc + cur);

    if (containerWidth >= curTotalWidth) {
      setBreadcrumbChildren(children);
    } else {
      for (let i = 1; i <= breadcrumbItemsWidth.length - 2; i += 1) {
        console.log('current total width: ', curTotalWidth);
        curTotalWidth -= breadcrumbItemsWidth[i];
        if (containerWidth >= curTotalWidth) {
          setOverflowIndex(i);
          console.log('overflow index: ', i);
          break;
        }
      }
    }
  }, [breadcrumbItemsWidth, children, containerWidth]);

  const showOverflowMenu = containerWidth > totalWidth ? 'no' : 'yes';

  if (typeof containerWidth === 'undefined') {
    console.log('I have no container width: ', containerHeight);
    return (
      <div ref={breadcrumbRef} style={{ width: `100%`, visibility: `hidden` }}>
        <CarbonBreadcrumb {...other}>{breadcrumbChildren}</CarbonBreadcrumb>
      </div>
    );
  }
  return (
    <div style={{ visibility: `visible` }}>
      Hello{containerWidth}x{containerHeight}
      {showOverflowMenu === 'yes' ? (
        <>
          <CarbonBreadcrumb>
            {breadcrumbChildren[0]}
            <CarbonOverflowMenu
              renderIcon={() => <div className="test-breadcrumb-overflow">...</div>}
            >
              {React.Children.map(breadcrumbChildren, (child, i) => {
                if (i !== 0 && i <= overflowIndex) {
                  // !== breadcrumbChildren.length - 1) {
                  return <BreadcrumbOverflowItem>{child}</BreadcrumbOverflowItem>;
                }
                return null;
              })}
            </CarbonOverflowMenu>
            {breadcrumbChildren.slice(overflowIndex + 1, breadcrumbChildren.length)}
          </CarbonBreadcrumb>
        </>
      ) : (
        <CarbonBreadcrumb {...other}>{breadcrumbChildren}</CarbonBreadcrumb>
      )}
    </div>
  );
};

Breadcrumb.propTypes = propTypes;
Breadcrumb.defaultProps = defaultProps;

export default Breadcrumb;
