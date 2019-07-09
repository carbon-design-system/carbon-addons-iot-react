import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import SecondaryNavigator from './SecondaryNavigator';

const commonProps = {
  selectedId: 'section-1',
  onSelectionChange: action('onSelectionChange'),
  items: [
    {
      id: 'section-1',
      label: 'Section 1',
      content: (
        <div>
          <h1>Section 1 Content</h1>
          <p>Paragraph with more content for section 1</p>
        </div>
      ),
    },
    {
      id: 'section-2',
      label: 'Section 2',
      content: (
        <div>
          <h1>Section 2 Content</h1>
          <table>
            <thead>
              <tr>
                <th>X</th>
                <th>Y</th>
                <th>Z</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>2</td>
                <td>3</td>
              </tr>
              <tr>
                <td>-1</td>
                <td>0.4</td>
                <td>2.5</td>
              </tr>
              <tr>
                <td>0.3</td>
                <td>1.4</td>
                <td>-6.5</td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
    },
    {
      id: 'section-3',
      label: 'Section 3',
      content: (
        <div>
          <h1>Section 3 Content</h1>
          <input type="button" value="Click me!" />
        </div>
      ),
    },
  ],
};

storiesOf('SecondaryNavigator (Experimental)', module).add('normal', () => (
  <SecondaryNavigator {...commonProps} />
));
