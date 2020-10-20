import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { InlineNotification } from 'carbon-components-react';

import { settings } from '../../constants/Settings';
import { DASHBOARD_EDITOR_CARD_TYPES } from '../../constants/LayoutConstants';
import { DashboardGrid, CardEditor, ErrorBoundary } from '../../index';

import DashboardEditorHeader from './DashboardEditorHeader/DashboardEditorHeader';
import {
  getDefaultCard,
  getDuplicateCard,
  getCardPreview,
} from './editorUtils';

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
  /** If provided, runs the function when the user clicks submit in the Card code JSON editor
   * onValidateCardJson(cardJson)
   * @returns Array<string> error strings. return empty array if there is no errors
   */
  onValidateCardJson: PropTypes.func,
  /** internationalization strings */
  i18n: PropTypes.shape({
    headerImportButton: PropTypes.string,
    headerExportButton: PropTypes.string,
    headerCancelButton: PropTypes.string,
    headerSubmitButton: PropTypes.string,
    headerDeleteButton: PropTypes.string,
    noDataLabel: PropTypes.string,
    defaultCardTitle: PropTypes.string,
    headerEditTitleButton: PropTypes.string,
    galleryHeader: PropTypes.string,
    openGalleryButton: PropTypes.string,
    closeGalleryButton: PropTypes.string,
    openJSONButton: PropTypes.string,
    searchPlaceholderText: PropTypes.string,
  }),
};

const defaultProps = {
  initialValue: {
    cards: [],
    layouts: {},
  },
  supportedCardTypes: Object.keys(DASHBOARD_EDITOR_CARD_TYPES),
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
  onValidateCardJson: null,
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
    noDataLabel: 'No data source is defined',
    defaultCardTitle: 'Untitled',
    searchPlaceholderText: 'Enter a value',
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
  onEditTitle,
  onImport,
  onExport,
  onDelete,
  onCancel,
  onSubmit,
  onValidateCardJson,
  i18n,
}) => {
  const mergedI18n = { ...defaultProps.i18n, ...i18n };

  // show the gallery if no card is being edited
  const [dashboardJson, setDashboardJson] = useState(initialValue);
  const [selectedCardId, setSelectedCardId] = useState();

  /**
   * Adds a default, empty card to the preview
   * @param {string} type card type
   */
  const addCard = (type) => {
    const cardData = getDefaultCard(type, mergedI18n);
    setDashboardJson({
      ...dashboardJson,
      cards: [...dashboardJson.cards, cardData],
    });
    setSelectedCardId(cardData.id);
  };

  /**
   * Adds a cloned card with a new unique id to the preview
   * @param {string} id
   */
  const duplicateCard = (id) => {
    const cardData = getDuplicateCard(
      dashboardJson.cards.find((i) => i.id === id)
    );
    setDashboardJson({
      ...dashboardJson,
      cards: [...dashboardJson.cards, cardData],
    });
    setSelectedCardId(cardData.id);
  };

  /**
   * Deletes a card from the preview
   * @param {string} id
   */
  const removeCard = (id) =>
    setDashboardJson({
      ...dashboardJson,
      cards: dashboardJson.cards.filter((i) => i.id !== id),
    });

  const onSelectCard = (id) => setSelectedCardId(id);
  const onDuplicateCard = (id) => duplicateCard(id);
  const onRemoveCard = (id) => removeCard(id);

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
            i18n={mergedI18n}
            dashboardJson={dashboardJson}
          />
        )}
        {notification}
        <div className={`${baseClassName}--preview`}>
          <ErrorBoundary
            fallback={
              <InlineNotification
                title="Dashboard editor error"
                subtitle="Something went wrong. Please refresh the page."
                kind="error"
                lowContrast
              />
            }>
            <DashboardGrid
              isEditable
              onBreakpointChange={() => {}}
              onLayoutChange={(newLayout, newLayouts) =>
                setDashboardJson({
                  ...dashboardJson,
                  layouts: newLayouts,
                })
              }>
              {dashboardJson.cards.map((cardData) => {
                // if function not defined, or it returns falsy, render default preview
                return (
                  renderCardPreview(
                    cardData,
                    onSelectCard,
                    onDuplicateCard,
                    onRemoveCard
                  ) ??
                  getCardPreview(
                    cardData,
                    onSelectCard,
                    onDuplicateCard,
                    onRemoveCard
                  )
                );
              })}
            </DashboardGrid>
          </ErrorBoundary>
        </div>
      </div>
      <div className={`${baseClassName}--sidebar`}>
        <ErrorBoundary
          fallback={
            <InlineNotification
              title="Dashboard editor error"
              subtitle="Something went wrong. Please refresh the page."
              kind="error"
              lowContrast
            />
          }>
          <CardEditor
            cardJson={dashboardJson.cards.find(
              (card) => card.id === selectedCardId
            )}
            onShowGallery={() => setSelectedCardId(null)}
            onChange={(cardData) =>
              // TODO: this is really inefficient
              setDashboardJson({
                ...dashboardJson,
                cards: dashboardJson.cards.map((card) =>
                  card.id === cardData.id ? cardData : card
                ),
              })
            }
            onAddCard={addCard}
            onValidateCardJson={onValidateCardJson}
            supportedCardTypes={supportedCardTypes}
            i18n={mergedI18n}
          />
        </ErrorBoundary>
      </div>
    </div>
  );
};

DashboardEditor.propTypes = propTypes;
DashboardEditor.defaultProps = defaultProps;

export default DashboardEditor;
