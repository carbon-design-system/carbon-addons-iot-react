import React from 'react';
import PropTypes from 'prop-types';
import {
  TrashCan16,
  DocumentImport16,
  DocumentExport16,
} from '@carbon/icons-react';
import { FileUploaderButton, TooltipIcon } from 'carbon-components-react';

import { settings } from '../../../constants/Settings';
import { Button, PageTitleBar } from '../../../index';

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
  /** i18n */
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
}) => {
  const baseClassName = `${iotPrefix}--dashboard-editor-header`;
  const extraContent = (
    <div className={`${baseClassName}--right`}>
      <div className={`${baseClassName}--top`} />
      <div className={`${baseClassName}--bottom`}>
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
