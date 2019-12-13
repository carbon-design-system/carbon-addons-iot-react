import React, { useState, useEffect } from 'react';
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
  const [breadcrumbChildren, setBreadcrumbChildren] = useState(children);
  const [overflowIndex, setOverflowIndex] = useState(0);

  /** intial to get children total width */
  useEffect(() => {
    // measure child total width
    const itemsWidth = [];
    const breadcrumb = breadcrumbRef.current;
    const breadcrumItems = breadcrumb.querySelectorAll('li.bx--breadcrumb-item');

    if (breadcrumItems.length > 0) {
      for (let i = 0; i <= breadcrumItems.length - 1; i += 1) {
        itemsWidth.push(breadcrumItems[i].offsetWidth);
      }
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
      setBreadcrumbChildren(children);
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerWidth]);

  const showOverflowMenu = containerWidth > totalWidth ? 'no' : 'yes';

  if (typeof containerWidth === 'undefined') {
    return (
      <div ref={breadcrumbRef} style={{ width: `100%`, visibility: `hidden` }}>
        <CarbonBreadcrumb {...other}>{breadcrumbChildren}</CarbonBreadcrumb>
      </div>
    );
  }
  return (
    <div ref={breadcrumbRef} style={{ visibility: `visible`, width: `100%` }}>
      {showOverflowMenu === 'yes' ? (
        <>
          <CarbonBreadcrumb>
            {overflowIndex === -1 ? (
              <div style={{ textOverflow: `ellipsis`, overflow: `hidden` }}>
                {breadcrumbChildren[0]}
              </div>
            ) : (
              breadcrumbChildren[0]
            )}
            <CarbonOverflowMenu renderIcon={() => <div className="breadcrumb-overflow">...</div>}>
              {React.Children.map(breadcrumbChildren, (child, i) => {
                if (i !== 0 && i <= overflowIndex) {
                  return <BreadcrumbOverflowItem>{child}</BreadcrumbOverflowItem>;
                }
                return null;
              })}
            </CarbonOverflowMenu>
            {overflowIndex === -1 ? (
              <div style={{ textOverflow: `ellipsis`, overflow: `hidden` }}>
                {breadcrumbChildren[breadcrumbChildren.length - 1]}
              </div>
            ) : (
              breadcrumbChildren.slice(overflowIndex + 1, breadcrumbChildren.length)
            )}
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
