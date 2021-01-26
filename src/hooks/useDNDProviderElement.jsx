import { DndProvider, createDndContext } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import React, { useRef } from 'react';

const RNDContext = createDndContext(HTML5Backend);

export function useDNDProviderElement(props) {
  const { children } = props; // eslint-disable-line react/prop-types
  const manager = useRef(RNDContext);

  if (!children) return null;

  return (
    <DndProvider manager={manager.current.dragDropManager}>
      {children}
    </DndProvider>
  );
}
