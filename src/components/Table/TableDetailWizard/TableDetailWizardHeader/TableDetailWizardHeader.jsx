import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Button } from 'carbon-components-react';
import { Close20 } from '@carbon/icons-react';

const TableDetailWizardHeader = ({ title, onClose, className }) => (
  <div className={classnames(`wizard-header`, className)}>
    <h2 className="header-heading">{title}</h2>
    <div className="header-button">
      <Button
        kind="ghost"
        renderIcon={() => <Close20 />}
        iconDescription={title}
        onClick={() => onClose()}
      />
    </div>
  </div>
);

TableDetailWizardHeader.propTypes = {
  /** Title in the header  */
  title: PropTypes.string.isRequired,
  /** Close button callback  */
  onClose: PropTypes.func.isRequired,
};

export default TableDetailWizardHeader;
