import React from 'react';
import PropTypes from 'prop-types';
import {
  RequestQuote16,
  TrashCan16,
  DocumentImport16,
  DocumentExport16,
} from '@carbon/icons-react';

import { settings } from '../../../constants/Settings';
import { Button, Breadcrumb, BreadcrumbItem } from '../../../index';

const { iotPrefix, prefix } = settings;

const defaultProps = {
  title: null,
  breadcrumbs: [],
  onEditTitle: null,
  onImport: null,
  onExport: null,
  onDelete: null,
  onCancel: null,
  onSubmit: null,
};

const propTypes = {
  /** Dashboard title */
  title: PropTypes.string,
  /** initial dashboard data to edit */
  breadcrumbs: PropTypes.arrayOf(PropTypes.node),
  /** if provided, renders edit button next to title linked to this callback */
  onEditTitle: PropTypes.func,
  /** if provided, renders import button linked to this callback */
  onImport: PropTypes.func,
  /** if provided, renders export button linked to this callback */
  onExport: PropTypes.func,
  /** if provided, renders delete button linked to this callback */
  onDelete: PropTypes.func,
  /** If provided, renders cancel button linked to this callback */
  onCancel: PropTypes.func,
  /** If provided, renders submit button linked to this callback */
  onSubmit: PropTypes.func,
  /** i18n */
  i18n: PropTypes.shape({
    headerEditTitleButton: PropTypes.string,
    headerImportButton: PropTypes.string,
    headerExportButton: PropTypes.string,
    headerDeleteButton: PropTypes.string,
    headerCancelButton: PropTypes.string,
    headerSubmitButton: PropTypes.string,
  }).isRequired,
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
}) => {
  const baseClassName = `${iotPrefix}--dashboard-editor-header`;
  return (
    <div className={baseClassName}>
      <div className={`${prefix}--grid`}>
        <div className={`${prefix}--row`}>
          <div className={`${prefix}--col ${baseClassName}--left`}>
            <div className={`${baseClassName}--top`}>
              {breadcrumbs ? (
                <Breadcrumb>
                  {breadcrumbs.map((crumb, index) => (
                    <BreadcrumbItem key={`breadcrumb-${index}`}>{crumb}</BreadcrumbItem>
                  ))}
                </Breadcrumb>
              ) : null}
            </div>
            <div className={`${baseClassName}--bottom`}>
              <h3>{title}</h3>
              {onEditTitle && (
                <Button
                  kind="ghost"
                  size="field"
                  iconDescription={i18n.headerEditTitleButton}
                  tooltipPosition="bottom"
                  hasIconOnly
                  renderIcon={RequestQuote16}
                  onClick={onEditTitle}
                />
              )}
            </div>
          </div>
          <div className={`${prefix}--col ${baseClassName}--right`}>
            <div className={`${baseClassName}--top`}>
              {/* <span className="last-updated">Last updated: XYZ</span> */}
            </div>
            <div className={`${baseClassName}--bottom`}>
              {onImport && (
                <Button
                  kind="ghost"
                  size="field"
                  iconDescription={i18n.headerImportButton}
                  tooltipPosition="bottom"
                  hasIconOnly
                  renderIcon={DocumentImport16}
                  onClick={onImport}
                />
              )}
              {onExport && (
                <Button
                  kind="ghost"
                  size="field"
                  iconDescription={i18n.headerExportButton}
                  tooltipPosition="bottom"
                  hasIconOnly
                  renderIcon={DocumentExport16}
                  onClick={onExport}
                />
              )}
              {onDelete && (
                <Button
                  kind="ghost"
                  size="field"
                  iconDescription={i18n.headerDeleteButton}
                  tooltipPosition="bottom"
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
                <Button size="field" onClick={onSubmit}>
                  {i18n.headerSubmitButton}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

DashboardEditorHeader.defaultProps = defaultProps;
DashboardEditorHeader.propTypes = propTypes;

export default DashboardEditorHeader;
