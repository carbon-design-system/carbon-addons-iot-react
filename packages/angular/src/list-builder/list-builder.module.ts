import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListModule } from '@ai-apps/angular/list';
import { AIListBuilderComponent } from './list-builder.component';
import { ButtonModule, IconModule } from 'carbon-components-angular';

export { AIListBuilderModel, AIListBuilderItem } from './list-builder-model.class';

@NgModule({
  declarations: [AIListBuilderComponent],
  exports: [AIListBuilderComponent],
  imports: [ButtonModule, CommonModule, ListModule, IconModule],
})
export class ListBuilderModule {}
