import React from 'react';

import { settings } from '../../../constants/Settings';
import { childrenPropType } from '../PageWizard';

const { iotPrefix } = settings;

const PageWizardStepContent = ({ children }) => (
  <div className={`${iotPrefix}--page-wizard--step--content`}>{children}</div>
);

PageWizardStepContent.propTypes = { children: childrenPropType };
PageWizardStepContent.defaultProps = { children: [] };

export default PageWizardStepContent;
