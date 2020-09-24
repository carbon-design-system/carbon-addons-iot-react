import React from 'react';
import PropTypes from 'prop-types';
import {
  Add16,
  ChartColumn16,
  ChartLine16,
  Table16,
  SummaryKpi16,
  Image16,
} from '@carbon/icons-react';

import { List, Button } from '../../../index';

const propTypes = {
  supportedTypes: PropTypes.arrayOf(PropTypes.string),
  onAddCard: PropTypes.func.isRequired,
  i18n: PropTypes.shape({
    closeGalleryButton: PropTypes.string,
  }),
};

const defaultProps = {
  supportedTypes: ['BAR', 'TIMESERIES', 'VALUE', 'IMAGE', 'TABLE'],
  i18n: {
    galleryHeader: 'Gallery',
    cardType_TIMESERIES: 'Time series line',
    cardType_BAR: 'Simple bar',
    cardType_VALUE: 'Value/KPI',
    cardType_IMAGE: 'Image',
    cardType_TABLE: 'Data table',
    // additional card type names can be provided using the convention of `cardType_TYPE`
  },
};

const iconTypeMap = {
  TIMESERIES: <ChartLine16 />,
  BAR: <ChartColumn16 />,
  VALUE: <SummaryKpi16 />,
  IMAGE: <Image16 />,
  TABLE: <Table16 />,
};

const CardGalleryList = ({ supportedTypes, onAddCard, i18n }) => {
  const mergedI18N = { ...i18n, ...defaultProps.i18n };
  return (
    <List
      title={mergedI18N.galleryHeader}
      isFullHeight
      items={supportedTypes.map(i => ({
        id: i,
        content: {
          value: mergedI18N[`cardType_${i}`] || i,
          icon: iconTypeMap[i],
          rowActions: [
            <Button
              key={`add-${i}`}
              data-testid={`card-gallery-list-${i}-add`}
              kind="ghost"
              size="small"
              iconDescription="Add"
              hasIconOnly
              renderIcon={Add16}
              onClick={() => onAddCard(i)}
            />,
          ],
        },
      }))}
    />
  );
};

CardGalleryList.defaultProps = defaultProps;
CardGalleryList.propTypes = propTypes;

export default CardGalleryList;
