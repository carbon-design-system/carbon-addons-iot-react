/**
 * Copied from Carbon Design System
 * Copyright IBM Corp. 2016, 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Popover, PopoverContent } from '@carbon/react';

import { match, keys } from '../../internal/keyboard';
import { settings } from '../../constants/Settings';

const { prefix: carbonPrefix } = settings;

const DefinitionTooltip = ({
  align = 'bottom',
  autoAlign,
  className,
  children,
  definition,
  defaultOpen = false,
  id,
  openOnHover,
  tooltipText,
  triggerClassName,
  as = 'button', // NEW: Element type or custom component
  renderTrigger, // NEW: Custom render function (alternative)
  ...rest
}) => {
  const [isOpen, setOpen] = useState(defaultOpen);
  const prefix = carbonPrefix || 'cds';

  // Generate a unique ID if not provided
  const tooltipId = id || `definition-tooltip-${Math.random().toString(36).substr(2, 9)}`;

  function onKeyDown(event) {
    if (isOpen && match(event, keys.Escape)) {
      event.stopPropagation();
      setOpen(false);
    }
  }

  // Common trigger props
  const triggerProps = {
    className: cx(`${prefix}--definition-term`, triggerClassName),
    'aria-controls': tooltipId,
    'aria-describedby': tooltipId,
    'aria-expanded': isOpen,
    tabIndex: 0,
    onBlur: () => {
      setOpen(false);
    },
    onMouseDown: (event) => {
      // We use onMouseDown rather than onClick to make sure this triggers
      // before onFocus.
      if (event.button === 0) {
        // Prevent default for anchor tags
        if (as === 'a' || (typeof as === 'string' && as.toLowerCase() === 'a')) {
          event.preventDefault();
        }
        setOpen(!isOpen);
      }
    },
    onKeyDown,
    ...rest,
  };

  // Add onClick for anchor tags
  if (as === 'a' || (typeof as === 'string' && as.toLowerCase() === 'a')) {
    triggerProps.onClick = (event) => {
      event.preventDefault();
      setOpen(!isOpen);
    };
    // Add href for anchor tags if not provided
    if (!rest.href) {
      triggerProps.href = '#';
    }
  }

  // Add type for button
  if (as === 'button' || (typeof as === 'string' && as.toLowerCase() === 'button')) {
    triggerProps.type = rest.type || 'button';
  }

  // Determine the trigger element
  let TriggerElement;

  if (renderTrigger) {
    // Option 1: Custom render function
    TriggerElement = () => renderTrigger(triggerProps, children, isOpen, setOpen);
  } else if (typeof as === 'string') {
    // Option 2: HTML element string ('button', 'a', 'span', etc.)
    TriggerElement = () => React.createElement(as, triggerProps, children);
  } else {
    // Option 3: Custom React component
    TriggerElement = () => React.createElement(as, triggerProps, children);
  }

  return (
    <Popover
      align={align}
      className={className}
      autoAlign={autoAlign}
      dropShadow={false}
      highContrast
      onMouseLeave={() => {
        setOpen(false);
      }}
      onMouseEnter={() => {
        if (openOnHover) {
          setOpen(true);
        }
      }}
      onFocus={() => {
        setOpen(true);
      }}
      open={isOpen}
    >
      <TriggerElement />
      <PopoverContent className={`${prefix}--definition-tooltip`} id={tooltipId}>
        {tooltipText ?? definition}
      </PopoverContent>
    </Popover>
  );
};

DefinitionTooltip.propTypes = {
  /**
   * Specify how the trigger should align with the tooltip
   */
  align: PropTypes.oneOf([
    'top',
    'top-left',
    'top-right',
    'bottom',
    'bottom-left',
    'bottom-right',
    'left',
    'left-bottom',
    'left-top',
    'right',
    'right-bottom',
    'right-top',
    'top-start',
    'top-end',
    'bottom-start',
    'bottom-end',
    'left-end',
    'left-start',
    'right-end',
    'right-start',
  ]),

  /**
   * Will auto-align the popover. This prop is currently experimental and is
   * subject to future changes. Requires React v17+
   */
  autoAlign: PropTypes.bool,

  /**
   * The element type or custom component to render as the trigger.
   * Can be 'button', 'a', 'span', or a custom React component.
   */
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),

  /**
   * The `children` prop will be used as the value that is being defined
   */
  children: PropTypes.node.isRequired,

  /**
   * Specify an optional className to be applied to the container node
   */
  className: PropTypes.string,

  /**
   * Specify whether the tooltip should be open when it first renders
   */
  defaultOpen: PropTypes.bool,

  /**
   * The `definition` prop is used as the content inside of the tooltip that
   * appears when a user interacts with the element rendered by the `children`
   * prop
   */
  definition: PropTypes.node.isRequired,

  /**
   * Provide a value that will be assigned as the id of the tooltip
   */
  id: PropTypes.string,

  /**
   * Specifies whether or not the `DefinitionTooltip` should open on hover or not
   */
  openOnHover: PropTypes.bool,

  /**
   * Custom render function for the trigger element.
   * Receives (props, children, isOpen, setOpen) as arguments.
   * If provided, this takes precedence over the `as` prop.
   */
  renderTrigger: PropTypes.func,

  /**
   * Tooltip text for accessibility
   */
  tooltipText: PropTypes.string,

  /**
   * The CSS class name of the trigger element
   */
  triggerClassName: PropTypes.string,
};

DefinitionTooltip.defaultProps = {
  align: 'bottom',
  as: 'button',
  autoAlign: false,
  className: undefined,
  defaultOpen: false,
  id: undefined,
  openOnHover: false,
  renderTrigger: undefined,
  tooltipText: undefined,
  triggerClassName: undefined,
};

export { DefinitionTooltip };
export default DefinitionTooltip;

// Made with Bob
