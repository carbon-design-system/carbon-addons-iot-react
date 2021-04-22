import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule, DropdownModule, IconModule, TabsModule as CTabsModule, UtilsModule } from 'carbon-components-angular';
import { TabContentDirective } from './tab-content.directive';
import { TabComponent } from './tab.component';
import { TabsComponent } from './tabs.component';
import { TabDropdownComponent } from './tab-dropdown.component';
import { TabActionDirective } from './tab-action.directive';
import { TabActionsComponent } from './tab-actions.component';

@NgModule({
  declarations: [
    TabsComponent,
    TabComponent,
    TabDropdownComponent,
    TabActionsComponent,
    TabActionDirective,
    TabContentDirective
  ],
  imports: [
    CommonModule,
    CTabsModule,
    IconModule,
    DropdownModule,
    ButtonModule,
    UtilsModule
  ],
  exports: [
    TabsComponent,
    TabComponent,
    TabDropdownComponent,
    TabActionsComponent,
    TabActionDirective,
    TabContentDirective
  ]
})
export class TabsModule { }
