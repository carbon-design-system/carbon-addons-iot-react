import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckboxModule, IconModule, SearchModule } from 'carbon-components-angular';
import { AIListComponent } from './ai-list.component';
import { AIListItemComponent } from './list-item/ai-list-item.component';
import { AIListTargetDirective } from './list-item/ai-list-target.directive';

export { AIListModel } from './ai-list-model.class';
export { AIListItem } from './list-item/ai-list-item.interface';

@NgModule({
  declarations: [AIListItemComponent, AIListComponent, AIListTargetDirective],
  exports: [AIListItemComponent, AIListComponent, AIListTargetDirective],
  imports: [CommonModule, IconModule, CheckboxModule, SearchModule],
})
export class ListModule {}
