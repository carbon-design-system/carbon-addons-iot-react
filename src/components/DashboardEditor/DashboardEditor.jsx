import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { settings } from '../../constants/Settings';
import { CARD_TYPES } from '../../constants/LayoutConstants';
import { DashboardGrid, CardEditor } from '../../index';

import DashboardEditorHeader from './DashboardEditorHeader/DashboardEditorHeader';
import { getDefaultCard, getCardPreview } from './editorUtils';

const { iotPrefix } = settings;

export const defaultI18N = {
  headerEditTitleButton: 'Edit title',
  headerImportButton: 'Import',
  headerExportButton: 'Export',
  headerCancelButton: 'Cancel',
  headerSubmitButton: 'Save and close',
  galleryHeader: 'Gallery',
  openGalleryButton: 'Open gallery',
  closeGalleryButton: 'Back',
  openJSONButton: 'Open JSON editor',
};

const defaultProps = {
  initialValue: {
    cards: [],
    layouts: {},
  },
  supportedCardTypes: [CARD_TYPES.BAR, CARD_TYPES.TIMESERIES, CARD_TYPES.VALUE, CARD_TYPES.TABLE],
  renderHeader: null,
  renderCardPreview: () => null,
  headerBreadcrumbs: null,
  onEditTitle: null,
  onImport: null,
  onExport: null,
  i18n: defaultI18N,
};

const propTypes = {
  /** Dashboard title */
  title: PropTypes.string.isRequired,
  /** initial dashboard data to edit */
  initialValue: PropTypes.shape({
    cards: PropTypes.array,
    layouts: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  }),
  /** supported card types */
  supportedCardTypes: PropTypes.arrayOf(PropTypes.string),
  /** if provided, renders header content above preview */
  renderHeader: PropTypes.func,
  /** if provided, is used to render cards in dashboard */
  renderCardPreview: PropTypes.func,
  /** if provided, renders array elements inside of BreadcrumbItem in header */
  headerBreadcrumbs: PropTypes.arrayOf(PropTypes.element),
  /** if provided, renders edit button next to title linked to this callback */
  onEditTitle: PropTypes.func,
  /** if provided, renders import button linked to this callback */
  onImport: PropTypes.func,
  /** if provided, renders export button linked to this callback */
  onExport: PropTypes.func,
  /** Callback when cancel button is clicked */
  onCancel: PropTypes.func.isRequired,
  /** Callback when submit button is clicked */
  onSubmit: PropTypes.func.isRequired,
  /** internationalization strings */
  i18n: PropTypes.shape({
    headerImportButton: PropTypes.string,
    headerExportButton: PropTypes.string,
    headerCancelButton: PropTypes.string,
    headerSubmitButton: PropTypes.string,
  }),
};

const DashboardEditor = ({
  title,
  initialValue,
  supportedCardTypes = ['ALERT', 'VALUE', 'BAR', 'TIMESERIES'],
  renderHeader,
  renderCardPreview,
  headerBreadcrumbs,
  // onAddImage,
  onEditTitle,
  onCancel,
  onSubmit,
  onImport,
  onExport,
  i18n,
}) => {
  const mergedI18N = { ...defaultProps.i18n, ...i18n };
  const baseClassName = `${iotPrefix}--dashboard-editor`;

  // show the gallery if no card is being edited
  const [dashboardData, setDashboardData] = useState(initialValue);
  const [selectedCardId, setSelectedCardId] = useState();

  const addCard = type => {
    const cardData = getDefaultCard(type);
    setDashboardData({
      ...dashboardData,
      cards: [...dashboardData.cards, cardData],
    });
    setSelectedCardId(cardData.id);
  };

  const removeCard = id =>
    setDashboardData({
      ...dashboardData,
      cards: dashboardData.cards.filter(i => i.id !== id),
    });

  return (
    <div className={baseClassName}>
      <div className={`${baseClassName}--content`}>
        {renderHeader ? (
          renderHeader()
        ) : (
          <DashboardEditorHeader
            title={title}
            breadcrumbs={headerBreadcrumbs}
            onEditTitle={onEditTitle}
            onImport={onImport}
            onExport={() => onExport(dashboardData)}
            onCancel={onCancel}
            onSubmit={() => onSubmit(dashboardData)}
            i18n={mergedI18N}
          />
        )}
        <div className={`${baseClassName}--preview`}>
          <DashboardGrid
            isEditable
            onBreakpointChange={() => {}}
            onLayoutChange={(newLayout, newLayouts) =>
              setDashboardData({
                ...dashboardData,
                layouts: newLayouts,
              })
            }
          >
            {dashboardData.cards.map(cardData => {
              const isSelected = selectedCardId === cardData.id;
              const onSelectCard = id => setSelectedCardId(id);
              const onRemoveCard = id => removeCard(id);

              // if function not defined, or it returns falsy, render default preview
              return (
                renderCardPreview(cardData, isSelected, onSelectCard, onRemoveCard) ??
                getCardPreview(cardData, isSelected, onSelectCard, onRemoveCard)
              );
            })}
          </DashboardGrid>
        </div>
      </div>
      <div className={`${baseClassName}--sidebar`}>
        <CardEditor
          value={dashboardData.cards.find(i => i.id === selectedCardId)}
          onShowGallery={() => setSelectedCardId(null)}
          onChange={cardData =>
            setDashboardData({
              ...dashboardData,
              cards: dashboardData.cards.map(i => (i.id === cardData.id ? cardData : i)),
            })
          }
          onAddCard={addCard}
          supportedTypes={supportedCardTypes}
          // onAddImage={onAddImage}
          i18n={mergedI18N}
        />
      </div>
    </div>
  );
};

DashboardEditor.propTypes = propTypes;
DashboardEditor.defaultProps = defaultProps;

export default DashboardEditor;
