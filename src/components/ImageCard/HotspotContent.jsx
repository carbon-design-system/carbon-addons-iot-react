/**
 * IBM Confidential
 * OCO Source Materials
 * 5900-A0N
 * © Copyright IBM Corp. 2018
 * The source code for this program is not published or otherwise divested of its
 * trade secrets, irrespective of what has been deposited with the U.S. Copyright
 * Office.
 */
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import Edit from '@carbon/icons-react/lib/edit/20';

import {
  formatNumberWithPrecision,
  findMatchingThresholds,
} from '../../utils/cardUtilityFunctions';
import { settings } from '../../constants/Settings';
import { TextInput } from '../TextInput';

import CardIcon from './CardIcon';

const { iotPrefix } = settings;

export const HotspotContentPropTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  description: PropTypes.string,
  values: PropTypes.objectOf(PropTypes.any),
  attributes: PropTypes.arrayOf(
    PropTypes.shape({
      dataSourceId: PropTypes.string,
      label: PropTypes.string,
      unit: PropTypes.string,
      precision: PropTypes.number,
      thresholds: PropTypes.arrayOf(
        PropTypes.shape({
          comparison: PropTypes.oneOf(['<', '>', '=', '<=', '>=']),
          value: PropTypes.any,
          icon: PropTypes.string,
          color: PropTypes.string,
        })
      ),
    })
  ),
  /** overall threshold that launched the hotspot */
  hotspotThreshold: PropTypes.shape({
    dataSourceId: PropTypes.string,
    comparison: PropTypes.oneOf(['<', '>', '=', '<=', '>=']),
    value: PropTypes.any,
    icon: PropTypes.string,
    color: PropTypes.string,
  }),
  /** the locale to use for formatting numeric values */
  locale: PropTypes.string,
  /** The placeholder text for editable title */
  titlePlaceholderText: PropTypes.string,
  /** The html title attribute text for the title label when editable */
  titleEditableHintText: PropTypes.string,
  /** ability to render icon by name */
  renderIconByName: PropTypes.func,
  /** when true the title can be edited by the user. */
  isTitleEditable: PropTypes.bool,
  /** the unique id of this component, used by input elements */
  id: PropTypes.string,
  /** For text hotspots, callback with current value for when the editable fields are blurred. */
  onChange: PropTypes.func,
};

const defaultProps = {
  title: null,
  titlePlaceholderText: 'Enter label',
  titleEditableHintText: 'Click to edit label',
  description: null,
  values: {},
  attributes: [],
  hotspotThreshold: null,
  renderIconByName: null,
  locale: 'en',
  isTitleEditable: false,
  id: 'hotspot-content',
  onChange: () => {},
};

