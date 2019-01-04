import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

const Example = ({ children, className, ...other }) => {
  const exampleClasses = classNames({
    'bx--example': true,
    [className]: className,
  });

  return (
    <div {...other} className={exampleClasses}>
      {children}
    </div>
  );
};

Example.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

Example.defaultProps = {};

export default Example;
