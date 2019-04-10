import React, { useState } from 'react';

import WizardInline, { propTypes, defaultProps } from './WizardInline';

const StatefulWizardInline = ({
  currentItemId: currentItemIdProp,
  items,
  onNext,
  onBack,
  setItem,
  ...other
}) => {
  const [currentItemId, setCurrentItemId] = useState(currentItemIdProp || (items && items[0].id));
  const currentItemIndex = items.findIndex(item => item.id === currentItemId);
  const nextItem = currentItemIndex < items.length - 1 ? items[currentItemIndex + 1] : undefined;
  const prevItem = currentItemIndex > 0 ? items[currentItemIndex - 1] : undefined;
  const handleNext = id => {
    // Find the last one
    setCurrentItemId(id);
    if (onNext) {
      onNext(id);
    }
  };

  const handleBack = id => {
    // Find the first one
    setCurrentItemId(id);
    if (onBack) {
      onBack(id);
    }
  };
  return (
    <WizardInline
      {...other}
      items={items}
      onBack={() => handleBack(prevItem.id)}
      onNext={() => handleNext(nextItem.id)}
      currentItemId={currentItemId}
      setItem={id => {
        setCurrentItemId(id);
        if (setItem) {
          setItem(id);
        }
      }}
    />
  );
};

StatefulWizardInline.propTypes = propTypes;
StatefulWizardInline.defaultProps = defaultProps;
export default StatefulWizardInline;
