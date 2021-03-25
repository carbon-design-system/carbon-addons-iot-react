import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  ButtonModule,
  CheckboxModule,
  DialogModule,
  ModalModule,
  RadioModule,
  TabsModule,
} from 'carbon-components-angular';
import { SortableListComponent } from '../sortable-list/sortable-list.component';
import { SortableListModule } from '../sortable-list/sortable-list.module';
import { UtilsModule } from '../utils/index';
import { CheckboxSettingComponent } from './settings/checkbox-setting.component';
import { RadioSettingComponent } from './settings/radio-setting.component';
import { TableSettingsModalComponent } from './table-settings-modal.component';
import { TableSettingsService } from './table-settings.service';

@NgModule({
  declarations: [TableSettingsModalComponent, CheckboxSettingComponent, RadioSettingComponent],
  exports: [TableSettingsModalComponent, CheckboxSettingComponent, RadioSettingComponent],
  providers: [TableSettingsService],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    SortableListModule,
    ModalModule,
    ButtonModule,
    DialogModule,
    UtilsModule,
    TabsModule,
    CheckboxModule,
    RadioModule,
  ],
  entryComponents: [SortableListComponent, CheckboxSettingComponent, RadioSettingComponent],
})
export class TableSettingsModule {}
