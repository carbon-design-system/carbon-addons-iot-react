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
import { FlyoutMenuFooter } from './flyout-menu-footer.component';

@NgModule({
  declarations: [FlyoutMenu, FlyoutMenuPane, FlyoutMenuDirective, FlyoutMenuFooter],
  exports: [FlyoutMenu, FlyoutMenuPane, FlyoutMenuDirective, FlyoutMenuFooter],
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
