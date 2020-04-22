import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AccordionItem as CarbonAccordionItem } from 'carbon-components-react';

const AccordionItem = ({ children, ...props }) => {
  const { open } = props;
  const [openState, setOpenState] = useState(open);
  useEffect(
    () => {
      setOpenState(open);
    },
    [open]
  );
  const handleToggle = event => {
    props.onHeadingClick(event);
    setOpenState(!openState);
  };
  return (
    <CarbonAccordionItem data-testid="accordion-item" {...props} onHeadingClick={handleToggle}>
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
  // Carbon provides default
  // eslint-disable-next-line react/require-default-props
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
  iconDescription: 'Open/Close',
  open: false,
  onClick: () => {},
  onHeadingClick: () => {},
};

export default AccordionItem;
