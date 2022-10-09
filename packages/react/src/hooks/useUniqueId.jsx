import { useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

const getUniqueId = () => uuidv4();

export function useUniqueId() {
  const idRef = useRef(null);
  if (idRef.current === null) {
    idRef.current = getUniqueId();
  }
  return idRef.current;
}
