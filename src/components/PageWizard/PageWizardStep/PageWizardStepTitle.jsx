import React from 'react';

import { settings } from '../../../constants/Settings';
import { childrenPropType } from '../PageWizard';

const { iotPrefix } = settings;

const PageWizardStepTitle = ({ children }) => (
  <div className={`${iotPrefix}--page-wizard--step--title`}>{children}</div>
);

PageWizardStepTitle.propTypes = { children: childrenPropType };
PageWizardStepTitle.defaultProps = { children: [] };

export default PageWizardStepTitle;
