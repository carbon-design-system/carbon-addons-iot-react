import React, { useRef, useEffect, useState, Children } from 'react';
import PropTypes from 'prop-types';
import useResizeObserver from 'use-resize-observer';
import { OverflowMenuItem, OverflowMenu, Tag } from 'carbon-components-react';
import { Close16 } from '@carbon/icons-react';

const DefaultWrapper = React.forwardRef(({ children, ...props }, ref) => {
  return (
    <span {...props} ref={ref}>
      {children}
    </span>
  );
});

const OverflowTag = ({ children }) => (
  <span>
    {children} <Close16 />
  </span>
);

const FilterTags = ({ children, hasOverflow, startingIndex }) => {
  const overFlowContainerRef = useRef(null);
  useResizeObserver({
    ref: overFlowContainerRef,
  });
  const childrenItems = Children.map(children, child => child);
  const breakingWidth = useRef([]);
  const [overflowItems, setOverflowItems] = useState([]);
  const [visibleItems, setVisibleItems] = useState(childrenItems);

  useEffect(
    () => {
      if (hasOverflow && overFlowContainerRef) {
        setOverflowItems([]);
        setVisibleItems(childrenItems.slice(startingIndex));
      }
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [children]
  );

  useEffect(
    () => {
      if (overFlowContainerRef.current) {
        const clientWidth = overFlowContainerRef.current?.clientWidth;
        const scrollWidth = overFlowContainerRef.current?.scrollWidth;
        const currBreakingWidth = breakingWidth.current;
        const breakingWidthLength = currBreakingWidth.length;
        const tooBig = scrollWidth > clientWidth;

        if (tooBig) {
          currBreakingWidth.push(scrollWidth);
          if (visibleItems.length > 1) {
            // Move item to the hidden list
            setOverflowItems([visibleItems.pop(), ...overflowItems]);
            setVisibleItems([...visibleItems]);
          }
        } else if (
          currBreakingWidth[breakingWidthLength - 1] >= 0 &&
          clientWidth > currBreakingWidth[breakingWidthLength - 1] &&
          overflowItems.length > 0
        ) {
          // Move the item to the visible list
          setVisibleItems([...visibleItems, overflowItems.shift()]);
          setOverflowItems([...overflowItems]);
          currBreakingWidth.shift();
        }
      }
    } /* eslint-disable react-hooks/exhaustive-deps */,
    [
      overFlowContainerRef?.current?.scrollWidth,
      overFlowContainerRef?.current?.clientWidth,
      childrenItems,
    ]
    /* eslint-enable react-hooks/exhaustive-deps */
  );

  return (
    <DefaultWrapper className="filtertags--container" ref={overFlowContainerRef}>
      {visibleItems}
      {overflowItems.length > 0 && (
        <OverflowMenu
          data-floating-menu-container
          className="filtertags--overflow"
          renderIcon={() => <div className="bx--tag">{`More: ${overflowItems.length}`}</div>}
          menuOptionsClass="filtertags--overflow-items"
          menuOffset={{
            top: 15,
          }}
        >
          {overflowItems.map((child, i) => (
            <OverflowMenuItem
              // {...child.props}
              primaryFocus={i === 0}
              className="filtertags--overflow-item"
              title={child.props.children}
              key={`${child.props.children}-${i}`}
              onClick={child.props.onClose}
              itemText={<OverflowTag filter>{child.props.children}</OverflowTag>}
            />
          ))}
        </OverflowMenu>
      )}
    </DefaultWrapper>
  );
};

const propTypes = {
  /**
   * Tag components nested inside Filter tag component
   */
  children: PropTypes.node,
  /**
   * Bit to determine if tags collapse into overflow tag
   */
  hasOverflow: PropTypes.bool,
};

const defaultProps = {
  hasOverflow: true,
  startingIndex: 0,
};

FilterTags.propTypes = propTypes;
FilterTags.defaultProps = defaultProps;
export default FilterTags;
