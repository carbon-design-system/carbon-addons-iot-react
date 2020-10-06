import React from 'react';
import PropTypes from 'prop-types';
import { DocumentImport16, DocumentExport16 } from '@carbon/icons-react';

import { settings } from '../../../constants/Settings';
import { Button, Breadcrumb, BreadcrumbItem } from '../../../index';

const { iotPrefix, prefix } = settings;

const defaultProps = {
  breadcrumbs: [],
  onImport: null,
  onExport: null,
};

const propTypes = {
  /** Dashboard title */
  title: PropTypes.string.isRequired,
  /** initial dashboard data to edit */
  breadcrumbs: PropTypes.arrayOf(PropTypes.node),
  /** if provided, renders import button linked to this callback */
  onImport: PropTypes.func,
  /** if provided, renders export button linked to this callback */
  onExport: PropTypes.func,
  /** Callback when cancel button is clicked */
  onCancel: PropTypes.func.isRequired,
  /** Callback when submit button is clicked */
  onSubmit: PropTypes.func.isRequired,
  /** i18n */
  i18n: PropTypes.shape({
    headerImportButton: PropTypes.string,
    headerExportButton: PropTypes.string,
    headerCancelButton: PropTypes.string,
    headerSubmitButton: PropTypes.string,
  }).isRequired,
};

const DashboardEditorHeader = ({
  title,
  breadcrumbs,
  onImport,
  onExport,
  onCancel,
  onSubmit,
  i18n,
}) => {
  const baseClassName = `${iotPrefix}--dashboard-editor`;
  return (
    <div className={`${baseClassName}--header`}>
      <div className={`${prefix}--grid`}>
        <div className={`${prefix}--row`}>
          <div className={`${prefix}--col header-left`}>
            <div className="header-top">
              {breadcrumbs ? (
                <Breadcrumb>
                  {breadcrumbs.map((crumb, index) => (
                    <BreadcrumbItem key={`breadcrumb-${index}`}>{crumb}</BreadcrumbItem>
                  ))}
                </Breadcrumb>
              ) : null}
            </div>
            <div className="header-bottom">
              <h4>{title}</h4>
            </div>
          </div>
          <div className={`${prefix}--col header-right`}>
            <div className="header-top">
              {/* <span className="last-updated">Last updated: XYZ</span> */}
            </div>
            <div className="header-bottom">
              {onImport && (
                <Button
                  kind="ghost"
                  iconDescription={i18n.headerImportButton}
                  hasIconOnly
                  renderIcon={DocumentImport16}
                  onClick={onImport}
                />
              )}
              {onExport && (
                <Button
                  kind="ghost"
                  iconDescription={i18n.headerExportButton}
                  hasIconOnly
                  renderIcon={DocumentExport16}
                  onClick={onExport}
                />
              )}
              <Button kind="tertiary" size="small" onClick={onCancel}>
                {i18n.headerCancelButton}
              </Button>
              <Button size="small" onClick={onSubmit}>
                {i18n.headerSubmitButton}
              </Button>
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
