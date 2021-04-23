import { Component, Input, OnInit } from '@angular/core';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { ButtonModule, DialogModule, IconModule, IconService, PlaceholderModule } from 'carbon-components-angular';
import { Filter16 } from '@carbon/icons';

import { FilterMenuModule } from './filter-menu.module';

@Component({
  selector: 'ai-filter-menu-component',
  template: `
    <div>
      <ai-filter-menu [flip]="flip">
        Columns
        <button ibmButton="secondary" cancelButton>Cancel</button>
        <button ibmButton applyButton>Apply</button>
      </ai-filter-menu>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam venenatis neque vulputate iaculis eleifend.
        Nam rutrum nisl purus, in cursus tortor posuere id. Nam facilisis neque vel erat pellentesque facilisis. Nunc
        semper posuere est, et faucibus elit placerat at. Mauris finibus tempor erat in ultrices. Aenean dolor nisi,
        mollis ut viverra ac, tempor ut arcu. Nulla eros ex, lobortis eu nulla nec, tincidunt iaculis nisi. In ligula
        dui, sollicitudin fermentum blandit id, egestas non tellus. Praesent elementum arcu malesuada, maximus augue
        quis, aliquam mi.
      </p>

      <p>
        Proin aliquet dignissim ligula, nec condimentum tellus accumsan a. Curabitur porttitor turpis at hendrerit
        tincidunt. Ut nisi tellus, tristique id pulvinar eget, finibus et libero. Integer at porta diam. Interdum et
        malesuada fames ac ante ipsum primis in faucibus. Nunc non dolor vel nisi eleifend porta. Fusce non condimentum
        ante. Proin euismod ex nibh, imperdiet mollis nibh laoreet in. Pellentesque semper sem in eros vestibulum
        egestas. Integer id nunc sit amet libero rutrum varius id vel ligula. Etiam in metus efficitur ex ornare
        fringilla sed vel purus. Maecenas at dolor sem.
      </p>
    </div>
  `,
})
class StoryCustomComponent implements OnInit {
  @Input() flip = false;

  constructor(protected iconService: IconService) {}

	ngOnInit() {
		this.iconService.register(Filter16);
	}
}

storiesOf('Components/Filter menu', module)
  .addDecorator(
    moduleMetadata({
      declarations: [StoryCustomComponent],
      imports: [
        ButtonModule,
        DialogModule,
				PlaceholderModule,
        FilterMenuModule,
        IconModule,
        FilterMenuModule
      ],
      entryComponents: [StoryCustomComponent],
    })
  )
  .addDecorator(withKnobs)
  .add('Basic', () => ({
    template: `
      <ai-filter-menu-component [flip]="flip"></ai-filter-menu-component>
      <ibm-placeholder></ibm-placeholder>
    `,
    props: {
      flip: boolean('flip', false)
    },
  }));
