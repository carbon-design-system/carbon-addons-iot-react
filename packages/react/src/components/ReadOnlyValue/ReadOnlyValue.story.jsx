import React from 'react';

import ReadOnlyValueREADME from './ReadOnlyValue.mdx';
import ReadOnlyValue from './ReadOnlyValue';

export default {
  title: '1 - Watson IoT/ReadOnlyValue',
  parameters: {
    component: ReadOnlyValue,
    docs: {
      page: ReadOnlyValueREADME,
    },
  },
};

export const Basic = () => (
  <div style={{ width: '100%', heigh: 'calc(100vh - 100px)' }}>
    <ReadOnlyValue label="Label" value="input value" />
  </div>
);

Basic.storyName = 'basic stacked';

export const MultipleValuesStacked = () => (
  <div style={{ width: '100%', height: 'calc(100vh - 100px)' }}>
    <ReadOnlyValue label="Label 01" value="input value 01" type="stacked" />
    <ReadOnlyValue label="Label 02" value="input value 02" type="stacked" />
    <ReadOnlyValue label="Label 03" value="input value 03" type="stacked" />
    <ReadOnlyValue label="Label 04" value="input value 04" type="stacked" />
  </div>
);

MultipleValuesStacked.storyName = 'multiple values - stacked';

export const BasicInline = () => (
  <div style={{ width: '100%', height: 'calc(100vh - 100px)' }}>
    <ReadOnlyValue label="Label" value="input value" type="inline" />
  </div>
);

BasicInline.storyName = 'basic inline';

export const MultipleValuesInline = () => (
  <div style={{ width: '100%', height: 'calc(100vh - 100px)' }}>
    <ReadOnlyValue label="Label 01" value="input value 01" type="inline" />
    <ReadOnlyValue label="Label 02" value="input value 02" type="inline" />
    <ReadOnlyValue label="Label 03" value="input value 03" type="inline" />
    <ReadOnlyValue label="Label 04" value="input value 04" type="inline" />
  </div>
);

MultipleValuesInline.storyName = 'multiple values - inline';

export const MultipleValuesLongLabelInline = () => (
  <div style={{ width: '100%', height: 'calc(100vh - 100px)' }}>
    <ReadOnlyValue label="Label bigger label" value="input value 01" type="inline" />
    <ReadOnlyValue label="Label 02" value="input value 02" type="inline" />
    <ReadOnlyValue label="Label 03" value="input value 03" type="inline" />
    <ReadOnlyValue label="Label 04" value="input value 04" type="inline" />
  </div>
);

MultipleValuesLongLabelInline.storyName = 'multiple values - inline with long label';
