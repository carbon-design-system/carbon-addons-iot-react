import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Popover, PopoverContent } from '@carbon/react';
import { match, keys } from '../../internal/keyboard';
import { settings } from '../../constants/Settings';
import deprecate from '../../internal/deprecate';

const { iotPrefix, prefix: carbonPrefix } = settings;

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
      open={isOpen}>
      <a
        {...rest}
        href="#"
        tabIndex={0}
        className={cx(`${prefix}--definition-term`, triggerClassName)}
        aria-controls={tooltipId}
        aria-describedby={tooltipId}
        aria-expanded={isOpen}
        onBlur={() => {
          setOpen(false);
        }}
        onClick={(event) => {
          event.preventDefault();
          setOpen(!isOpen);
        }}
        onMouseDown={(event) => {
          // We use onMouseDown rather than onClick to make sure this triggers
          // before onFocus.
          if (event.button === 0) {
            event.preventDefault();
            setOpen(!isOpen);
          }
        }}
        onKeyDown={onKeyDown}>
        {children}
      </a>
      <PopoverContent
        className={`${prefix}--definition-tooltip`}
        id={tooltipId}>
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
    'top-left', // deprecated use top-start instead
    'top-right', // deprecated use top-end instead

    'bottom',
    'bottom-left', // deprecated use bottom-start instead
    'bottom-right', // deprecated use bottom-end instead

    'left',
    'left-bottom', // deprecated use left-end instead
    'left-top', // deprecated use left-start instead

    'right',
    'right-bottom', // deprecated use right-end instead
    'right-top', // deprecated use right-start instead

    // new values to match floating-ui
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
   * @deprecated Please use the `definition` prop instead.
   *
   * Provide the text that will be displayed in the tooltip when it is rendered.
   */
  tooltipText: deprecate(
    PropTypes.node,
    'The tooltipText prop has been deprecated. Please use the `definition` prop instead.'
  ),

  /**
   * The CSS class name of the trigger element
   */
  triggerClassName: PropTypes.string,
};

DefinitionTooltip.defaultProps = {
  align: 'bottom',
  autoAlign: false,
  className: undefined,
  defaultOpen: false,
  id: undefined,
  openOnHover: false,
  tooltipText: undefined,
  triggerClassName: undefined,
};

export { DefinitionTooltip };
export default DefinitionTooltip;

// Made with Bob
