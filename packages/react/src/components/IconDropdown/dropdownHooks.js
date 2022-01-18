import { useCallback, useRef } from 'react';

import { settings } from '../../constants/Settings';

const { prefix } = settings;

/**
 * hacky work-around to set the title on Dropdowns that are overriding itemToString to display
 * elements instead
 * @returns updateTitle function
 */
export const useDropdownTitleFixer = () => {
  const ref = useRef(null);

  const updateTitle = useCallback(
    (title) => {
      if (title) {
        const className = `${prefix}--list-box__field`;
        const node = ref.current.classList.contains(className)
          ? ref.current
          : ref.current.querySelector(`button.${prefix}--list-box__field`);
        setTimeout(() => {
          node.setAttribute('title', title);
        }, 10);
      }
    },
    [ref]
  );

  return [ref, updateTitle];
};
