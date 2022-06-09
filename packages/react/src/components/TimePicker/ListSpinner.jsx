import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ChevronUp16, ChevronDown16 } from '@carbon/icons-react';
import classNames from 'classnames';

import { settings } from '../../constants/Settings';
import useMerged from '../../hooks/useMerged';
import Button from '../Button';

const { iotPrefix } = settings;

const propTypes = {
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  /** Label for input (will be first, if range type) */
  labelText: PropTypes.string.isRequired,
  /** Specify wehether you watn the primary label to be visually hidden */
  hideLabel: PropTypes.bool,
  /** Optional default value for primary input */
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Specify the value for primary input */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Label for second input in range */
  secondaryLabelText: PropTypes.string,
  /** Specify wehether you watn the secondary label to be visually hidden */
  hideSecondaryLabel: PropTypes.bool,
  /** Optional default value for secondary input */
  defaultSecondaryValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Specify the value for secondary input */
  secondaryValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Input can be for a single time or a range - defaults to single */
  type: PropTypes.oneOf(['single', 'range']),
  i18n: PropTypes.shape({
    invalidText: PropTypes.string,
    warnTextr: PropTypes.string,
    timeIconText: PropTypes.string,
    placeholderText: PropTypes.string,
  }),
  /** Size of input */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** Specify whether the control is currently disabled */
  disabled: PropTypes.bool,
  /** Specify whether the control is currently read only */
  readOnly: PropTypes.bool,
  /** Specify whether the control is currently in warning state */
  warn: PropTypes.arrayOf(PropTypes.bool),
  /** Specify whether the control is currently in invalid state */
  invalid: PropTypes.arrayOf(PropTypes.bool),
  /** Optional handler that is called whenever <input> is updated */
  onChange: PropTypes.func,
  /** Optional handler that is called whenever <input> is clicked */
  onClick: PropTypes.func,
  testId: PropTypes.string,
  listItems: PropTypes.arrayOf(PropTypes.node),
  defaultSelectedId: PropTypes.string,
  containerElement: PropTypes.string,
};

const defaultProps = {
  listItems: [],
  defaultSelectedId: undefined,
  className: undefined,
  hideLabel: false,
  defaultValue: undefined,
  secondaryLabelText: undefined,
  hideSecondaryLabel: false,
  defaultSecondaryValue: undefined,
  type: 'single',
  i18n: {
    invalidText: 'The time entered is invalid',
    warnText: undefined,
    timeIconText: 'Open time picker',
    placeholderText: 'hh:mm',
  },
  size: 'lg',
  disabled: false,
  readOnly: false,
  warn: [false, false],
  invalid: [false, false],
  onChange: () => {},
  onClick: () => {},
  testId: 'timer-picker',
  containerElement: 'ul',
};

function scrollIntoView(el) {
  el.scrollIntoView({ block: 'center' });
}

