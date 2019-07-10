import PropTypes from 'prop-types';
import React from 'react';
import { Tabs, Tab } from 'carbon-components-react';

const propTypes = {
  /** Title of the page  */
  selectedId: PropTypes.string,
  /** Details about what the page shows */
  onSelectionChange: PropTypes.func.isRequired,
  /** Optional What to render in the right side of the hero */
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.node.isRequired,
      content: PropTypes.node.isRequired,
      disabled: PropTypes.bool,
    })
  ),
  className: PropTypes.string,
};

const defaultProps = {
  selectedId: undefined,
  items: [],
  className: undefined,
};

const SecondaryNavigator = ({ selectedId, onSelectionChange, items, className }) => (
  <Tabs className={className} selected={items.findIndex(({ id }) => id === selectedId) || 0}>
    {items.map(({ id, label, content, disabled = false }) => (
      <Tab key={id} onClick={() => onSelectionChange(id)} disabled={disabled} label={label}>
        {content}
      </Tab>
    ))}
  </Tabs>
);

SecondaryNavigator.propTypes = propTypes;
SecondaryNavigator.defaultProps = defaultProps;

export default SecondaryNavigator;
