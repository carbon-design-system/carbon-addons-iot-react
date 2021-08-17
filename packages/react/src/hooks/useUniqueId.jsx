import { useRef } from 'react';
import uuid from 'uuid';

const getUniqueId = () => uuid.v4();

export function useUniqueId() {
  const idRef = useRef(null);
  if (idRef.current === null) {
    idRef.current = getUniqueId();
  }
  return idRef.current;
}
