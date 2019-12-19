import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Breadcrumb as CarbonBreadcrumb,
  OverflowMenu as CarbonOverflowMenu,
} from 'carbon-components-react';
import useResizeObserverHook from 'use-resize-observer';
import classNames from 'classnames';

import BreadcrumbOverflowItem from './BreadcrumbOverflowItem';
import './_breadcrumb.scss';

const propTypes = {
  /** Pass in the BreadcrumbItem's for your Breadcrumb */
  children: PropTypes.node,
  useResizeObserver: PropTypes.bool,
};

const defaultProps = {
  children: null,
  useResizeObserver: false,
};

const Breadcrumb = props => {
  const { children, className, useResizeObserver, ...other } = props;
  const [breadcrumbItemsWidth, setBreadcrumbItemsWidth] = useState([]);
  const [totalBreadcrumbItemsWidth, setTotalBreadcrumbItemsWidth] = useState(0);
  const { ref: breadcrumbRef, width: containerWidth } = useResizeObserverHook({
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
    if (useResizeObserver) {
      // let itemWidths = [];
      // childrenWithRef.forEach(childWithRef => {
      //   itemWidths.push(
      //     Math.floor(childWithRef.ref.current.getBoundingClientRect().width)
      //   );
      // });

      setBreadcrumbItemsWidth(
        childrenWithRef.map(childWithRef => {
          return Math.floor(childWithRef.ref.current.getBoundingClientRect().width);
        })
      );

      setTotalBreadcrumbItemsWidth(
        childrenWithRef.reduce((acc, childWithRef) => {
          return acc + Math.floor(childWithRef.ref.current.getBoundingClientRect().width);
        }, 0)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** adjust overflow items number to responce container width  */
  useEffect(
    () => {
      if (useResizeObserver && containerWidth < totalBreadcrumbItemsWidth) {
        let mutableTotalBreadcrumbItemsWidth = totalBreadcrumbItemsWidth;

        // iterate over the middle breadcrumb items (exclude first, exclude last)
        for (let i = 1; i <= breadcrumbItemsWidth.length - 2; i += 1) {
          // pull one item out of the list, to see if the remaining items will fit
          mutableTotalBreadcrumbItemsWidth -= breadcrumbItemsWidth[i];

          if (containerWidth >= mutableTotalBreadcrumbItemsWidth) {
            setOverflowIndex(i);
            break;
          }
        }

        // despite collapsing all items into overflow, the container is still too small
        // we should begin to ellipsis the first/last items
        if (containerWidth < mutableTotalBreadcrumbItemsWidth) {
          setOverflowIndex(-1);
        }
      }
    },
    [containerWidth, totalBreadcrumbItemsWidth, children, breadcrumbItemsWidth, useResizeObserver]
  );

  if (useResizeObserver) {
    console.log(
      `RENDER 
      containerWidth: ${containerWidth}, totalBreadcrumbItemsWidth: ${totalBreadcrumbItemsWidth}`
    );

    return (
      <div ref={breadcrumbRef}>
        {totalBreadcrumbItemsWidth > containerWidth ? (
          <>
            <CarbonBreadcrumb
              className={classNames(className, {
                'breadcrumb-item--hidden': typeof containerWidth === 'undefined',
              })}
              {...other}
            >
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
          <CarbonBreadcrumb
            className={classNames(className, {
              'breadcrumb-item--hidden': typeof containerWidth === 'undefined',
            })}
            {...other}
          >
            {childrenWithRef}
          </CarbonBreadcrumb>
        )}
      </div>
    );
  }
  return (
    <CarbonBreadcrumb className={className} {...other}>
      {children}
    </CarbonBreadcrumb>
  );
};

Breadcrumb.propTypes = propTypes;
Breadcrumb.defaultProps = defaultProps;

export default Breadcrumb;
