import React, { Children, cloneElement, useEffect, useState, createRef } from 'react';
import PropTypes from 'prop-types';

import useWindowSize from '../../hooks/useWindowSize';

const propTypes = {
  /** If isOpen is true, TearSheetWrapper opens with the first TearSheet active */
  isOpen: PropTypes.bool,
  /** Additional classNames to be provided for TearSheetWrapper */
  className: PropTypes.string,
  /** onCloseAllTearSheets optional function. When provided, it will run when the closeAllTearSheets function is called from a child component */
  onCloseAllTearSheets: PropTypes.func,
  children: PropTypes.node,
};

const tearSheetConstants = {
  DISTANCE_FROM_TOP: 88,
  WIDTH_DECREASE: 24,
  BOTTOM_POSITION_WHEN_HIDDEN: 12,
  DISTANCE_FROM_EACH_SIDE: 64,
};

const defaultProps = {
  isOpen: false,
  className: undefined,
  onCloseAllTearSheets: undefined,
  children: undefined,
};

const TearSheetWrapper = ({ isOpen, className, onCloseAllTearSheets, children }) => {
  const windowSize = useWindowSize();
  const [activeTearSheetIdx, setActiveTearSheetIdx] = useState(null);
  const childrenArray = Children.toArray(children).slice(0, 2); // Limit of 2 TearSheets
  const [containers] = useState(childrenArray.map(() => createRef()));
  const [initialContainersWidth, setInitialContainersWidth] = useState(null);
  const [containersStyles, setContainersStyles] = useState({});
  const [animationClasses, setAnimationClasses] = useState(
    childrenArray.reduce(
      (acc, c, idx) => ({
        ...acc,
        [`container${idx}`]: [],
      }),
      { overlay: [] }
    )
  );

  useEffect(() => (isOpen ? setActiveTearSheetIdx(0) : setActiveTearSheetIdx(null)), [isOpen]);

  useEffect(() => {
    if (!initialContainersWidth) {
      setInitialContainersWidth(containers[0].current.offsetWidth);
    }
  }, [containers, initialContainersWidth]);

  useEffect(() => {
    const greaterHeaderTopPosition = Math.max(
      ...containers.map((c) => c.current.children[0]?.children[1]?.offsetTop ?? 0)
    );

    setAnimationClasses((prevState) => {
      if (activeTearSheetIdx === null) {
        return {
          ...prevState,
          overlay: [],
        };
      }
      return {
        ...Object.keys(prevState).reduce(
          (acc, i) =>
            i === 'overlay'
              ? { ...acc, [i]: ['is-visible'] }
              : i === `container${activeTearSheetIdx}`
              ? { ...acc, [i]: [] }
              : { ...acc, [i]: ['is-hidden'] },

          {}
        ),
      };
    });

    const isWindowWidthSmallerThanContainer = windowSize.width < initialContainersWidth;
    const containerMaxWidth = windowSize?.width - tearSheetConstants.DISTANCE_FROM_EACH_SIDE * 2;
    setContainersStyles(
      containers.reduce((acc, c, idx) => {
        const currentWidth = isWindowWidthSmallerThanContainer
          ? containerMaxWidth - (activeTearSheetIdx - idx) * tearSheetConstants.WIDTH_DECREASE
          : activeTearSheetIdx === null || activeTearSheetIdx <= idx
          ? initialContainersWidth
          : initialContainersWidth - (activeTearSheetIdx - idx) * tearSheetConstants.WIDTH_DECREASE;

        const currentBottom =
          activeTearSheetIdx !== null
            ? activeTearSheetIdx < idx
              ? 0 - windowSize.height
              : activeTearSheetIdx === idx
              ? 0
              : (activeTearSheetIdx - idx) * tearSheetConstants.BOTTOM_POSITION_WHEN_HIDDEN
            : 0 - windowSize.height;

        return {
          ...acc,
          [`container${idx}`]: {
            bottom: `${currentBottom}px`,
            width: `${currentWidth}px`,
            '--content-max-height': `${
              windowSize?.height - greaterHeaderTopPosition - tearSheetConstants.DISTANCE_FROM_TOP
            }px`,
            '--content-max-width': `${containerMaxWidth}px`,
          },
        };
      }, {})
    );
  }, [
    containers,
    activeTearSheetIdx,
    initialContainersWidth,
    windowSize.width,
    windowSize.height,
    windowSize,
  ]);

  const goToSheet = (idx) => setActiveTearSheetIdx(idx);

  const closeAllTearSheets = () => {
    if (onCloseAllTearSheets) {
      onCloseAllTearSheets();
      setActiveTearSheetIdx(null);
    } else {
      setActiveTearSheetIdx(null);
    }
  };

  return (
    <div
      className={[
        'iot-tear-sheet-wrapper',
        isOpen ? animationClasses?.overlay?.join(' ') : '',
        className || '',
      ].join(' ')}
      style={{ '--window-height': `${windowSize.height}px` }}
      data-testid="iot-tear-sheet-wrapper"
    >
      {childrenArray.map((tearSheet, idx, arr) => {
        const newTearSheet = cloneElement(tearSheet, {
          openNextSheet: () => idx < arr.length - 1 && goToSheet(idx + 1),
          goToPreviousSheet: () => goToSheet(idx > 0 ? idx - 1 : null),
          closeAllTearSheets,
          idx,
        });
        return (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
          <div
            id={`container-${idx}`}
            key={`container-${idx}`}
            data-testid={`container-${idx}`}
            className={[
              'iot-tear-sheet-wrapper--container',
              animationClasses[`container${idx}`].join(' '),
            ].join(' ')}
            ref={containers[idx]}
            style={containersStyles?.[`container${idx}`]}
            onClick={(e) => e.stopPropagation()}
          >
            {newTearSheet}
          </div>
        );
      })}
    </div>
  );
};

TearSheetWrapper.propTypes = propTypes;
TearSheetWrapper.defaultProps = defaultProps;

export default TearSheetWrapper;
