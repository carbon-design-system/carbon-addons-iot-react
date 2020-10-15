import React from 'react';
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
import {
  FileUploaderButton,
  TooltipIcon,
  ContentSwitcher,
} from 'carbon-components-react';

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
  /** internationalization strings */
  i18n: PropTypes.shape({
    headerEditTitleButton: PropTypes.string,
    headerImportButton: PropTypes.string,
    headerExportButton: PropTypes.string,
    headerDeleteButton: PropTypes.string,
    headerCancelButton: PropTypes.string,
    headerSubmitButton: PropTypes.string,
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
  i18n: {
    headerEditTitleButton: 'Edit title',
    headerImportButton: 'Import',
    headerExportButton: 'Export',
    headerDeleteButton: 'Delete',
    headerCancelButton: 'Cancel',
    headerSubmitButton: 'Submit',
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
  i18n,
  dashboardJson,
  selectedBreakpointIndex,
  setSelectedBreakpointIndex,
  breakpointSwitcher,
}) => {
  const baseClassName = `${iotPrefix}--dashboard-editor-header`;
  const extraContent = (
    <div className={`${baseClassName}--right`}>
      <div className={`${baseClassName}--top`} />
      <div className={`${baseClassName}--bottom`}>
        {breakpointSwitcher?.enabled && (
          <ContentSwitcher
            onChange={(e) => setSelectedBreakpointIndex(e.index)}
            selectedIndex={selectedBreakpointIndex}
            className={`${baseClassName}--bottom__switcher`}>
            <IconSwitch
              name="fit-to-screen"
              text="Fit to screen"
              renderIcon={Maximize16}
            />
            <IconSwitch
              name="tablet"
              text="Tablet view"
              renderIcon={Tablet16}
            />
            <IconSwitch
              name="laptop"
              text="Laptop View"
              renderIcon={Laptop16}
            />
            <IconSwitch
              name="screen"
              text="Desktop View"
              renderIcon={Screen16}
            />
          </ContentSwitcher>
        )}

        {
          // FileUploaderButton isn't a true button so extra styling is needed to make it look like a iconOnly button
          onImport && (
            <TooltipIcon
              align="center"
              direction="bottom"
              tooltipText={i18n.headerImportButton}
              className={`${baseClassName}--bottom__import`}>
              <FileUploaderButton
                buttonKind="ghost"
                size="field"
                labelText={<DocumentImport16 fill="#161616" />}
                onChange={onImport}
                disableLabelChanges
              />
            </TooltipIcon>
          )
        }
        {onExport && (
          <Button
            kind="ghost"
            size="field"
            iconDescription={i18n.headerExportButton}
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
            iconDescription={i18n.headerDeleteButton}
            tooltipPosition="bottom"
            tooltipAlignment="center"
            hasIconOnly
            renderIcon={TrashCan16}
            onClick={onDelete}
          />
        )}
        {onCancel && (
          <Button kind="tertiary" size="field" onClick={onCancel}>
            {i18n.headerCancelButton}
          </Button>
        )}
        {onSubmit && (
          <Button size="field" onClick={() => onSubmit(dashboardJson)}>
            {i18n.headerSubmitButton}
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
      i18n={{ editIconDescription: i18n.headerEditTitleButton }}
    />
  );
};

DashboardEditorHeader.defaultProps = defaultProps;
DashboardEditorHeader.propTypes = propTypes;

export default DashboardEditorHeader;