const HotspotContent = ({
  title,
  titlePlaceholderText,
  titleEditableHintText,
  description,
  attributes,
  values,
  hotspotThreshold,
  locale,
  renderIconByName,
  isTitleEditable,
  id,
  onChange,
}) => {
  const [showTitleInput, setShowTitleInput] = useState(
    isTitleEditable && !title
  );
  const titleInputFocusRef = useRef(null);
  const [titleValue, setTitleValue] = useState(title);

  if (showTitleInput && titleInputFocusRef.current) {
    titleInputFocusRef.current.focus();
  }

  const renderTitle = () => {
    const titleTextVersion = (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
      <h4
        onClick={() => {
          if (isTitleEditable) {
            setShowTitleInput(isTitleEditable);
          }
        }}
        title={isTitleEditable ? titleEditableHintText : titleValue}>
        {titleValue !== null && titleValue !== '' ? (
          titleValue
        ) : isTitleEditable ? (
          <Edit />
        ) : null}
      </h4>
    );

    const titleInputVersion = (
      <>
        <div
          className={`${iotPrefix}--hotspot-content-title-wrapper--editable`}>
          <TextInput
            className={`${iotPrefix}--hotspot-content-title-input`}
            defaultValue={title}
            id={`${id}-title`}
            data-testid={`${id}-title-test`}
            ref={titleInputFocusRef}
            onChange={(evt) => {
              setTitleValue(evt.currentTarget.value);
            }}
            onBlur={(evt) => {
              const latestValue = evt.currentTarget.value;
              setShowTitleInput(false);
              if (title !== latestValue) {
                onChange({ title: latestValue });
              }
            }}
            labelText=""
            placeholder={titlePlaceholderText}
          />
        </div>
        {
          // We still render the non editable title but as visually hidden so that the width will be
          // correctly modified as we type in the TextInput.
          <h4
            className={`${iotPrefix}--hotspot-content-title__visually-hidden`}>
            {titleValue}
          </h4>
        }
      </>
    );

    return typeof title === 'string' && showTitleInput
      ? titleInputVersion
      : typeof title === 'string'
      ? titleTextVersion
      : React.isValidElement(title)
      ? title
      : null;
  };

  return (
    <div className={`${iotPrefix}--hotspot-content`}>
      {renderTitle()}
      {description && (
        <p className={`${iotPrefix}--hotspot-content-description`}>
          {description}
        </p>
      )}
      {attributes.map(
        ({ thresholds, dataSourceId, label, unit, precision }) => {
          // look for attribute specific thresholds first
          let attributeThresholdMatch = null;
          if (!isEmpty(thresholds)) {
            const matchingAttributeThresholds = findMatchingThresholds(
              thresholds.map((threshold) => ({ ...threshold, dataSourceId })),
              values,
              dataSourceId
            );
            if (
              matchingAttributeThresholds &&
              !isEmpty(matchingAttributeThresholds)
            ) {
              [attributeThresholdMatch] = matchingAttributeThresholds;
            }
          }
          const thresholdMatch =
            attributeThresholdMatch ||
            (hotspotThreshold && hotspotThreshold.dataSourceId === dataSourceId // then see if the parent threshold might match this attribute
              ? hotspotThreshold
              : null);
          const value = isNil(values[dataSourceId])
            ? '--'
            : values[dataSourceId];
          const thresholdIcon =
            thresholdMatch &&
            thresholdMatch.dataSourceId === dataSourceId &&
            thresholdMatch.icon ? (
              <CardIcon
                icon={thresholdMatch.icon}
                color={thresholdMatch.color}
                title={`${thresholdMatch.dataSourceId} ${
                  thresholdMatch.comparison
                } ${
                  typeof thresholdMatch.value === 'number'
                    ? formatNumberWithPrecision(
                        thresholdMatch.value,
                        null,
                        locale
                      )
                    : thresholdMatch.value
                }`}
                width={16}
                height={16}
                renderIconByName={renderIconByName}
              />
            ) : null;
          return (
            <div
              key={`attribute-${dataSourceId}`}
              className={`${iotPrefix}--hotspot-content-attribute`}>
              <div className={`${iotPrefix}--hotspot-content-label-section`}>
                <span className={`${iotPrefix}--hotspot-content-label`}>
                  {label}:
                </span>
              </div>
              <div
                className={`${iotPrefix}--hotspot-content-threshold-section`}>
                {thresholdIcon}
                <span
                  style={{
                    '--threshold-color':
                      !thresholdIcon && thresholdMatch
                        ? thresholdMatch.color
                        : 'inherit ',
                    '--threshold-padding': thresholdIcon ? '0.25rem' : '0rem',
                  }}
                  className={`${iotPrefix}--hotspot-content-threshold`}>
                  {typeof value === 'number'
                    ? formatNumberWithPrecision(
                        value,
                        !isNil(precision)
                          ? precision
                          : Math.abs(value) < 1
                          ? value === 0
                            ? 0
                            : 3 // for small decimals give 3 spots
                          : 1, // otherwise 1 spot if precision isn't set
                        locale
                      )
                    : value}
                  {unit && value !== '--' && (
                    <span className={`${iotPrefix}--hotspot-content-unit`}>
                      {unit}
                    </span>
                  )}
                </span>
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};

HotspotContent.propTypes = HotspotContentPropTypes;
HotspotContent.defaultProps = defaultProps;
export default HotspotContent;
