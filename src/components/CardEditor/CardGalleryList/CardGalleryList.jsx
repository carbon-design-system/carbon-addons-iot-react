import React from 'react';
import PropTypes from 'prop-types';

import { SimpleList } from '../../../index';
import { DASHBOARD_EDITOR_CARD_TYPES } from '../../../constants/LayoutConstants';
import {
  LineGraphIcon,
  SimpleBarGraphIcon,
  BarGroupedGraphIcon,
  BarStackGraphIcon,
  ValueKpiIcon,
  ImageIcon,
  DataTableIcon,
  AlertTableIcon,
  ListIcon,
  CustomCardIcon,
} from '../../../icons/components';

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
    cardType_CUSTOM: PropTypes.string,
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
    cardType_CUSTOM: 'Custom',
    // additional card type names can be provided using the convention of `cardType_TYPE`
  },
};

const iconTypeMap = {
  TIMESERIES: <LineGraphIcon />,
  SIMPLE_BAR: <SimpleBarGraphIcon />,
  GROUPED_BAR: <BarGroupedGraphIcon />,
  STACKED_BAR: <BarStackGraphIcon />,
  VALUE: <ValueKpiIcon />,
  IMAGE: <ImageIcon />,
  TABLE: <DataTableIcon />,
  ALERT: <AlertTableIcon />,
  LIST: <ListIcon />,
  CUSTOM: <CustomCardIcon />,
};

const CardGalleryList = ({ supportedCardTypes, onAddCard, i18n }) => {
  const mergedI18n = { ...defaultProps.i18n, ...i18n };
  return (
    <SimpleList
      title=""
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
        searchPlaceHolderText: i18n.searchPlaceholderText,
      }}
    />
  );
};

CardGalleryList.defaultProps = defaultProps;
CardGalleryList.propTypes = propTypes;

export default CardGalleryList;