const ListSpinner = ({
  className,
  listItems,
  defaultSelectedId,
  containerElement: ContainerElement,
}) => {
  const containerRef = useRef();
  const contentRef = useRef();
  const [selectedId, setSelectedId] = React.useState(defaultSelectedId);
  const [height, setHeight] = React.useState(0);

  const handleScroll = React.useCallback(() => {
    console.log('scrolling');
    if (containerRef.current) {
      const scroll = containerRef.current.scrollTop;
      if (scroll < height || scroll >= height + height) {
        containerRef.current.scrollTop = height + (scroll % height);
      }
    }
  }, [height]);

  React.useLayoutEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.offsetHeight * listItems.length);
      containerRef.current.scrollTop = height;
    }
  }, [height, listItems]);

  useEffect(() => {
    setTimeout(() => scrollIntoView(contentRef.current), 200);
  }, [selectedId]);

  const listRef = useCallback(
    (node) => {
      if (node) {
        const element = node;
        containerRef.current = node;
        element.style.right = `${node.clientWidth - node.offsetWidth}px`;
      }
    },
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    []
  );

  const handleClick = (e) => {
    if (e.currentTarget.id === `${iotPrefix}--list-spinner__btn--up`) {
      // const str = contentRef.current?.previousElementSibling.id;
      // console.log(str.includes('-dupe'));
      // if (str.includes('-dupe')) {
      //   setSelectedId(str.substring(str.length - 7));
      // } else {
      // }
      setSelectedId(contentRef.current?.previousElementSibling.id);
    } else if (e.currentTarget.id === `${iotPrefix}--list-spinner__btn--down`) {
      // console.log(contentRef.current.nextElementSibling.id);
      setSelectedId(contentRef.current?.nextElementSibling.id);
    } else {
      console.log(e.currentTarget.id);
      setSelectedId(e.currentTarget.id);
    }
  };

  const updatedList = useMemo(() => {
    const items = listItems.map((child) => {
      return React.cloneElement(child, {
        key: child.props.id,
        id: child.props.id,
        onClick: handleClick,
        className: `${iotPrefix}--list-spinner__list-item ${
          child.props.className ? `${child.props.className}-spinner__list-item` : ''
        } ${
          child.props.id === selectedId ? `${iotPrefix}--list-spinner__list-item--selected` : ''
        } `,
        ref: child.props.id === selectedId ? contentRef : null,
      });
    });
    const dupeItems = listItems.map((child) => {
      return React.cloneElement(child, {
        key: `${child.props.id}-dupe-1`,

        id: child.props.id,
        // id: `${child.props.id}-dupe-1`,
        onClick: handleClick,
        className: `${iotPrefix}--list-spinner__list-item ${
          child.props.className ? `${child.props.className}-spinner__list-item` : ''
        } ${
          `${child.props.id}-dupe-1` === selectedId
            ? `${iotPrefix}--list-spinner__list-item--selected`
            : ''
        }`,
        ref: `${child.props.id}-dupe-1` === selectedId ? contentRef : null,
      });
    });

    const dupeItems2 = listItems.map((child) => {
      return React.cloneElement(child, {
        key: `${child.props.id}-dupe-2`,
        id: child.props.id,
        // id: `${child.props.id}-dupe-2`,
        onClick: handleClick,
        className: `${iotPrefix}--list-spinner__list-item ${
          child.props.className ? `${child.props.className}-spinner__list-item` : ''
        } ${
          `${child.props.id}-dupe-2` === selectedId
            ? `${iotPrefix}--list-spinner__list-item--selected`
            : ''
        } `,
        ref: `${child.props.id}-dupe-2` === selectedId ? contentRef : null,
      });
    });

    return [...dupeItems, ...items, ...dupeItems2];
  }, [listItems, selectedId]);

  return (
    <div
      className={classNames(`${iotPrefix}--list-spinner__section`, {
        [`${className}-spinner__section`]: className,
      })}
    >
      <Button
        id={`${iotPrefix}--list-spinner__btn--up`}
        onClick={handleClick}
        className={`${iotPrefix}--list-spinner__btn ${className}-spinner__btn`}
        renderIcon={ChevronUp16}
        kind="ghost"
      />
      <div
        // ref={containerRef}
        className={`${iotPrefix}--list-spinner__list-container ${className}-spinner__list-container`}
      >
        <ContainerElement
          ref={listRef}
          className={`${iotPrefix}--list-spinner__list ${className}-spinner__list`}
          onWheel={handleScroll}
          onTouchMove={handleScroll}
        >
          {updatedList}
        </ContainerElement>
      </div>
      <Button
        id={`${iotPrefix}--list-spinner__btn--down`}
        onClick={handleClick}
        className={`${iotPrefix}--list-spinner__btn ${className}-spinner__btn`}
        renderIcon={ChevronDown16}
        kind="ghost"
      />
    </div>
  );
};

ListSpinner.propTypes = propTypes;
ListSpinner.defaultProps = defaultProps;
export default ListSpinner;
