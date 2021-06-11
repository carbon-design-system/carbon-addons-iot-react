import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListComponent } from './list.component';
import { ListHeaderComponent } from './list-header.component';
import { ListItemComponent } from './list-item.component';
import { CheckboxModule, IconModule, SearchModule } from 'carbon-components-angular';

export { ListModel } from './list-model.class';
export { ListItem } from './list-item.class';

@NgModule({
  declarations: [ListComponent, ListHeaderComponent, ListItemComponent],
  exports: [ListComponent, ListHeaderComponent, ListItemComponent],
  imports: [CommonModule, IconModule, CheckboxModule, SearchModule],
})
export class ListModule {}
