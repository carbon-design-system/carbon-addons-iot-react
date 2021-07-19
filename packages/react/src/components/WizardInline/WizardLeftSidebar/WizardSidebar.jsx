import React from 'react';
import PropTypes from 'prop-types';

import { settings } from '../../../constants/Settings';

const { iotPrefix } = settings;

const propTypes = {
  sidebar: PropTypes.element,
  width: PropTypes.number,
  testId: PropTypes.string,
};

const defaultProps = {
  sidebar: null,
  width: 200,
  testId: 'wizard-sidebar',
};

const WizardSidebar = ({ sidebar, width, testId }) => (
  <div
    data-testid={testId}
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
