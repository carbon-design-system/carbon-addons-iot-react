import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  changeState: PropTypes.func.isRequired,
  property: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      property: PropTypes.string,
    })
  ).isRequired,
};

const Optionsfield = ({ changeState, property, options }) => {
  const renderOptions = (option, i) => {
    return (
      <label htmlFor={option.name} key={option.name} className="toggle-container">
        <input
          id={option.name}
          onChange={() => changeState(i)}
          checked={option.property === property}
          name="toggle"
          type="radio"
        />
        <div className="toggle">{option.name}</div>
      </label>
    );
  };
  return <div className="toggle-group">{options.map(renderOptions)}</div>;
};

Optionsfield.propTypes = propTypes;
export default Optionsfield;
