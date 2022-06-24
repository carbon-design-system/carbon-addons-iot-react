import React, { useState, useRef, useEffect, useCallback, useMemo, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { ChevronUp16, ChevronDown16 } from '@carbon/icons-react';
import classNames from 'classnames';

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
  listItems: PropTypes.arrayOf(PropTypes.node),
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
  listItems: [],
  containerElement: 'ul',
};

function scrollIntoView(el) {
  el.scrollIntoView({ block: 'center' });
}

// const ListSpinner = ({
//   className,
//   testId,
//   i18n,
//   defaultSelectedId,
//   onChange,
//   onClick,
//   listItems,
//   containerElement: ContainerElement,
// }) => {
//   const containerRef = useRef();
//   const contentRef = useRef();
//   const [selectedId, setSelectedId] = useState(defaultSelectedId);
//   const [height, setHeight] = useState(0);

//   useLayoutEffect(() => {
//     if (contentRef.current) {
//       setHeight(contentRef.current.offsetHeight * listItems.length);
//       containerRef.current.scrollTop = height;
//     }
//   }, [height, listItems]);

//   useEffect(() => {
//     setTimeout(() => scrollIntoView(contentRef.current), 200);
//     onChange(selectedId);
//   }, [onChange, selectedId]);

//   const observer = React.useRef();
//   useEffect(() => {
//     // Create a new observer
//     observer.current = new IntersectionObserver(
//       (entries) => {
//         // If lastItem is in veiwport & we have a pageToken
//         // trigger a new GET by updating pageToken state
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             console.log('I am in the center', entry.target);
//           }
//         });
//       },
//       {
//         root: containerRef.current,
//         rootMargin: '-50% 0% -50% 0%',
//         threshold: 0,
//       }
//     );
//     return () => observer.current?.disconnect();
//   }, []);

//   const listItemsRef = React.useCallback((node) => {
//     // Once component mounts tell our observer to observe it
//     if (node) {
//       observer.current?.observe(node);
//     }
//   }, []);

//   const listRef = useCallback(
//     (node) => {
//       if (node) {
//         const element = node;
//         containerRef.current = node;
//         element.style.right = `${node.clientWidth - node.offsetWidth}px`;
//       }
//     },
//     /* eslint-disable-next-line react-hooks/exhaustive-deps */
//     []
//   );

//   const handleClick = useCallback(
//     (e) => {
//       if (e.currentTarget.id === `${iotPrefix}--list-spinner__btn--up`) {
//         setSelectedId(contentRef.current?.previousElementSibling.id);
//       } else if (e.currentTarget.id === `${iotPrefix}--list-spinner__btn--down`) {
//         setSelectedId(contentRef.current?.nextElementSibling.id);
//       } else {
//         setSelectedId(e.currentTarget.id);
//       }
//       onClick(e);
//     },
//     [onClick]
//   );

//   const handleScroll = useCallback(() => {
//     if (containerRef.current) {
//       const scroll = containerRef.current.scrollTop;
//       if (scroll < height || scroll >= height + height) {
//         containerRef.current.scrollTop = height + (scroll % height);
//       }
//     }
//   }, [height]);

//   const updatedList = useMemo(() => {
//     const items = listItems.map((child) => {
//       return React.cloneElement(child, {
//         'data-testid': `${testId}-list-item`,
//         key: child.props.id,
//         id: child.props.id,
//         onClick: handleClick,
//         className: `${iotPrefix}--list-spinner__list-item ${
//           child.props.className ? `${child.props.className}-spinner__list-item` : ''
//         } ${
//           child.props.id === selectedId ? `${iotPrefix}--list-spinner__list-item--selected` : ''
//         } `,
//         ref: child.props.id === selectedId ? contentRef : listItemsRef,
//       });
//     });
//     const dupeItems = listItems.map((child) => {
//       return React.cloneElement(child, {
//         'data-testid': `${testId}-list-item`,
//         key: `${child.props.id}-dupe-1`,
//         id: child.props.id,
//         onClick: handleClick,
//         className: `${iotPrefix}--list-spinner__list-item ${
//           child.props.className ? `${child.props.className}-spinner__list-item` : ''
//         } ${
//           `${child.props.id}-dupe-1` === selectedId
//             ? `${iotPrefix}--list-spinner__list-item--selected`
//             : ''
//         }`,
//         ref: `${child.props.id}-dupe-1` === selectedId ? contentRef : listItemsRef,
//       });
//     });

