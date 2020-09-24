import React, { useState, useEffect } from 'react';
import { AccordionItem } from 'carbon-components-react';

const AccordionItemDefer = ({ children, ...props }) => {
  const { open } = props;
  const [openState, setOpenState] = useState(open);
  const [hasEverBeenOpened, setHasEverBeenOpened] = useState(open);
  useEffect(
    () => {
      setOpenState(open);
    },
    [open]
  );
  const handleToggle = event => {
    if (props.onHeadingClick) {
      props.onHeadingClick(event);
    }
    setOpenState(!openState);
    setHasEverBeenOpened(true);
  };
  return (
    <AccordionItem data-testid="accordion-item-deferred" {...props} onHeadingClick={handleToggle}>
      {(openState && children) || (hasEverBeenOpened && children)}
    </AccordionItem>
  );
};

AccordionItemDefer.propTypes = AccordionItem.propTypes;
AccordionItemDefer.defaultProps = AccordionItem.defaultProps;

export default AccordionItemDefer;
