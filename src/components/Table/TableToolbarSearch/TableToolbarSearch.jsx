/* istanbul ignore file */

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { DataTable } from 'carbon-components-react';
import classnames from 'classnames';

import { settings } from '../../../constants/Settings';

const { iotPrefix } = settings;

const { TableToolbarSearch: CarbonTableToolbarSearch } = DataTable;

const propTypes = {
  /** DEPRECATED: use defaultValue instead  */
  value: PropTypes.string,
  /** set a defaul value to the search bar and automatically expands it  */
  defaultValue: PropTypes.string,
  /** renders the search box as expanded by default without setting a default value  */
  defaultExpanded: PropTypes.bool,
  /** triggered on search change  */
  onChange: PropTypes.func,
  /** triggered on field expand  */
  onExpand: PropTypes.func,
};

const defaultProps = {
  value: '',
  defaultValue: '',
  defaultExpanded: false,
  onChange: null,
  onExpand: null,
};

/**
 * ----------------------------- WARNING ----------------------------
 * This is a temporary solution to fix a bug in Carbon 10.9.1
 * to be removed when we import Carbon 10.10.0 or higher
 * https://github.com/IBM/carbon-addons-iot-react/issues/975
 * ------------------------------------------------------------------
 */
const TableToolbarSearch = ({
  value,
  defaultValue,
  defaultExpanded,
  onChange,
  onExpand,
  ...other
}) => {
  const toolbarSearch = useRef(null);
  const [expanded, setExpanded] = useState(defaultExpanded || defaultValue || value);
  const [focusTarget, setFocusTarget] = useState(null);

  useEffect(
    () => {
      if (focusTarget && focusTarget.current) {
        focusTarget.current.querySelector('input').focus();
        setFocusTarget(null);
      }
    },
    [focusTarget]
  );

  useEffect(
    () => {
      setExpanded(defaultValue && defaultValue !== '');
    },
    [defaultValue]
  );

  const handleExpand = (event, val) => {
    setExpanded(val);
    if (onExpand) {
      onExpand(event, val);
    }
  };

  const onClick = e => {
    if (
      !expanded && // if we're not already expanded or focused
      !focusTarget
    ) {
      setFocusTarget(toolbarSearch);
      handleExpand(e, true);
    }
  };

  const onBlur = e => {
    handleExpand(e, e.target.value !== '');
  };

  const onKeyDown = e => {
    if (e.keyCode === 13) {
      onClick(e);
    }
  };

  return (
    <div
      tabIndex="-1"
      ref={toolbarSearch}
      className={classnames(`${iotPrefix}--table-toolbar-search`, {
        [`${iotPrefix}--table-toolbar-search__expanded`]: expanded,
      })}
      onFocus={onClick}
      onClick={onClick}
      onKeyDown={onKeyDown}
      role="button"
    >
      <CarbonTableToolbarSearch
        value={defaultValue || value}
        expanded={expanded}
        onChange={onChange}
        onBlur={onBlur}
        {...other}
      />
    </div>
  );
};

TableToolbarSearch.propTypes = propTypes;
TableToolbarSearch.defaultProps = defaultProps;

export default TableToolbarSearch;
