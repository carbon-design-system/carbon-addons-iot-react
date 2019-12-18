import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Breadcrumb as CarbonBreadcrumb,
  OverflowMenu as CarbonOverflowMenu,
} from 'carbon-components-react';
import useResizeObserver from 'use-resize-observer';

import BreadcrumbOverflowItem from './BreadcrumbOverflowItem';
import './_breadcrumb.scss';

const propTypes = {
  /** Pass in the BreadcrumbItem's for your Breadcrumb */
  children: PropTypes.node,
};

const defaultProps = {
  children: null,
};

const Breadcrumb = props => {
  const { children, ...other } = props;
  const [breadcrumbItemsWidth, setBreadcrumbItemsWidth] = useState([0]);
  const [totalWidth, setTotalWidth] = useState(0);
  const { ref: breadcrumbRef, width: containerWidth } = useResizeObserver({
    useDefaults: false,
  });
  // const [breadcrumbChildren, setBreadcrumbChildren] = useState(children);
  const [overflowIndex, setOverflowIndex] = useState(0);
  const childRef = React.Children.map(children, useRef);

  const childrenWithRef = React.Children.map(children, (child, index) =>
    React.cloneElement(child, {
      ref: childRef[index],
      key: index,
    })
  );

  /** intial to get children total width */
  useEffect(() => {
    // measure child total width
    const itemsWidth = [];
    // const breadcrumb = breadcrumbRef.current;
    // const breadcrumItems = breadcrumb.querySelectorAll('li.bx--breadcrumb-item');

    // if (breadcrumItems.length > 0) {
    //   for (let i = 0; i <= breadcrumItems.length - 1; i += 1) {
    //     itemsWidth.push(breadcrumItems[i].offsetWidth);
    //   }
    //   setBreadcrumbItemsWidth(itemsWidth);
    //   const curTotalWidth = itemsWidth.reduce((acc, cur) => acc + cur);
    //   setTotalWidth(curTotalWidth);
    // }

    // console.log("parent :", breadcrumbRef.current);
    // console.log("children : ", childrenWithRef);
    for (let i = 0; i < childrenWithRef.length; i += 1) {
      // console.log("child with ref: ", childrenWithRef[i].ref.current);
      // console.log("children height x width: ", childrenWithRef[i].ref.current.getBoundingClientRect());
      itemsWidth.push(childrenWithRef[i].ref.current.getBoundingClientRect().width);
      setBreadcrumbItemsWidth(itemsWidth);
      const curTotalWidth = itemsWidth.reduce((acc, cur) => acc + cur);
      setTotalWidth(curTotalWidth);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** adjust overflow items number to responce container width  */
  useEffect(() => {
    let curTotalWidth = breadcrumbItemsWidth.reduce((acc, cur) => acc + cur);

    if (containerWidth >= curTotalWidth) {
      // setBreadcrumbChildren(children);
    } else {
      for (let i = 1; i <= breadcrumbItemsWidth.length - 2; i += 1) {
        curTotalWidth -= breadcrumbItemsWidth[i];
        if (containerWidth >= curTotalWidth) {
          setOverflowIndex(i);
          break;
        }
      }
      if (containerWidth < curTotalWidth) {
        setOverflowIndex(-1);
      }
    }
  }, [containerWidth, breadcrumbItemsWidth, children]);

  const showOverflowMenu = containerWidth > totalWidth;

  if (typeof containerWidth === 'undefined') {
    return (
      <div ref={breadcrumbRef} style={{ width: `100%` }}>
        <CarbonBreadcrumb {...other}>{childrenWithRef}</CarbonBreadcrumb>
      </div>
    );
  }
  return (
    <div ref={breadcrumbRef} style={{ visibility: `visible`, width: `100%` }}>
      {!showOverflowMenu ? (
        <>
          <CarbonBreadcrumb>
            {overflowIndex === -1 ? (
              <div style={{ textOverflow: `ellipsis`, overflow: `hidden` }}>
                {childrenWithRef[0]}
              </div>
            ) : (
              childrenWithRef[0]
            )}
            <CarbonOverflowMenu renderIcon={() => <div className="breadcrumb-overflow">...</div>}>
              {React.Children.map(childrenWithRef, (child, i) => {
                if (i !== 0 && i <= overflowIndex) {
                  return <BreadcrumbOverflowItem>{child}</BreadcrumbOverflowItem>;
                }
                return null;
              })}
            </CarbonOverflowMenu>
            {overflowIndex === -1 ? (
              <div style={{ textOverflow: `ellipsis`, overflow: `hidden` }}>
                {childrenWithRef[childrenWithRef.length - 1]}
              </div>
            ) : (
              childrenWithRef.slice(overflowIndex + 1, childrenWithRef.length)
            )}
          </CarbonBreadcrumb>
        </>
      ) : (
        <CarbonBreadcrumb {...other}>{childrenWithRef}</CarbonBreadcrumb>
      )}
    </div>
  );
};

Breadcrumb.propTypes = propTypes;
Breadcrumb.defaultProps = defaultProps;

export default Breadcrumb;
