import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { InlineNotification } from 'carbon-components-react';
import classnames from 'classnames';

import { settings } from '../../constants/Settings';
import {
  DASHBOARD_EDITOR_CARD_TYPES,
  CARD_ACTIONS,
} from '../../constants/LayoutConstants';
import { DashboardGrid, CardEditor, ErrorBoundary } from '../../index';

import DashboardEditorHeader from './DashboardEditorHeader/DashboardEditorHeader';
import {
  getDefaultCard,
  getDuplicateCard,
  getCardPreview,
  handleKeyDown,
  handleOnClick,
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
  /** if provided, is used to render cards in dashboard
   * renderCardPreview( cardConfig: Object,
                        commonCardProps: Object
                        onSelectCard: Function,
                        onDuplicateCard: Function,
                        onRemoveCard: Function,
                        isSelected: Boolean): Node
   */
  renderCardPreview: PropTypes.func,
  /** if provided, renders array elements inside of BreadcrumbItem in header */
  headerBreadcrumbs: PropTypes.arrayOf(PropTypes.element),
  /** if provided, renders node underneath the header and above the dashboard grid */
  notification: PropTypes.node,
  /** if provided, renders edit button next to title linked to this callback */
  onEditTitle: PropTypes.func,
  /** if provided, returns an array of strings which are the dataItems to be allowed
   * on each card
   * getValidDataItems(card, selectedTimeRange)
   */
  getValidDataItems: PropTypes.func,
  /** an array of dataItem string names to be included on each card
   * this prop will be ignored if getValidDataItems is defined
   */
  dataItems: PropTypes.arrayOf(PropTypes.string),
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
  /** Whether to disable the submit button */
  submitDisabled: PropTypes.bool,
  /** If provided, runs the function when the user clicks submit in the Card code JSON editor
   * onValidateCardJson(cardConfig)
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
  getValidDataItems: null,
  dataItems: [],
  onDelete: null,
  onImport: null,
  onExport: null,
  onCancel: null,
  onSubmit: null,
  submitDisabled: false,
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
  getValidDataItems,
  dataItems,
  headerBreadcrumbs,
  notification,
  onEditTitle,
  onImport,
  onExport,
  onDelete,
  onCancel,
  onSubmit,
  submitDisabled,
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
    const cardConfig = getDefaultCard(type, mergedI18n);
    setDashboardJson({
      ...dashboardJson,
      cards: [...dashboardJson.cards, cardConfig],
    });
    setSelectedCardId(cardConfig.id);
  };

  /**
   * Adds a cloned card with a new unique id to the preview
   * @param {string} id
   */
  const duplicateCard = (id) => {
    const cardConfig = getDuplicateCard(
      dashboardJson.cards.find((i) => i.id === id)
    );
    setDashboardJson({
      ...dashboardJson,
      cards: [...dashboardJson.cards, cardConfig],
    });
    setSelectedCardId(cardConfig.id);
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

  const commonCardProps = (cardConfig, isSelected) => ({
    key: cardConfig.id,
    tooltip: cardConfig.description,
    availableActions: { clone: true, delete: true },
    onCardAction: (id, actionId) => {
      if (actionId === CARD_ACTIONS.CLONE_CARD) {
        onDuplicateCard(id);
      } else if (actionId === CARD_ACTIONS.DELETE_CARD) {
        onRemoveCard(id);
      }
    },
    tabIndex: 0,
    onKeyDown: (e) => handleKeyDown(e, onSelectCard, cardConfig.id),
    onClick: () => handleOnClick(onSelectCard, cardConfig.id),
    className: classnames(`${baseClassName}--preview__card`, {
      // add black border when selected
      // TODO: swap this to the true isSelected card prop once this issue is closed:
      // https://github.com/carbon-design-system/carbon-addons-iot-react/issues/1621
      [`${iotPrefix}--card__selected`]: isSelected,
    }),
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
            submitDisabled={submitDisabled}
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
            }
          >
            <DashboardGrid
              isEditable
              onBreakpointChange={() => {}}
              onLayoutChange={(newLayout, newLayouts) =>
                setDashboardJson({
                  ...dashboardJson,
                  layouts: newLayouts,
                })
              }>
              {dashboardJson.cards.map((cardConfig) => {
                const isSelected = cardConfig.id === selectedCardId;
                const cardProps = commonCardProps(cardConfig, isSelected);
                // if renderCardPreview function not defined, or it returns null, render default preview
                return (
                  renderCardPreview(
                    cardConfig,
                    cardProps,
                    onSelectCard,
                    onDuplicateCard,
                    onRemoveCard,
                    isSelected
                  ) ?? getCardPreview(cardConfig, cardProps)
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
          }
        >
          <CardEditor
            cardConfig={dashboardJson.cards.find(
              (card) => card.id === selectedCardId
            )}
            onShowGallery={() => setSelectedCardId(null)}
            onChange={(cardConfig) =>
              // TODO: this is really inefficient
              setDashboardJson({
                ...dashboardJson,
                cards: dashboardJson.cards.map((card) =>
                  card.id === cardConfig.id ? cardConfig : card
                ),
              })
            }
            getValidDataItems={getValidDataItems}
            dataItems={dataItems}
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
