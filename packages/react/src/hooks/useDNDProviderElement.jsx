import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import React from 'react';

export function useDNDProviderElement(props) {
  const { children } = props; // eslint-disable-line react/prop-types

  if (!children) return null;

  return (
    <DndProvider backend={HTML5Backend} context={window}>
      {children}
    </DndProvider>
  );
}
