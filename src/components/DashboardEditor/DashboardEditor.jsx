import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { settings } from '../../constants/Settings';
import { CARD_TYPES } from '../../constants/LayoutConstants';
import { DashboardGrid, CardEditor } from '../../index';

import DashboardEditorHeader from './DashboardEditorHeader/DashboardEditorHeader';
import { getDefaultCard, getDuplicateCard, getCardPreview } from './editorUtils';

const { iotPrefix } = settings;

const propTypes = {
  /** Dashboard title */
  title: PropTypes.string,
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
  /** if provided, renders node underneath the header and above the dashboard grid */
  notification: PropTypes.node,
  /** if provided, renders edit button next to title linked to this callback */
  onEditTitle: PropTypes.func,
  /** if provided, renders import button linked to this callback
   * onImport(data, setNotification?)
   */
  onImport: PropTypes.func,
  /** if provided, renders export button linked to this callback
   * onExport(dashboardJson)
   */
  onExport: PropTypes.func,
  /** if provided, renders delete button linked to this callback */
  onDelete: PropTypes.func,
  /** If provided, renders cancel button linked to this callback */
  onCancel: PropTypes.func,
  /** If provided, renders submit button linked to this callback
   * onSubmit(dashboardData)
   */
  onSubmit: PropTypes.func,
  /** internationalization strings */
  i18n: PropTypes.shape({
    headerImportButton: PropTypes.string,
    headerExportButton: PropTypes.string,
    headerCancelButton: PropTypes.string,
    headerSubmitButton: PropTypes.string,
  }),
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
  notification: null,
  title: null,
  onEditTitle: null,
  onDelete: null,
  onImport: null,
  onExport: null,
  onCancel: null,
  onSubmit: null,
  i18n: {
    headerEditTitleButton: 'Edit title',
    headerImportButton: 'Import',
    headerExportButton: 'Export',
    headerDeleteButton: 'Delete',
    headerCancelButton: 'Cancel',
    headerSubmitButton: 'Save and close',
    galleryHeader: 'Gallery',
    openGalleryButton: 'Open gallery',
    closeGalleryButton: 'Back',
    openJSONButton: 'Open JSON editor',
  },
};

export const baseClassName = `${iotPrefix}--dashboard-editor`;

const DashboardEditor = ({
  title,
  initialValue,
  supportedCardTypes,
  renderHeader,
  renderCardPreview,
  headerBreadcrumbs,
  notification,
  // onAddImage,
  onEditTitle,
  onImport,
  onExport,
  onDelete,
  onCancel,
  onSubmit,
  i18n,
}) => {
  const mergedI18N = { ...defaultProps.i18n, ...i18n };

  // show the gallery if no card is being edited
  const [dashboardJson, setDashboardJson] = useState(initialValue);
  const [selectedCardId, setSelectedCardId] = useState();

  const addCard = type => {
    const cardData = getDefaultCard(type);
    setDashboardJson({
      ...dashboardJson,
      cards: [...dashboardJson.cards, cardData],
    });
    setSelectedCardId(cardData.id);
  };

  const duplicateCard = id => {
    const cardData = getDuplicateCard(dashboardJson.cards.find(i => i.id === id));
    setDashboardJson({
      ...dashboardJson,
      cards: [...dashboardJson.cards, cardData],
    });
    setSelectedCardId(cardData.id);
  };

  const removeCard = id =>
    setDashboardJson({
      ...dashboardJson,
      cards: dashboardJson.cards.filter(i => i.id !== id),
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
            onExport={() => onExport(dashboardJson)}
            onDelete={onDelete}
            onCancel={onCancel}
            onSubmit={onSubmit}
            i18n={mergedI18N}
            dashboardJson={dashboardJson}
          />
        )}
        {notification}
        <div className={`${baseClassName}--preview`}>
          <DashboardGrid
            isEditable
            onBreakpointChange={() => {}}
            onLayoutChange={(newLayout, newLayouts) =>
              setDashboardJson({
                ...dashboardJson,
                layouts: newLayouts,
              })
            }
          >
            {dashboardJson.cards.map(cardData => {
              const isSelected = selectedCardId === cardData.id;
              const onSelectCard = () => setSelectedCardId(cardData.id);
              const onDuplicateCard = id => duplicateCard(id);
              const onRemoveCard = id => removeCard(id);

              // if function not defined, or it returns falsy, render default preview
              return (
                renderCardPreview(
                  cardData,
                  isSelected,
                  onSelectCard,
                  onDuplicateCard,
                  onRemoveCard
                ) ??
                getCardPreview(cardData, isSelected, onSelectCard, onDuplicateCard, onRemoveCard)
              );
            })}
          </DashboardGrid>
        </div>
      </div>
      <div className={`${baseClassName}--sidebar`}>
        <CardEditor
          cardJson={dashboardJson.cards.find(i => i.id === selectedCardId)}
          onShowGallery={() => setSelectedCardId(null)}
          onChange={cardData =>
            setDashboardJson({
              ...dashboardJson,
              cards: dashboardJson.cards.map(card => (card.id === cardData.id ? cardData : card)),
            })
          }
          onAddCard={addCard}
          supportedTypes={supportedCardTypes}
          i18n={mergedI18N}
        />
      </div>
    </div>
  );
};

DashboardEditor.propTypes = propTypes;
DashboardEditor.defaultProps = defaultProps;

export default DashboardEditor;
