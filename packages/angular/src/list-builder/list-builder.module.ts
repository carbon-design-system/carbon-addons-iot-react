import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListModule } from '@ai-apps/angular/list';
import { ListBuilderComponent } from './list-builder.component';
import { ListBuilderListComponent } from './list-builder-list.component';
import { ButtonModule, IconModule } from 'carbon-components-angular';

export { ListBuilderItem } from './list-builder-item.class';
export * from './list-builder-utils';

@NgModule({
  declarations: [ListBuilderComponent, ListBuilderListComponent],
  exports: [ListBuilderComponent, ListBuilderListComponent],
  imports: [ButtonModule, CommonModule, ListModule, IconModule],
})
export class ListBuilderModule {}
