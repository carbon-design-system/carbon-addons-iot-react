import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ChevronUp16, ChevronDown16 } from '@carbon/icons-react';
import classnames from 'classnames';

import { settings } from '../../constants/Settings';
import useMerged from '../../hooks/useMerged';
import Button from '../Button';

const { iotPrefix } = settings;

const propTypes = {
  className: PropTypes.string,
  testId: PropTypes.string,

  i18n: PropTypes.shape({
    previous: PropTypes.string,
    next: PropTypes.string,
  }),
  /** Optional default selected item */
  defaultSelectedId: PropTypes.string,
  /** Optional handler that is called whenever value is updated */
  onChange: PropTypes.func,
  /** Optional handler that is called whenever item is clicked */
  onClick: PropTypes.func,
  /** Array of items to render in the spinning list */
  list: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string, value: PropTypes.string })),
  /** Optional tag name to use instead of ul */
  containerElement: PropTypes.string,
};

const defaultProps = {
  className: undefined,
  testId: 'list-spinner',
  i18n: {
    previous: 'Previous item',
    next: 'Next item',
  },
  defaultSelectedId: undefined,
  onChange: () => {},
  onClick: () => {},
  list: [],
  containerElement: 'ul',
};

export function scrollIntoView(el) {
  el.scrollIntoView({ block: 'center' });
}

export function backwardArraySwap(arr) {
  const newArr = [...arr];
  const first = newArr.shift();
  newArr.push(first);
  // console.log('back', newArr);
  return newArr;
}

export function forwardArraySwap(arr) {
  const newArr = [...arr];
  const last = newArr.pop();
  newArr.unshift(last);
  // console.log('forward', newArr);
  return newArr;
}

/**
 *
 * @param {*} arr - the array to opperate on
 * @param {*} index - the index of the item to move
 * @returns array - new array with the chosen index as 3 item in array
 */
export function moveToSecondIndex(arr, index) {
  const newArr = [...arr];
  let removed;
  if (index > 2) {
    // 6 - 2
    removed = newArr.splice(0, index - 2);
    newArr.push(...removed);
  }
  if (index < 2) {
    const amnt = 2 - index;
    // 6 - 2
    removed = newArr.splice(-amnt, amnt);
    newArr.unshift(...removed);
  }
  return newArr;
}

let ticking = false;
let scrollEvent = false;
let scrollPosition;
let timer;

