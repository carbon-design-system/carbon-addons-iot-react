import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Breadcrumb as CarbonBreadcrumb,
  OverflowMenu as CarbonOverflowMenu,
} from 'carbon-components-react';
import useResizeObserverHook from 'use-resize-observer';
import classNames from 'classnames';
import { settings } from 'carbon-components';
import OverflowMenuHorizaontal20 from '@carbon/icons-react/lib/overflow-menu--horizontal/20';

import BreadcrumbOverflowItem from './BreadcrumbOverflowItem';
import './_breadcrumb.scss';

const { prefix } = settings;

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
  const [overflowIndex, setOverflowIndex] = useState(0);
  const [truncate, setTruncate] = useState(false);
  // console.log('rise obeserver: ', containerWidth);

  const childRef = React.Children.map(children, useRef);
  const childrenWithRef = React.Children.map(children, (child, index) =>
    React.cloneElement(child, {
      ref: childRef[index],
      key: index,
    })
  );

  /** Initial effect on mount to get breadcrumb item widths */
  useEffect(() => {
    if (useResizeObserver) {
      setBreadcrumbItemsWidth(
        childrenWithRef.map(childWithRef => {
          return Math.ceil(childWithRef.ref.current.getBoundingClientRect().width);
        })
      );

      setTotalBreadcrumbItemsWidth(
        childrenWithRef.reduce((acc, childWithRef) => {
          return acc + Math.ceil(childWithRef.ref.current.getBoundingClientRect().width);
        }, 0)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Subsequent effect to evaluate the container/items width and determine which items should be placed in overflow menu  */
  useEffect(() => {
    if (useResizeObserver && containerWidth < totalBreadcrumbItemsWidth) {
      // Additionally take into account the width of the overflow menu icon, 32px
      let mutableTotalBreadcrumbItemsWidth = totalBreadcrumbItemsWidth + 32;

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
      if (containerWidth <= mutableTotalBreadcrumbItemsWidth) {
        // setOverflowIndex(-1);
        setTruncate(true);
      }

      console.log('container width: ', containerWidth);
      console.log('mutableTotalBreadcrumbItemsWidth: ', mutableTotalBreadcrumbItemsWidth);
    }
  }, [
    children,
    overflowIndex,
    containerWidth,
    useResizeObserver,
    breadcrumbItemsWidth,
    totalBreadcrumbItemsWidth,
  ]);

  if (useResizeObserver) {
    return (
      <div ref={breadcrumbRef}>
        {totalBreadcrumbItemsWidth > containerWidth ? (
          <>
            <CarbonBreadcrumb
              className={classNames(className, {
                [`${prefix}--breadcrumb-item--hidden`]: typeof containerWidth === 'undefined',
                [`${prefix}--breadcrumb--truncate`]: truncate === true, // overflowIndex === -1,
              })}
              {...other}
            >
              {childrenWithRef[0]}
              <span className={`${prefix}--breadcrumb-overflow`}>
                <CarbonOverflowMenu renderIcon={OverflowMenuHorizaontal20}>
                  {React.Children.map(childrenWithRef, (child, i) => {
                    if (i !== 0 && i <= overflowIndex) {
                      return <BreadcrumbOverflowItem>{child}</BreadcrumbOverflowItem>;
                    }
                    return null;
                  })}
                </CarbonOverflowMenu>
              </span>
              {truncate === true // overflowIndex === -1
                ? childrenWithRef[childrenWithRef.length - 1]
                : childrenWithRef.slice(overflowIndex + 1, childrenWithRef.length)}
            </CarbonBreadcrumb>
          </>
        ) : (
          <CarbonBreadcrumb
            className={classNames(className, {
              [`${prefix}--breadcrumb-item--hidden`]: typeof containerWidth === 'undefined',
              [`${prefix}--breadcrumb--truncate`]: overflowIndex === -1,
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
