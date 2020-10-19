import React from 'react';
import PropTypes from 'prop-types';

import { SimpleList } from '../../../index';
import { DASHBOARD_EDITOR_CARD_TYPES } from '../../../constants/LayoutConstants';

import timeSeriesImg from './line-graph.svg';
import simpleBarImg from './simple-bar-graph.svg';
import groupedBarImg from './bar-grouped-graph.svg';
import stackedBarImg from './bar-stack-graph.svg';
import valueImg from './value-kpi.svg';
import imageImg from './image.svg';
import tableImg from './data-table.svg';
import alertTableImg from './alert-table.svg';
import listImg from './list.svg';

const propTypes = {
  supportedCardTypes: PropTypes.arrayOf(PropTypes.string),
  onAddCard: PropTypes.func.isRequired,
  i18n: PropTypes.shape({
    galleryHeader: PropTypes.string,
    searchPlaceHolderText: PropTypes.string,
    cardType_TIMESERIES: PropTypes.string,
    cardType_SIMPLE_BAR: PropTypes.string,
    cardType_GROUPED_BAR: PropTypes.string,
    cardType_STACKED_BAR: PropTypes.string,
    cardType_VALUE: PropTypes.string,
    cardType_IMAGE: PropTypes.string,
    cardType_TABLE: PropTypes.string,
    cardType_ALERT: PropTypes.string,
    cardType_LIST: PropTypes.string,
    cardType_OTHER: PropTypes.string,
  }),
};

const defaultProps = {
  supportedCardTypes: Object.keys(DASHBOARD_EDITOR_CARD_TYPES),
  i18n: {
    galleryHeader: 'Gallery',
    searchPlaceHolderText: 'Enter a search',
    cardType_TIMESERIES: 'Time series line',
    cardType_SIMPLE_BAR: 'Simple bar',
    cardType_GROUPED_BAR: 'Grouped bar',
    cardType_STACKED_BAR: 'Stacked bar',
    cardType_VALUE: 'Value / KPI',
    cardType_IMAGE: 'Image',
    cardType_TABLE: 'Data table',
    cardType_ALERT: 'Alert table',
    cardType_LIST: 'List',
    cardType_OTHER: 'Other',
    // additional card type names can be provided using the convention of `cardType_TYPE`
  },
};

const iconTypeMap = {
  TIMESERIES: <img src={timeSeriesImg} alt="Time series" />,
  SIMPLE_BAR: <img src={simpleBarImg} alt="Simple bar" />,
  GROUPED_BAR: <img src={groupedBarImg} alt="Grouped bar" />,
  STACKED_BAR: <img src={stackedBarImg} alt="Stacked bar" />,
  VALUE: <img src={valueImg} alt="Value / KPI" />,
  // eslint-disable-next-line jsx-a11y/img-redundant-alt
  IMAGE: <img src={imageImg} alt="Image card" />,
  TABLE: <img src={tableImg} alt="Table" />,
  ALERT: <img src={alertTableImg} alt="Alert table" />,
  LIST: <img src={listImg} alt="List" />,
};

const CardGalleryList = ({ supportedCardTypes, onAddCard, i18n }) => {
  const mergedI18n = { ...defaultProps.i18n, ...i18n };
  return (
    <SimpleList
      title={mergedI18n.galleryHeader}
      isFullHeight
      hasSearch
      hasPagination={false}
      items={supportedCardTypes.map((cardType) => ({
        id: cardType,
        content: {
          value: mergedI18n[`cardType_${cardType}`] || cardType,
          icon: iconTypeMap[cardType],
        },
        isSelectable: true,
      }))}
      onSelect={(cardType) => {
        onAddCard(cardType);
      }}
      i18n={{
        searchPlaceHolderText: i18n.searchPlaceHolderText,
      }}
    />
  );
};

CardGalleryList.defaultProps = defaultProps;
CardGalleryList.propTypes = propTypes;

export default CardGalleryList;
