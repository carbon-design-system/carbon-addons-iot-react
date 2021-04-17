import React from 'react';
import PropTypes from 'prop-types';

import { settings } from '../../../constants/Settings';

const { iotPrefix } = settings;

const propTypes = {
  sidebar: PropTypes.element,
  width: PropTypes.number,
};

const defaultProps = {
  sidebar: null,
  width: 200,
};

const WizardSidebar = ({ sidebar, width }) => (
  <div
    className={`${iotPrefix}--wizard-inline__sidebar`}
    style={{
      '--min-width': `${width}px`,
    }}
  >
    {sidebar}
  </div>
);

WizardSidebar.propTypes = propTypes;
WizardSidebar.defaultProps = defaultProps;

export default WizardSidebar;
