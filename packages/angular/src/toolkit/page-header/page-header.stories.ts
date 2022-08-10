import { moduleMetadata } from '@storybook/angular';
import { BreadcrumbItem } from 'carbon-components-angular';
import { itemsWithTitle } from './page-header.component';
import { PageHeaderModule } from './page-header.module';

const createBreadcrumbItems = (count: number, content = 'Breadcrumb'): BreadcrumbItem[] =>
  // fill(0) so we have something useful to map over
  Array(count)
    .fill(0)
    .map((x, i) => ({
      content: `${content} ${i + 1}`,
      href: '#' + (i + 1),
    }));

export default {
  title: 'Sterling Toolkit/Page header',

  decorators: [
    moduleMetadata({
      imports: [PageHeaderModule],
    })
  ],
  argTypes: {
    numberOfItems: {
      control: {
        type: 'number',
        min: 1
      },
      defaultValue: 3
    },
    items: {
      action: 'click',
      table: {
        disable: true
      }
    }
  }
};

const basicTpl = (args) => ({
  template: `
    <div class="container">
        <div class="bx--grid">
            <sc-page-header [items]="items()"></sc-page-header>
            <div class="bx--row">
                <div class="bx--col item">one</div>
                <div class="bx--col item">two</div>
            </div>
        </div>
    </div>
  `,
  styles: [
    `
      .container {
          background: #f4f4f4;
          height: 100vh;
      }

      .item {
          height: 300px;
          background: white;
          border: 1px dashed gray;
      }

      .item:nth-child(2) {
          border-left: none;
      }
    `,
  ],
  props: args,
  name: 'Basic'
});
export const basic = basicTpl.bind({});
basic.args = {
  items() {
    return itemsWithTitle(createBreadcrumbItems(this.numberOfItems), 'Hello world');
  }
};
