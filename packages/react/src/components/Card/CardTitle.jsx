import React, { useRef } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Tooltip } from 'carbon-components-react';

import useHasTextOverflow from '../../hooks/useHasTextOverflow';
import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

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

  const renderMainTitle = () =>
    hasTitleTooltipFromTruncation || hasExternalTitleTextTooltip ? (
      <Tooltip
        autoOrientation
        data-testid={`${testId}-title-tooltip`}
        ref={titleRef}
        showIcon={false}
        triggerClassName={classnames(
          `${iotPrefix}--card--title--text__overflow`,
          `${iotPrefix}--card--title--text`,
          {
            [`${iotPrefix}--card--title--text--wrapped`]:
              hasTitleWrap && !subtitle && !hasExternalTitleTextTooltip,
            [`${iotPrefix}--card-title__title-text--has-title-text-tooltip`]: hasExternalTitleTextTooltip,
          }
        )}
        triggerText={title}
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
        data-testid={`${testId}-subtitle`}
        ref={subTitleRef}
        showIcon={false}
        triggerClassName={classnames(`${iotPrefix}--card--subtitle--text`, {
          [`${iotPrefix}--card--subtitle--text--padded`]: hasInfoIconTooltip,
        })}
        triggerText={subtitle}
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
