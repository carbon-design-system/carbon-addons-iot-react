import React from 'react';
import PropTypes from 'prop-types';
import { Add16 } from '@carbon/icons-react';

import { List, Button } from '../../../index';

const propTypes = {
  supportedTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  onAddCard: PropTypes.func.isRequired,
  i18n: PropTypes.shape({
    closeGalleryButton: PropTypes.string,
  }),
};

const defaultProps = {
  i18n: {
    galleryHeader: 'Gallery',
  },
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
          value: i,
          rowActions: [
            <Button
              key={`add-${i}`}
              data-testid={`card-gallery-list-${i}-add`}
              kind="ghost"
              size="small"
              hasIconOnly
              iconDescription={`Add ${i}`}
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
