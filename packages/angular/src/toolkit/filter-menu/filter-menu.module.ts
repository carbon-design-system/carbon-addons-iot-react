// modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// imports
import {
  ButtonModule,
  PlaceholderModule,
  DialogService,
  DialogModule,
  LinkModule,
  IconModule,
  I18nModule,
} from 'carbon-components-angular';

import { FilterMenu } from './filter-menu.component';

@NgModule({
  declarations: [FilterMenu],
  exports: [FilterMenu],
  providers: [DialogService],
  entryComponents: [],
  imports: [
    ButtonModule,
    CommonModule,
    I18nModule,
    PlaceholderModule,
    DialogModule,
    IconModule,
    LinkModule,
  ],
})
export class FilterMenuModule {}
