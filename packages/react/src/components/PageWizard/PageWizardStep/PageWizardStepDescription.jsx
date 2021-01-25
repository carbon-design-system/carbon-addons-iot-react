import React from 'react';

import { settings } from '../../../constants/Settings';
import { childrenPropType } from '../PageWizard';

const { iotPrefix } = settings;

const PageWizardStepDescription = ({ children }) => (
  <div className={`${iotPrefix}--page-wizard--step--description`}>{children}</div>
);

PageWizardStepDescription.propTypes = { children: childrenPropType };
PageWizardStepDescription.defaultProps = { children: [] };

export default PageWizardStepDescription;
