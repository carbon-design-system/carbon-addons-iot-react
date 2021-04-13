import { storiesOf, moduleMetadata } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';

import { TabsModule } from './tabs.module';
import { TabController } from './tab-controller.class';

storiesOf('Components/Button', module)
  .addDecorator(
    moduleMetadata({
      imports: [TabsModule],
    })
  )
  .addDecorator(withKnobs)
  .add('Basic', () => ({
    template: `
      <ai-tabs [tabController]="controller">
        <ai-tab key="one" title="First tab"></ai-tab>
        <ai-tab key="two" title="Second tab"></ai-tab>
      </ai-tabs>

      <div [aiTabContent]="controller" key="one"></div>
      <div [aiTabContent]="controller" key="two"></div>
    `,
    props: {
      controller: new TabController()
    }
  }));