//     const dupeItems2 = listItems.map((child) => {
//       return React.cloneElement(child, {
//         'data-testid': `${testId}-list-item`,
//         key: `${child.props.id}-dupe-2`,
//         id: child.props.id,
//         onClick: handleClick,
//         className: `${iotPrefix}--list-spinner__list-item ${
//           child.props.className ? `${child.props.className}-spinner__list-item` : ''
//         } ${
//           `${child.props.id}-dupe-2` === selectedId
//             ? `${iotPrefix}--list-spinner__list-item--selected`
//             : ''
//         } `,
//         ref: `${child.props.id}-dupe-2` === selectedId ? contentRef : listItemsRef,
//       });
//     });

//     return [...dupeItems, ...items, ...dupeItems2];
//   }, [handleClick, listItems, listItemsRef, selectedId, testId]);

//   return (
//     <div
//       data-testid={testId}
//       className={classNames(`${iotPrefix}--list-spinner__section`, {
//         [`${className}-spinner__section`]: className,
//       })}
//     >
//       <Button
//         testId={`${testId}-prev-btn`}
//         id={`${iotPrefix}--list-spinner__btn--up`}
//         onClick={handleClick}
//         className={`${iotPrefix}--list-spinner__btn ${className}-spinner__btn`}
//         renderIcon={ChevronUp16}
//         kind="ghost"
//       />
//       <div
//         className={`${iotPrefix}--list-spinner__list-container ${className}-spinner__list-container`}
//       >
//         <ContainerElement
//           data-testid={`${testId}-list`}
//           ref={listRef}
//           className={`${iotPrefix}--list-spinner__list ${className}-spinner__list`}
//           onWheel={handleScroll}
//           onTouchMove={handleScroll}
//         >
//           {updatedList}
//         </ContainerElement>
//       </div>
//       <Button
//         testId={`${testId}-next-btn`}
//         id={`${iotPrefix}--list-spinner__btn--down`}
//         onClick={handleClick}
//         className={`${iotPrefix}--list-spinner__btn ${className}-spinner__btn`}
//         renderIcon={ChevronDown16}
//         kind="ghost"
//       />
//     </div>
//   );
// };

