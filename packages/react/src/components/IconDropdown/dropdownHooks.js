import { useCallback, useEffect, useRef } from 'react';

import { settings } from '../../constants/Settings';

const { prefix } = settings;

/**
 * hacky work-around to set the title on Dropdowns that are overriding itemToString to display
 * elements instead
 * @param {HtmlElement} ref
 * @returns updateTitle function
 */
export const useDropdownTitleFixer = (ref) => {
  const realRef = useRef(null);

  useEffect(() => {
    if (ref?.current) {
      realRef.current = ref.current;
    }
  }, [ref]);

  const updateTitle = useCallback(
    (title) => {
      if (title) {
        const className = `${prefix}--list-box__field`;
        const node = realRef.current.classList.contains(className)
          ? realRef.current
          : realRef.current.querySelector(`button.${prefix}--list-box__field`);
        setTimeout(() => {
          node.setAttribute('title', title);
        }, 10);
      }
    },
    [realRef]
  );

  return [realRef, updateTitle];
};
