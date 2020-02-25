/* istanbul ignore file */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { DataTable } from 'carbon-components-react';
import classnames from 'classnames';

import { settings } from '../../../constants/Settings';

const { iotPrefix } = settings;

const { TableToolbarSearch: CarbonTableToolbarSearch } = DataTable;

const propTypes = {
  defaultValue: PropTypes.string,
  defaultExpanded: PropTypes.bool,
  onChange: PropTypes.func,
  onExpand: PropTypes.func,
};

const defaultProps = {
  defaultValue: '',
  defaultExpanded: false,
  onChange: null,
  onExpand: null,
};

/**
 * ----------------------------- WARNING ----------------------------
 * This is a temporary solution to fix a bug in Carbon 9,
 * to be removed when we import Carbon 10
 * ------------------------------------------------------------------
 */
const TableToolbarSearch = ({
  defaultValue,
  defaultExpanded,
  onChange: onChangeProp,
  onExpand,
  ...other
}) => {
  const toolbarSearch = useRef(null);
  const [expanded, setExpanded] = useState(defaultExpanded || defaultValue);
  const [focusTarget, setFocusTarget] = useState(null);

  useEffect(
    () => {
      if (focusTarget) {
        focusTarget.current.querySelector('input').focus();
        setFocusTarget(null);
      }
    },
    [focusTarget]
  );

  const handleExpand = (event, value) => {
    setExpanded(value);
    if (onExpand) {
      onExpand(event, value);
    }
  };

  const onClick = e => {
    setFocusTarget(toolbarSearch);
    handleExpand(e, true);
  };

  const onChange = e => {
    if (onChangeProp) {
      onChangeProp(e);
    }
  };

  const onBlur = e => {
    handleExpand(e, e.target.value !== '');
  };

  return (
    <div
      ref={toolbarSearch}
      className={classnames(`${iotPrefix}--table-toolbar-search`, {
        [`${iotPrefix}--table-toolbar-search__expanded`]: expanded,
      })}
      onClick={onClick}
    >
      <CarbonTableToolbarSearch
        value={defaultValue}
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
