import React from 'react';
import PropTypes from 'prop-types';

import { SimpleList } from '../../../index';

import timeSeriesImg from './line-graph.svg';
import simpleBarImg from './simple-bar-graph.svg';
import valueImg from './value-kpi.svg';
import imageImg from './image.svg';
import tableImg from './data-table.svg';

const propTypes = {
  supportedTypes: PropTypes.arrayOf(PropTypes.string),
  onAddCard: PropTypes.func.isRequired,
  i18n: PropTypes.shape({
    galleryHeader: PropTypes.string,
    searchPlaceHolderText: PropTypes.string,
    pageOfPagesText: PropTypes.func,
    cardType_TIMESERIES: PropTypes.string,
    cardType_BAR: PropTypes.string,
    cardType_VALUE: PropTypes.string,
    cardType_IMAGE: PropTypes.string,
    cardType_TABLE: PropTypes.string,
    cardType_OTHER: PropTypes.string,
  }),
};

const defaultProps = {
  supportedTypes: ['BAR', 'TIMESERIES', 'VALUE', 'IMAGE', 'TABLE'],
  i18n: {
    galleryHeader: 'Gallery',
    searchPlaceHolderText: 'Enter a search',
    pageOfPagesText: page => `Page ${page}`,
    cardType_TIMESERIES: 'Time series line',
    cardType_BAR: 'Simple bar',
    cardType_VALUE: 'Value / KPI',
    cardType_IMAGE: 'Image',
    cardType_TABLE: 'Data table',
    cardType_OTHER: 'Other',
    // additional card type names can be provided using the convention of `cardType_TYPE`
  },
};

const iconTypeMap = {
  TIMESERIES: <img src={timeSeriesImg} alt="Time series" />,
  BAR: <img src={simpleBarImg} alt="Simple bar" />,
  VALUE: <img src={valueImg} alt="Value / KPI" />,
  // eslint-disable-next-line jsx-a11y/img-redundant-alt
  IMAGE: <img src={imageImg} alt="Image card" />,
  TABLE: <img src={tableImg} alt="Table" />,
};

const CardGalleryList = ({ supportedTypes, onAddCard, i18n }) => {
  const mergedI18n = { ...i18n, ...defaultProps.i18n };
  return (
    <SimpleList
      title={mergedI18n.galleryHeader}
      isFullHeight
      hasSearch
      showPagination={false}
      items={supportedTypes.map(cardType => ({
        id: cardType,
        content: {
          value: mergedI18n[`cardType_${cardType}`] || cardType,
          icon: iconTypeMap[cardType],
        },
        isSelectable: true,
      }))}
      onSelect={cardType => {
        onAddCard(cardType);
      }}
      i18n={{
        searchPlaceHolderText: i18n.searchPlaceHolderText,
        pageOfPagesText: i18n.pageOfPagesText,
      }}
    />
  );
};

CardGalleryList.defaultProps = defaultProps;
CardGalleryList.propTypes = propTypes;

export default CardGalleryList;
