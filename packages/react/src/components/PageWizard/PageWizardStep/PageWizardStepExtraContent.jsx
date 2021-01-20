import React from 'react';

import { settings } from '../../../constants/Settings';
import { childrenPropType } from '../PageWizard';

const { iotPrefix } = settings;

const PageWizardStepExtraContent = ({ children }) => (
  <div className={`${iotPrefix}--page-wizard--step--extra-content`}>{children}</div>
);

PageWizardStepExtraContent.propTypes = { children: childrenPropType };
PageWizardStepExtraContent.defaultProps = { children: [] };

export default PageWizardStepExtraContent;
