import React from 'react';
import { render } from '@testing-library/react';

import { emptyDOMTree } from '../../../config/testHelpers';

import {
  commonPageTitleBarProps,
  pageTitleBarBreadcrumb,
  PageTitleBarNodeTooltip,
} from './PageTitleBar.story';
import PageTitleBar from './PageTitleBar';

describe('PageTitleBar', () => {
  beforeEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = emptyDOMTree;
  });

  it('is accessible', async () => {
    const { container } = render(<PageTitleBar title={commonPageTitleBarProps.title} />, {
      container: document.getElementById('main'),
    });
    await expect(container).toBeAccessible('PageTitleBar is accessible');
  }, 20000);

  it('is accessible with breadcrumb', async () => {
    const { container } = render(
      <PageTitleBar title={commonPageTitleBarProps.title} breadcrumb={pageTitleBarBreadcrumb} />,
      {
        container: document.getElementById('main'),
      }
    );
    await expect(container).toBeAccessible('PageTitleBar is accessible with breadcrumb');
  }, 20000);

  it('is accessible with description', async () => {
    const { container } = render(
      <PageTitleBar
        title={commonPageTitleBarProps.title}
        description={commonPageTitleBarProps.description}
      />,
      {
        container: document.getElementById('main'),
      }
    );
    await expect(container).toBeAccessible('PageTitleBar is accessible with description');
  }, 20000);

  it('is accessible with tooltip description with node', async () => {
    const { container } = render(
      <PageTitleBar
        title={commonPageTitleBarProps.title}
        description={<PageTitleBarNodeTooltip />}
        breadcrumb={pageTitleBarBreadcrumb}
        collapsed
      />,
      {
        container: document.getElementById('main'),
      }
    );
    await expect(container).toBeAccessible(
      'PageTitleBar is accessible with tooltip description with node'
    );
  }, 20000);
});
