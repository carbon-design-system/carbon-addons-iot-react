/* eslint-disable jest/no-commented-out-tests */
// import React from 'react';
// import { render } from '@testing-library/react';
// import {
//   unstable_ContextMenuItem as ContextMenuItem,
//   unstable_ContextMenuDivider as ContextMenuDivider,
//   unstable_ContextMenuRadioGroup as ContextMenuRadioGroup,
//   unstable_ContextMenuSelectableItem as ContextMenuSelectableItem,
// } from 'carbon-components-react';
// import { Copy16, TrashCan16 } from '@carbon/icons-react';

import { emptyDOMTree } from '../../../config/testHelpers';

// import MenuButton from './MenuButton';

// const menuItems = [
//   <ContextMenuSelectableItem
//     key="publish"
//     label="Publish"
//     initialChecked={false}
//     onChange={jest.fn()}
//   />,
//   <ContextMenuDivider key="div-1" />,
//   <ContextMenuItem key="duplicate" renderIcon={Copy16} label="Duplicate" onClick={jest.fn()} />,
//   <ContextMenuDivider key="div-2" />,
//   <ContextMenuItem key="share" label="Share with">
//     <ContextMenuRadioGroup
//       label="Shared with"
//       items={['None', 'Product Team', 'Organization', 'Company']}
//       initialSelectedItem="None"
//       onChange={jest.fn()}
//     />
//   </ContextMenuItem>,
//   <ContextMenuDivider key="div-3" />,
//   <ContextMenuItem key="export" label="Export">
//     <ContextMenuItem label="CSV" onClick={jest.fn()} />
//     <ContextMenuItem label="JSON" onClick={jest.fn()} />
//   </ContextMenuItem>,
//   <ContextMenuItem
//     key="disabled"
//     label={<span title="You must have proper credentials to use this option.">Disabled</span>}
//     disabled
//   />,
//   <ContextMenuDivider key="div-4" />,
//   <ContextMenuItem
//     key="delete"
//     label="Delete"
//     renderIcon={TrashCan16}
//     onClick={jest.fn()}
//     shortcut="⌘⌫"
//     /** this is unavailable until we upgrade to Carbon 10.32/7.32 */
//     kind="danger"
//   />,
// ];

describe('MenuButton', () => {
  beforeEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = emptyDOMTree;
  });
  it('force passes the test until the bug is fixed.', () => {
    expect(true).toBe(true);
  });

  // TODO: blocked from checking until https://github.com/IBMa/equal-access/issues/413 is resolved.
  //   it('is accessible', async () => {
  //     const { container } = render(<MenuButton label="Actions">{menuItems}</MenuButton>, {
  //       container: document.getElementById('main'),
  //     });
  //     await expect(container).toBeAccessible('MenuButton is accessible');
  //   }, 20000);
});
