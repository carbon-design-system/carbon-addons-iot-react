import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckboxModule, IconModule, SearchModule } from 'carbon-components-angular';
import { AIListComponent } from './ai-list.component';
import { AIListItemComponent } from './list-item/ai-list-item.component';

export { AIListModel } from './ai-list-model.class';
export { AIListItem } from './list-item/ai-list-item.interface';

@NgModule({
  declarations: [AIListItemComponent, AIListComponent],
  exports: [AIListItemComponent, AIListComponent],
  imports: [CommonModule, IconModule, CheckboxModule, SearchModule],
})
export class ListModule {}
