import React from './node_modules/react';

import List from '../List';

const SimpleList = ({ title, search, buttons = [], items = [], ...others }) => {
  return <List title={title} search={search} buttons={buttons} items={items} />;
};

export default SimpleList;
