import { useRef } from 'react';
import uuidv4 from 'uuid/v4';

const getUniqueId = () => uuidv4();

export function useUniqueId() {
  const idRef = useRef(null);
  if (idRef.current === null) {
    idRef.current = getUniqueId();
  }
  return idRef.current;
}
