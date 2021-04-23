// modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// imports
import { I18nModule } from 'carbon-components-angular/i18n';
import { IconModule } from 'carbon-components-angular/icon';
import { PlaceholderModule, DialogService, DialogModule, LinkModule } from 'carbon-components-angular';

import { FilterMenu } from './filter-menu.component';

@NgModule({
  declarations: [
    FilterMenu
  ],
  exports: [
    FilterMenu
  ],
  providers: [DialogService],
  entryComponents: [
  ],
  imports: [
    CommonModule,
    I18nModule,
    PlaceholderModule,
    DialogModule,
    IconModule,
    LinkModule
  ]
})
export class FilterMenuModule { }
