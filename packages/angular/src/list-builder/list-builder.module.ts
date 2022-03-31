import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListModule } from '@ai-apps/angular/list';
import { AIListBuilderComponent } from './list-builder.component';
import { AIListBuilderListComponent } from './list-builder-list.component';
import { ButtonModule, IconModule } from 'carbon-components-angular';

export { AIListBuilderItem } from './list-builder-item.class';
export * from './list-builder-utils';

@NgModule({
  declarations: [AIListBuilderComponent, AIListBuilderListComponent],
  exports: [AIListBuilderComponent, AIListBuilderListComponent],
  imports: [ButtonModule, CommonModule, ListModule, IconModule],
})
export class AIListBuilderModule {}
