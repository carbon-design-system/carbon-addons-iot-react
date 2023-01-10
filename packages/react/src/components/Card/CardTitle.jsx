import React, { useCallback, useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Tooltip } from 'carbon-components-react';
import throttle from 'lodash-es/throttle';

import useHasTextOverflow from '../../hooks/useHasTextOverflow';
import { usePopoverPositioning } from '../../hooks/usePopoverPositioning';
import { getTooltipMenuOffset } from '../Tooltip';
import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

const SCROLL_THROTTLE_TIMEOUT = 10;
const SCROLL_THROTTLE_OPTIONS = {
  leading: false,
  trailing: false,
};
const isEngagingEventType = (type) => type === 'click' || type === 'keydown';

const propTypes = {
  id: PropTypes.string.isRequired,
  /** Adds an info icon after the title that when clicked shows a tooltip with this content.
   * Cannot be used together with the tooltipDefinition prop
   */
  infoIconTooltip: PropTypes.element,
  // Allows the title to wrap over two rows
  hasTitleWrap: PropTypes.bool.isRequired,
  subtitle: PropTypes.string,
  testId: PropTypes.string.isRequired,
  title: PropTypes.string,
  /** Adds tooltip to the title (no info icon) that when clicked shows a tooltip with this content.
   * Cannot be used together with the tooltip prop or the or the hasTitleWrap prop.
   */
  titleTextTooltip: PropTypes.element,
  titleTooltipIconDescription: PropTypes.string.isRequired,
};

const defaultProps = {
  infoIconTooltip: undefined,
  subtitle: undefined,
  title: undefined,
  titleTextTooltip: undefined,
};

