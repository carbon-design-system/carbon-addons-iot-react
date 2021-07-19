import React, { Children, cloneElement, useEffect, useState, useMemo, createRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

const propTypes = {
  /** If isOpen is true, TearSheetWrapper opens with the first TearSheet active */
  isOpen: PropTypes.bool,
  /** Additional classNames to be provided for TearSheetWrapper */
  className: PropTypes.string,
  /** onCloseAllTearSheets optional function. When provided, it will run when the closeAllTearSheets function is called from a child component */
  onCloseAllTearSheets: PropTypes.func,
  children: PropTypes.node,
  testId: PropTypes.string,
};

const defaultProps = {
  isOpen: false,
  className: undefined,
  onCloseAllTearSheets: undefined,
  children: undefined,
  // TODO: set default in v3
  testId: '',
};

const baseClassName = `${iotPrefix}--tear-sheet-wrapper`;

const TearSheetWrapper = ({ isOpen, className, onCloseAllTearSheets, children, testId }) => {
  const [activeTearSheetIdx, setActiveTearSheetIdx] = useState(null);
  const childrenArray = useMemo(() => Children.toArray(children).slice(0, 2), [children]); // Limit of 2 TearSheets
  const [containers] = useState(childrenArray.map(() => createRef()));
  const [animationClasses, setAnimationClasses] = useState(() =>
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
              ? { ...acc, [i]: [`${baseClassName}__is-visible`] }
              : i === `container${activeTearSheetIdx}`
              ? { ...acc, [i]: [] }
              : { ...acc, [i]: [`${baseClassName}--container__is-hidden`] },

          {}
        ),
      };
    });
  }, [activeTearSheetIdx]);

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
      className={classnames(baseClassName, className, {
        ...animationClasses?.overlay?.reduce((acc, curr) => ({ ...acc, [curr]: isOpen }), {}),
      })}
      // TODO: use only testId in v3.
      data-testid={testId || `${iotPrefix}--tear-sheet-wrapper`}
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
            // TODO: use only testId in v3.
            data-testid={testId ? `${testId}-container-${idx}` : `container-${idx}`}
            className={classnames(`${baseClassName}--container`, {
              ...animationClasses?.[`container${idx}`]?.reduce(
                (acc, curr) => ({ ...acc, [curr]: true }),
                {}
              ),
            })}
            ref={containers[idx]}
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
