import React, { useState } from 'react';
import { DataTable } from 'carbon-components-react';
import Button from '../../Button/Button';
import { Add16 } from '@carbon/icons-react';
import { iconAddSolid, iconSearch } from 'carbon-icons';

const { TableToolbarSearch } = DataTable;

const ListHeader = ({ title, hasButton, hasSearch, onSearch, ...others }) => {
  console.log(hasSearch);
  const [expanded, setExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState();

  const handleSearch = event => {
    console.log(event.target.value);
    setSearchTerm(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <div
      className="list-header"
      onSubmit={() => {
        onSearch(searchTerm);
      }}
    >
      <span className="list-header--title">{title}</span>
      <span className="list-header--space" />
      {hasButton ? <Button renderIcon={Add16} hasIconOnly size="small" /> : null}
    </div>
  );
};

export default ListHeader;
