import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { AccordionItem as CarbonAccordionItem } from '.';

const AccordionItem = ({ children, ...props }) => {
  const [openState, setOpenState] = useState(false);
  const handleToggle = event => {
    props.onClick(event);
    setOpenState(!openState);
  };
  return (
    <CarbonAccordionItem onClick={event => handleToggle(event)}>
      {openState && children}
    </CarbonAccordionItem>
  );
};

AccordionItem.propTypes = {
  /**
   * Provide the contents of your AccordionItem
   */
  children: PropTypes.node,

  /**
   * Specify an optional className to be applied to the container node
   */
  className: PropTypes.string,

  /**
   * The accordion title.
   */
  title: PropTypes.node,

  /**
   * The callback function to render the expando button.
   * Can be a React component class.
   */
  renderExpando: PropTypes.func,

  /**
   * The description of the expando icon.
   */
  iconDescription: PropTypes.string,

  /**
   * `true` to open the expando.
   */
  open: PropTypes.bool,

  /**
   * The handler of the massaged `click` event.
   */
  onClick: PropTypes.func,

  /**
   * The handler of the massaged `click` event on the heading.
   */
  onHeadingClick: PropTypes.func,
};

AccordionItem.defaultProps = {
  children: null,
  className: null,
  title: null,
  renderExpando: null,
  iconDescription: 'Open/Close',
  open: null,
  onClick: () => {},
  onHeadingClick: () => {},
};

export default AccordionItem;