const ListSpinner = ({
  className,
  testId,
  i18n,
  defaultSelectedId,
  onChange,
  onClick,
  listItems,
  containerElement: ContainerElement,
}) => {
  const containerRef = useRef();
  const contentRef = useRef();
  const [selectedId, setSelectedId] = useState(defaultSelectedId);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.offsetHeight * listItems.length);
      containerRef.current.scrollTop = height;
    }
  }, [height, listItems]);

  useEffect(() => {
    setTimeout(() => scrollIntoView(contentRef.current), 200);
    onChange(selectedId);
  }, [onChange, selectedId]);

  const observer = React.useRef();
  useEffect(() => {
    // Create a new observer
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // set the centered item as selected
            console.log('I am in the center', entry.target);
            // setSelectedId(entry.target.id);
            // setSelectedId(contentRef.current?.previousElementSibling.id);
          }
        });
      },
      {
        root: containerRef.current,
        rootMargin: '-50% 0% -50% 0%',
        threshold: 0,
      }
    );
    return () => observer.current?.disconnect();
  }, []);

  const listItemsRef = React.useCallback((node) => {
    // Once component mounts tell our observer to observe it
    if (node) {
      observer.current?.observe(node);
    }
  }, []);

  const listRef = useCallback(
    (node) => {
      if (node) {
        const element = node;
        containerRef.current = node;
        element.style.right = `${node.clientWidth - node.offsetWidth}px`;
        // node.addEventListener('scroll', handleScroll, { passive: false });
        // node.addEventListener('wheel', handleScroll, { passive: false });
        // node.addEventListener('touchmove', handleScroll, { passive: false });
      }
    },
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    []
  );

  const handleClick = useCallback(
    (e) => {
      containerRef.current.classList.toggle('no-scroll');
      if (e.currentTarget.id === `${iotPrefix}--list-spinner__btn--up`) {
        setSelectedId(contentRef.current?.previousElementSibling.id);
      } else if (e.currentTarget.id === `${iotPrefix}--list-spinner__btn--down`) {
        setSelectedId(contentRef.current?.nextElementSibling.id);
      } else {
        setSelectedId(e.currentTarget.id);
      }
      onClick(e);
      containerRef.current.classList.toggle('no-scroll');
    },
    [onClick]
  );

  const handleScroll = useCallback(() => {
    // e.preventDefault();
    // containerRef.current.scrollTop += 40;
    if (containerRef.current) {
      const scroll = containerRef.current.scrollTop;
      if (scroll < height || scroll >= height + height) {
        containerRef.current.classList.toggle('no-scroll');
        containerRef.current.scrollTop = height + (scroll % height);
        containerRef.current.classList.toggle('no-scroll');
      }
    }
  }, [height]);

  useEffect(() => {
    const list = document.getElementById('#list-spinner__list');
    if (list) {
      list.addEventListener('scroll', handleScroll, { passive: false });
      list.addEventListener('wheel', handleScroll, { passive: false });
      list.addEventListener('touchmove', handleScroll, { passive: false });
    } else {
      console.log('wtf');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updatedList = useMemo(() => {
    const items = listItems.map((child) => {
      return React.cloneElement(child, {
        'data-testid': `${testId}-list-item`,
        key: child.props.id,
        id: child.props.id,
        onClick: handleClick,
        className: `${iotPrefix}--list-spinner__list-item ${
          child.props.className ? `${child.props.className}-spinner__list-item` : ''
        } ${
          child.props.id === selectedId ? `${iotPrefix}--list-spinner__list-item--selected` : ''
        } `,
        ref: child.props.id === selectedId ? contentRef : listItemsRef,
      });
    });
    const dupeItems = listItems.map((child) => {
      return React.cloneElement(child, {
        'data-testid': `${testId}-list-item`,
        key: `${child.props.id}-dupe-1`,
        id: child.props.id,
        onClick: handleClick,
        className: `${iotPrefix}--list-spinner__list-item ${
          child.props.className ? `${child.props.className}-spinner__list-item` : ''
        } ${
          `${child.props.id}-dupe-1` === selectedId
            ? `${iotPrefix}--list-spinner__list-item--selected`
            : ''
        }`,
        ref: `${child.props.id}-dupe-1` === selectedId ? contentRef : listItemsRef,
      });
    });

    const dupeItems2 = listItems.map((child) => {
      return React.cloneElement(child, {
        'data-testid': `${testId}-list-item`,
        key: `${child.props.id}-dupe-2`,
        id: child.props.id,
        onClick: handleClick,
        className: `${iotPrefix}--list-spinner__list-item ${
          child.props.className ? `${child.props.className}-spinner__list-item` : ''
        } ${
          `${child.props.id}-dupe-2` === selectedId
            ? `${iotPrefix}--list-spinner__list-item--selected`
            : ''
        } `,
        ref: `${child.props.id}-dupe-2` === selectedId ? contentRef : listItemsRef,
      });
    });

    return [...dupeItems, ...items, ...dupeItems2];
  }, [handleClick, listItems, listItemsRef, selectedId, testId]);

  return (
    <div
      data-testid={testId}
      className={classNames(`${iotPrefix}--list-spinner__section`, {
        [`${className}-spinner__section`]: className,
      })}
    >
      <Button
        testId={`${testId}-prev-btn`}
        id={`${iotPrefix}--list-spinner__btn--up`}
        onClick={handleClick}
        className={`${iotPrefix}--list-spinner__btn ${className}-spinner__btn`}
        renderIcon={ChevronUp16}
        kind="ghost"
      />
      <div
        className={`${iotPrefix}--list-spinner__list-container ${className}-spinner__list-container`}
      >
        <ContainerElement
          id="list-spinner__list"
          data-testid={`${testId}-list`}
          ref={listRef}
          className={`${iotPrefix}--list-spinner__list ${className}-spinner__list no-scroll`}
          onWheel={handleScroll}
          onTouchMove={handleScroll}
        >
          {updatedList}
        </ContainerElement>
      </div>
      <Button
        testId={`${testId}-next-btn`}
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
