import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  TrashCan16,
  DocumentImport16,
  DocumentExport16,
  Maximize16,
  Tablet16,
  Laptop16,
  Screen16,
} from '@carbon/icons-react';
import { FileUploaderButton, TooltipIcon, ContentSwitcher } from 'carbon-components-react';

import { settings } from '../../../constants/Settings';
import { Button, PageTitleBar } from '../../../index';
import IconSwitch from '../../IconSwitch/IconSwitch';

const { iotPrefix } = settings;

const propTypes = {
  /** Dashboard title */
  title: PropTypes.string,
  /** initial dashboard data to edit */
  breadcrumbs: PropTypes.arrayOf(PropTypes.node),
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
  /** Whether to disable the submit button */
  isSubmitDisabled: PropTypes.bool,
  /** Whether to set the loading spinner on the submit button */
  isSubmitLoading: PropTypes.bool,
  /** internationalization strings */
  i18n: PropTypes.shape({
    headerEditTitleButton: PropTypes.string,
    headerImportButton: PropTypes.string,
    headerExportButton: PropTypes.string,
    headerDeleteButton: PropTypes.string,
    headerCancelButton: PropTypes.string,
    headerSubmitButton: PropTypes.string,
    headerFitToScreenButton: PropTypes.string,
    headerXlargeButton: PropTypes.string,
    headerLargeButton: PropTypes.string,
    headerMediumButton: PropTypes.string,
  }),
  /** The current dashboard's JSON */
  dashboardJson: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  /** currently selected breakpoint which is being held in state by DashboardEditor */
  selectedBreakpointIndex: PropTypes.number,
  /** handler to change the selectedBreakpoint state */
  setSelectedBreakpointIndex: PropTypes.func,
  /** if enabled, renders a ContentSwitcher with IconSwitches that allow for manually changing the breakpoint,
   * regardless of the screen width
   */
  breakpointSwitcher: PropTypes.shape({
    enabled: PropTypes.bool,
    allowedBreakpoints: PropTypes.arrayOf(PropTypes.string),
  }),
};

const defaultProps = {
  title: null,
  breadcrumbs: [],
  onEditTitle: null,
  onImport: null,
  onExport: null,
  onDelete: null,
  onCancel: null,
  onSubmit: null,
  isSubmitDisabled: false,
  isSubmitLoading: false,
  i18n: {
    headerEditTitleButton: 'Edit title',
    headerImportButton: 'Import',
    headerExportButton: 'Export',
    headerDeleteButton: 'Delete',
    headerCancelButton: 'Cancel',
    headerSubmitButton: 'Save and close',
    headerFitToScreenButton: 'Fit to screen',
    headerLargeButton: 'Large view',
    headerMediumButton: 'Medium view',
    headerSmallButton: 'Small view',
  },
  selectedBreakpointIndex: null,
  setSelectedBreakpointIndex: null,
  breakpointSwitcher: null,
};

const DashboardEditorHeader = ({
  title,
  breadcrumbs,
  onEditTitle,
  onImport,
  onExport,
  onDelete,
  onCancel,
  onSubmit,
  isSubmitDisabled,
  isSubmitLoading,
  i18n,
  dashboardJson,
  selectedBreakpointIndex,
  setSelectedBreakpointIndex,
  breakpointSwitcher,
}) => {
  const mergedI18n = useMemo(() => ({ ...defaultProps.i18n, ...i18n }), [i18n]);
  const baseClassName = `${iotPrefix}--dashboard-editor-header`;
  const extraContent = (
    <div className={`${baseClassName}--right`}>
      <div className={`${baseClassName}--top`} />
      <div className={`${baseClassName}--bottom`}>
        {breakpointSwitcher?.enabled && (
          <ContentSwitcher
            onChange={(e) => setSelectedBreakpointIndex(e.index)}
            selectedIndex={selectedBreakpointIndex}
            className={`${baseClassName}--bottom__switcher`}
          >
            <IconSwitch
              name="fit-to-screen"
              text={mergedI18n.headerFitToScreenButton}
              renderIcon={Maximize16}
              index={0}
            />
            <IconSwitch
              name="large"
              text={mergedI18n.headerLargeButton}
              renderIcon={Screen16}
              index={1}
            />
            <IconSwitch
              name="medium"
              text={mergedI18n.headerMediumButton}
              renderIcon={Laptop16}
              index={2}
            />
            <IconSwitch
              name="small"
              text={mergedI18n.headerSmallButton}
              renderIcon={Tablet16}
              index={3}
            />
          </ContentSwitcher>
        )}

        {
          // FileUploaderButton isn't a true button so extra styling is needed to make it look like a iconOnly button
          onImport && (
            <TooltipIcon
              align="center"
              direction="bottom"
              tooltipText={mergedI18n.headerImportButton}
              className={`${baseClassName}--bottom__import`}
            >
              <FileUploaderButton
                buttonKind="ghost"
                size="field"
                labelText={<DocumentImport16 fill="#161616" />}
                onChange={onImport}
                disableLabelChanges
                accepts={['.json']}
                multiple={false}
              />
            </TooltipIcon>
          )
        }
        {onExport && (
          <Button
            kind="ghost"
            size="field"
            iconDescription={mergedI18n.headerExportButton}
            tooltipPosition="bottom"
            tooltipAlignment="center"
            hasIconOnly
            renderIcon={DocumentExport16}
            onClick={() => onExport(dashboardJson)}
          />
        )}
        {onDelete && (
          <Button
            kind="ghost"
            size="field"
            iconDescription={mergedI18n.headerDeleteButton}
            tooltipPosition="bottom"
            tooltipAlignment="center"
            hasIconOnly
            renderIcon={TrashCan16}
            onClick={onDelete}
          />
        )}
        {onCancel && (
          <Button kind="secondary" size="field" onClick={onCancel}>
            {mergedI18n.headerCancelButton}
          </Button>
        )}
        {onSubmit && (
          <Button
            size="field"
            disabled={isSubmitDisabled}
            onClick={() => onSubmit(dashboardJson)}
            loading={isSubmitLoading}
          >
            {mergedI18n.headerSubmitButton}
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <PageTitleBar
      breadcrumb={breadcrumbs}
      extraContent={extraContent}
      title={title}
      editable={!!onEditTitle}
      onEdit={onEditTitle}
      i18n={{ editIconDescription: mergedI18n.headerEditTitleButton }}
    />
  );
};

DashboardEditorHeader.defaultProps = defaultProps;
DashboardEditorHeader.propTypes = propTypes;

export default DashboardEditorHeader;
