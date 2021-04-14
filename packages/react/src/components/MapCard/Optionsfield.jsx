import React from 'react';

const Optionsfield = (props) => {
  const renderOptions = (option, i) => {
    return (
      <label key={i} className="toggle-container">
        <input
          onChange={() => props.changeState(i)}
          checked={option.property === props.property}
          name="toggle"
          type="radio"
        />
        <div className="toggle">{option.name}</div>
      </label>
    );
  };
  return <div className="toggle-group">{props.options.map(renderOptions)}</div>;
};

export default Optionsfield;