export const CardTitle = (
  {
    id,
    hasTitleWrap,
    infoIconTooltip,
    subtitle,
    testId,
    title,
    titleTextTooltip,
    titleTooltipIconDescription,
  } // eslint-disable-line react/prop-types
) => {
  const titleRef = useRef();
  const subTitleRef = useRef();
  const truncatesTitle = useHasTextOverflow(titleRef, title);
  const hasExternalTitleTextTooltip = titleTextTooltip;
  const hasTitleTooltipFromTruncation = truncatesTitle && !titleTextTooltip;
  const hasInfoIconTooltip = infoIconTooltip && !hasExternalTitleTextTooltip;
  const hasSubTitleTooltip = useHasTextOverflow(subTitleRef, subtitle);

  const [calculateMenuOffset, { adjustedDirection, adjustedAlignment }] = usePopoverPositioning({
    direction: 'bottom',
    defaultAlignment: 'center',
    menuOffset: getTooltipMenuOffset,
    useAutoPositioning: true,
    isOverflowMenu: true, // Needed to preserve default direction (bottom)
  });

  const [tooltipsState, setTooltipsState] = useState({
    title: false,
    subtitle: false,
    info: false,
  });

  const handleTitleTooltipState = useCallback((evt, { open }) => {
    /* istanbul ignore else */
    if (isEngagingEventType(evt.type)) {
      setTooltipsState((prevState) => ({
        ...prevState,
        title: open,
      }));
    }
  }, []);

  const handleSubtitleTooltipState = useCallback((evt, { open }) => {
    /* istanbul ignore else */
    if (isEngagingEventType(evt.type)) {
      setTooltipsState((prevState) => ({
        ...prevState,
        subtitle: open,
      }));
    }
  }, []);

  const handleInfoTooltipState = useCallback((evt, { open }) => {
    /* istanbul ignore else */
    if (isEngagingEventType(evt.type)) {
      setTooltipsState((prevState) => ({
        ...prevState,
        info: open,
      }));
    }
  }, []);

  const handleTitleScroll = useCallback(
    throttle(
      () => {
        setTooltipsState((prevState) => ({
          ...prevState,
          title: false,
        }));
      },
      SCROLL_THROTTLE_TIMEOUT,
      SCROLL_THROTTLE_OPTIONS
    ),
    []
  );

  const handleSubtitleScroll = useCallback(
    throttle(
      () => {
        setTooltipsState((prevState) => ({
          ...prevState,
          subtitle: false,
        }));
      },
      SCROLL_THROTTLE_TIMEOUT,
      SCROLL_THROTTLE_OPTIONS
    ),
    []
  );

  const handleInfoScroll = useCallback(
    throttle(
      () => {
        setTooltipsState((prevState) => ({
          ...prevState,
          info: false,
        }));
      },
      SCROLL_THROTTLE_TIMEOUT,
      SCROLL_THROTTLE_OPTIONS
    ),
    []
  );

  // ignore due to window event listeners
  /* istanbul ignore next */
  useEffect(() => {
    if (tooltipsState.title) {
      window.addEventListener('scroll', handleTitleScroll);
    } else {
      window.removeEventListener('scroll', handleTitleScroll);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tooltipsState.title]);

  /* istanbul ignore next */
  useEffect(() => {
    if (tooltipsState.subtitle) {
      window.addEventListener('scroll', handleSubtitleScroll);
    } else {
      window.removeEventListener('scroll', handleSubtitleScroll);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tooltipsState.subtitle]);

  /* istanbul ignore next */
  useEffect(() => {
    if (tooltipsState.info) {
      window.addEventListener('scroll', handleInfoScroll);
    } else {
      window.removeEventListener('scroll', handleInfoScroll);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tooltipsState.info]);

  const renderMainTitle = () =>
    hasTitleTooltipFromTruncation || hasExternalTitleTextTooltip ? (
      <Tooltip
        align={adjustedAlignment}
        menuOffset={calculateMenuOffset}
        direction={adjustedDirection}
        data-testid={`${testId}-title-tooltip`}
        ref={titleRef}
        showIcon={false}
        triggerClassName={classnames(
          `${iotPrefix}--card--title--text__overflow`,
          `${iotPrefix}--card--title--text`,
          `${iotPrefix}--card-heading-clickable`,
          {
            [`${iotPrefix}--card--title--text--wrapped`]:
              hasTitleWrap && !subtitle && !hasExternalTitleTextTooltip,
            [`${iotPrefix}--card-title__title-text--has-title-text-tooltip`]: hasExternalTitleTextTooltip,
          }
        )}
        triggerText={title}
        open={tooltipsState.title}
        onChange={handleTitleTooltipState}
      >
        {hasExternalTitleTextTooltip ? (
          <>
            {truncatesTitle && (
              <p
                data-testid={`${testId}-title-tooltip-full-title`}
                className={`${iotPrefix}--card-title__title-text-tooltip-full-title`}
              >
                {title}
              </p>
            )}
            <div
              data-testid={`${testId}-title-tooltip-conten-node`}
              className={`${iotPrefix}--card-title__title-text-tooltip-content`}
            >
              {titleTextTooltip}
            </div>
          </>
        ) : (
          title
        )}
      </Tooltip>
    ) : (
      <div
        ref={titleRef}
        data-testid={`${testId}-title-notip`}
        className={classnames(`${iotPrefix}--card--title--text`, {
          [`${iotPrefix}--card--title--text--wrapped`]: hasTitleWrap && !subtitle,
        })}
      >
        {title}
      </div>
    );

  const renderSubTitle = () =>
    !subtitle ? null : hasSubTitleTooltip ? (
      <Tooltip
        align={adjustedAlignment}
        menuOffset={calculateMenuOffset}
        direction={adjustedDirection}
        data-testid={`${testId}-subtitle`}
        ref={subTitleRef}
        showIcon={false}
        triggerClassName={classnames(
          `${iotPrefix}--card--subtitle--text`,
          `${iotPrefix}--card-heading-clickable`,
          {
            [`${iotPrefix}--card--subtitle--text--padded`]: hasInfoIconTooltip,
          }
        )}
        triggerText={subtitle}
        open={tooltipsState.subtitle}
        onChange={handleSubtitleTooltipState}
      >
        {subtitle}
      </Tooltip>
    ) : (
      <div
        ref={subTitleRef}
        data-testid={`${testId}-subtitle`}
        className={classnames(`${iotPrefix}--card--subtitle--text`, {
          [`${iotPrefix}--card--subtitle--text--padded`]: hasInfoIconTooltip,
        })}
      >
        {subtitle}
      </div>
    );

  return (
    <span
      data-testid={`${testId}-title`}
      className={`${iotPrefix}--card--title`}
      title={hasExternalTitleTextTooltip ? '' : title}
    >
      {renderMainTitle()}
      {hasInfoIconTooltip && (
        <Tooltip
          data-testid={`${testId}-tooltip`}
          triggerId={`card-tooltip-trigger-${id}`}
          tooltipId={`card-tooltip-${id}`}
          triggerClassName={`${iotPrefix}--card--header--tooltip`}
          id={`card-tooltip-${id}`} // https://github.com/carbon-design-system/carbon/pull/6744
          triggerText=""
          iconDescription={titleTooltipIconDescription}
          open={tooltipsState.info}
          onChange={handleInfoTooltipState}
        >
          {infoIconTooltip}
        </Tooltip>
      )}
      {renderSubTitle()}
    </span>
  );
};

CardTitle.propTypes = propTypes;
CardTitle.defaultProps = defaultProps;
