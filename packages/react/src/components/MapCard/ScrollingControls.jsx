import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'carbon-components-react';
import { ChevronUp32, ChevronDown32 } from '@carbon/icons-react';
import classnames from 'classnames';

import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;
const BASE_CLASS_NAME = `${iotPrefix}--map-scroll-controls`;

const propTypes = {
  classname: PropTypes.string,
  /** The full list of avilable controls */
  controls: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.oneOfType([
        PropTypes.shape({
          width: PropTypes.string,
          height: PropTypes.string,
          viewBox: PropTypes.string.isRequired,
          svgData: PropTypes.object.isRequired,
        }),
        PropTypes.object, // Could be a react icon name
        PropTypes.element,
      ]),
      iconDescription: PropTypes.string,
      onClick: PropTypes.func,
    })
  ).isRequired,
  tooltipPosition: PropTypes.string,
  testId: PropTypes.string,
  /** Number of visible items shown between the scroll buttons */
  visibleItemsCount: PropTypes.number,
};

const defaultProps = {
  visibleItemsCount: 6,
  tesId: 'map-scroll-controls',
  tooltipPosition: 'left',
  scrollUpText: 'Scroll up',
  scrollDownText: 'Scroll down',
};

const ScrollingControls = ({
  controls,
  visibleItemsCount,
  tooltipPosition,
  scrollUpText,
  scrollDownText,
}) => {
  const scrollContainerRef = useRef();
  const buttonHeightPx = 40;
  const scrollBy = (visibleItemsCount - 1 || 1) * buttonHeightPx;
  const [scrollDownDisabled, setScrollDownDisabled] = useState(false);
  const [scrollUpDisabled, setScrollUpDisabled] = useState(true);

  const handleScrolling = (distance) => {
    const container = scrollContainerRef.current;
    const scrollingDown = distance > 0;

    container.scrollBy({ left: 0, top: distance, behavior: 'smooth' });
    setScrollUpDisabled(Math.abs(container.scrollTop) + distance === 0);
    setScrollDownDisabled(
      scrollingDown &&
        container.scrollHeight - (Math.abs(container.scrollTop) + scrollBy) ===
          container.clientHeight
    );
  };

  return (
    <div className={classnames(`${BASE_CLASS_NAME}__container`)}>
      <Button
        className={classnames(`${BASE_CLASS_NAME}__btn`, `${BASE_CLASS_NAME}__scroll-btn`)}
        disabled={scrollUpDisabled}
        kind="ghost"
        size="field"
        hasIconOnly
        tooltipPosition={tooltipPosition}
        renderIcon={ChevronUp32}
        iconDescription={scrollUpText}
        onClick={() => handleScrolling(scrollBy * -1)}
      />
      {scrollUpDisabled ? null : <div className={`${BASE_CLASS_NAME}__gradient`}></div>}
      <div
        ref={scrollContainerRef}
        style={{
          [`--visble-items-count`]: visibleItemsCount,
          [`--scroll-area-height`]: `${visibleItemsCount * buttonHeightPx}px`,
        }}
        className={classnames(`${BASE_CLASS_NAME}__scroll-area`)}
      >
        {controls.map((control, i) => {
          return (
            <Button
              className={`${BASE_CLASS_NAME}__btn`}
              key={`${control.iconDescription}-${i}`}
              kind="ghost"
              size="field"
              hasIconOnly
              tooltipPosition={tooltipPosition}
              renderIcon={control.icon}
              iconDescription={control.iconDescription}
              onClick={control.onClick}
            />
          );
        })}
      </div>
      {scrollDownDisabled ? null : (
        <div
          className={classnames(
            `${BASE_CLASS_NAME}__gradient`,
            `${BASE_CLASS_NAME}__gradient--flipped`
          )}
        ></div>
      )}
      <Button
        className={classnames(`${BASE_CLASS_NAME}__btn`, `${BASE_CLASS_NAME}__scroll-btn`)}
        disabled={scrollDownDisabled}
        kind="ghost"
        size="field"
        hasIconOnly
        tooltipPosition={tooltipPosition}
        renderIcon={ChevronDown32}
        iconDescription={scrollDownText}
        onClick={() => handleScrolling(scrollBy)}
      />
    </div>
  );
};

ScrollingControls.defaultProps = defaultProps;
ScrollingControls.propTypes = propTypes;
export default ScrollingControls;