const ListSpinner = React.forwardRef(
  (
    {
      className,
      testId,
      i18n,
      defaultSelectedId,
      onChange,
      onClick,
      list,
      containerElement: ContainerElement,
    },
    ref
  ) => {
    const containerRef = useRef();
    const contentRef = useRef();
    const [listItems, setListItems] = useState(list);
    const [selectedId, setSelectedId] = useState(defaultSelectedId);

    const { previous, next } = useMerged(defaultProps.i18n, i18n);

    useEffect(() => {
      setSelectedId(defaultSelectedId);
    }, [defaultSelectedId]);

    useEffect(() => {
      // if (!scrollEvent) {
      // setTimeout(() => {
      const index = list.findIndex((i) => i.id === selectedId);
      const newList = moveToSecondIndex(list, index);
      setListItems(newList);
      // }, 200);
      // }
      onChange(selectedId);
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [onChange, selectedId]);

    useEffect(() => {
      // if (scrollEvent) {
      // scrollEvent = false;
      // scrollIntoView(contentRef.current);
      // }
      // setTimeout(() => containerRef.current?.focus(), 1500);
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [listItems]);

    const observerRef = React.useRef();
    useEffect(() => {
      // Create a new observer
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && scrollEvent) {
              clearTimeout(timer);
              timer = setTimeout(setSelectedId(entry.target.childNodes[0].id), 800);
            }
          });
        },
        {
          root: containerRef.current,
          rootMargin: '-50% 0% -50% 0%',
          threshold: 0,
        }
      );

      return () => observerRef.current?.disconnect();
    }, []);

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

    const handleWheel = (e) => {
      e.persist();
      scrollEvent = true;
      if (!ticking) {
        /* eslint-disable func-names */
        setTimeout(
          () =>
            window.requestIdleCallback(function () {
              if (e.deltaY < 0) {
                setSelectedId((prev) => {
                  const prevIndex = list.findIndex((i) => i.id === prev);
                  const val = prevIndex > 0 ? list[prevIndex - 1].id : list[list.length - 1].id;
                  onClick(val);
                  return val;
                });
              } else {
                setSelectedId((prev) => {
                  const prevIndex = list.findIndex((i) => i.id === prev);
                  const val =
                    prevIndex === list.indexOf(list[list.length - 1])
                      ? list[0].id
                      : list[prevIndex + 1].id;
                  onClick(val);
                  return val;
                });
              }
              ticking = false;
            }),
          100
        );

        ticking = true;
      }
    };

    const handleTouchMove = (e) => {
      e.persist();
      scrollEvent = true;
      if (!ticking) {
        /* eslint-disable func-names */
        setTimeout(
          () =>
            window.requestAnimationFrame(function () {
              if (scrollPosition - e.touches[0].pageY < 0) {
                setSelectedId((prev) => {
                  const prevIndex = list.findIndex((i) => i.id === prev);
                  return prevIndex > 0 ? list[prevIndex - 1].id : list[list.length - 1].id;
                });
              } else {
                setSelectedId((prev) => {
                  const prevIndex = list.findIndex((i) => i.id === prev);
                  return prevIndex === list.indexOf(list[list.length - 1])
                    ? list[0].id
                    : list[prevIndex + 1].id;
                });
              }
              scrollPosition = e.touches[0].pageY;
              ticking = false;
            }),
          80
        );

        ticking = true;
      }
    };

    const handleTouchStart = (e) => {
      e.persist();
      scrollPosition = e.touches[0].pageY;
    };

    const handleClick = useCallback(
      (e) => {
        scrollEvent = false;
        if (e.currentTarget.id === `${iotPrefix}--list-spinner__btn--up`) {
          setSelectedId((prev) => {
            const prevIndex = list.findIndex((i) => i.id === prev);
            const val = prevIndex > 0 ? list[prevIndex - 1].id : list[list.length - 1].id;
            onClick(val);
            return val;
          });
        } else if (e.currentTarget.id === `${iotPrefix}--list-spinner__btn--down`) {
          setSelectedId((prev) => {
            const prevIndex = list.findIndex((i) => i.id === prev);
            const val =
              prevIndex === list.indexOf(list[list.length - 1])
                ? list[0].id
                : list[prevIndex + 1].id;
            onClick(val);
            return val;
          });
        } else {
          setSelectedId(e.currentTarget.id);
          onClick(e.currentTarget.id);
        }
      },
      [list, onClick]
    );
    const renderItems = listItems.map((el) => (
      <li
        ref={(node) => {
          // Once component mounts tell our observer to observe it
          if (node) {
            if (el.value === selectedId) {
              contentRef.current = node;
            }
            setTimeout(() => observerRef.current?.observe(node), 0);
          }
        }}
        className={classnames(`${iotPrefix}--list-spinner__list-item`, {
          [`${iotPrefix}--list-spinner__list-item--selected`]: el.id === selectedId,
        })}
        key={el.id}
        id={`${el.id}-list-item`}
        data-selected={el.value === selectedId}
      >
        <Button id={el.id} kind="ghost" iconDescription={el.value} onClick={handleClick}>
          {el.value}
        </Button>
      </li>
    ));

    return (
      <div
        data-testid={testId}
        className={classnames(`${iotPrefix}--list-spinner__section`, {
          [className]: className,
        })}
      >
        <Button
          ref={ref}
          testId={`${testId}-prev-btn`}
          id={`${iotPrefix}--list-spinner__btn--up`}
          onClick={handleClick}
          iconDescription={previous}
          className={`${iotPrefix}--list-spinner__btn ${className}-spinner__btn`}
          renderIcon={ChevronUp16}
          kind="ghost"
        />
        <div
          className={`${iotPrefix}--list-spinner__list-container ${className}-spinner__list-container`}
        >
          <ContainerElement
            data-testid={`${testId}-list`}
            ref={listRef}
            className={`${iotPrefix}--list-spinner__list ${className}-spinner__list`}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            {renderItems}
          </ContainerElement>
        </div>
        <Button
          testId={`${testId}-next-btn`}
          id={`${iotPrefix}--list-spinner__btn--down`}
          onClick={handleClick}
          className={`${iotPrefix}--list-spinner__btn ${className}-spinner__btn`}
          iconDescription={next}
          renderIcon={ChevronDown16}
          kind="ghost"
        />
      </div>
    );
  }
);

ListSpinner.propTypes = propTypes;
ListSpinner.defaultProps = defaultProps;
export default ListSpinner;
