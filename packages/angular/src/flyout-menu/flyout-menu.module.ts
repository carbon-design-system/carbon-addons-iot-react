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

import { FlyoutMenu } from './flyout-menu.component';
import { FlyoutMenuPane } from './flyout-menu-pane.component';
import { FlyoutMenuDirective } from './flyout-menu.directive';

@NgModule({
  declarations: [FlyoutMenu, FlyoutMenuPane, FlyoutMenuDirective],
  exports: [FlyoutMenu, FlyoutMenuPane, FlyoutMenuDirective],
  providers: [DialogService],
  entryComponents: [FlyoutMenuPane],
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
export class FlyoutMenuModule {}
