import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListModule } from '@ai-apps/angular/list';
import { ListBuilderComponent } from './list-builder.component';
import { ButtonModule, IconModule } from 'carbon-components-angular';

export { ListBuilderItem } from './list-builder-item.class';

@NgModule({
  declarations: [ListBuilderComponent],
  exports: [ListBuilderComponent],
  imports: [ButtonModule, CommonModule, ListModule, IconModule],
})
export class ListBuilderModule {}
