/**
 * IBM Confidential
 * OCO Source Materials
 * 5900-A0N
 * © Copyright IBM Corp. 2018
 * The source code for this program is not published or otherwise divested of its
 * trade secrets, irrespective of what has been deposited with the U.S. Copyright
 * Office.
 */
import React from 'react';
import PropTypes from 'prop-types';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';

import { formatNumberWithPrecision } from '../../utils/cardUtilityFunctions';
import { findMatchingThresholds } from '../TableCard/TableCard';
import { settings } from '../../constants/Settings';

import CardIcon from './CardIcon';

const { iotPrefix } = settings;

export const ImageHotspotContentPropTypes = {
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
  /** ability to render icon by name */
  renderIconByName: PropTypes.func,
};

const defaultProps = {
  title: null,
  description: null,
  values: {},
  attributes: [],
  hotspotThreshold: null,
  renderIconByName: null,
  locale: 'en',
};

const ImageHotspotContent = ({
  title,
  description,
  attributes,
  values,
  hotspotThreshold,
  locale,
  renderIconByName,
}) => (
  <div className={`${iotPrefix}--hotspot-content`}>
    {typeof title === 'string' ? (
      <h4 title={title}>{title}</h4>
    ) : React.isValidElement(title) ? (
      title
    ) : null}
    {description && <p>{description}</p>}
    {attributes.map(({ thresholds, dataSourceId, label, unit, precision }) => {
      // look for attribute specific thresholds first
      let attributeThresholdMatch = null;
      if (!isEmpty(thresholds)) {
        const matchingAttributeThresholds = findMatchingThresholds(
          thresholds.map(threshold => ({ ...threshold, dataSourceId })),
          values,
          dataSourceId
        );
        if (matchingAttributeThresholds && !isEmpty(matchingAttributeThresholds)) {
          [attributeThresholdMatch] = matchingAttributeThresholds;
        }
      }
      const thresholdMatch =
        attributeThresholdMatch ||
        (hotspotThreshold && hotspotThreshold.dataSourceId === dataSourceId // then see if the parent threshold might match this attribute
          ? hotspotThreshold
          : null);
      const value = isNil(values[dataSourceId]) ? '--' : values[dataSourceId];
      const thresholdIcon =
        thresholdMatch && thresholdMatch.dataSourceId === dataSourceId && thresholdMatch.icon ? (
          <CardIcon
            icon={thresholdMatch.icon}
            color={thresholdMatch.color}
            title={`${thresholdMatch.dataSourceId} ${thresholdMatch.comparison} ${
              typeof thresholdMatch.value === 'number'
                ? formatNumberWithPrecision(thresholdMatch.value, null, locale)
                : thresholdMatch.value
            }`}
            width={16}
            height={16}
            renderIconByName={renderIconByName}
          />
        ) : null;
      return (
        <div key={`attribute-${dataSourceId}`} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: 1, paddingRight: 20 }}>
            <span style={{ fontWeight: 'bold' }}>{label}:</span>
          </div>
          <div
            style={{
              flex: 0,
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {thresholdIcon}
            <span
              style={{
                paddingLeft: thresholdIcon ? 5 : 0,
                color: !thresholdIcon && thresholdMatch ? thresholdMatch.color : 'inherit ',
              }}
            >
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
                <span>
                  &nbsp;
                  {unit}
                </span>
              )}
            </span>
          </div>
        </div>
      );
    })}
  </div>
);

ImageHotspotContent.propTypes = ImageHotspotContentPropTypes;
ImageHotspotContent.defaultProps = defaultProps;
export default ImageHotspotContent;
