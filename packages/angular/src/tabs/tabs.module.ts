import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ButtonModule,
  DropdownModule,
  IconModule,
  TabsModule as CTabsModule,
  UtilsModule,
} from 'carbon-components-angular';
import { TabComponent } from './tab.component';
import { TabsComponent } from './tabs.component';
import { TabDropdownComponent } from './tab-dropdown.component';
import { TabActionDirective } from './tab-action.directive';
import { TabActionsComponent } from './tab-actions.component';
import { TabHeader } from './tab-header.component';
import { ContextMenuModule } from 'carbon-components-angular/context-menu';

@NgModule({
  declarations: [
    TabsComponent,
    TabComponent,
    TabDropdownComponent,
    TabActionsComponent,
    TabActionDirective,
    TabHeader,
  ],
  imports: [
    CommonModule,
    CTabsModule,
    IconModule,
    DropdownModule,
    ButtonModule,
    UtilsModule,
    ContextMenuModule,
  ],
  exports: [
    TabsComponent,
    TabComponent,
    TabDropdownComponent,
    TabActionsComponent,
    TabActionDirective,
    TabHeader,
  ],
})
export class TabsModule {}
