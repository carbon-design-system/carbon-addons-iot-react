import { NgModule } from '@angular/core';

import {
  ButtonModule,
  DialogModule,
  IconModule,
  IconService,
  ModalModule,
  TableModule,
} from 'carbon-components-angular';
import { ListBuilderModule } from '@ai-apps/angular/list-builder';

import { CommonModule } from '@angular/common';
import { AITableHeadCell } from './head/table-head-cell.component';
import { AITableHeadComponent } from './head/table-head.component';
import { AITableComponent } from './table.component';
import { AITableBody } from './body/table-body.component';
import { AITableRowComponent } from './body/table-row.component';
import { ColumnCustomizationModal } from './column-customization/column-customization-modal.component';
import { ColumnCustomizationButton } from './column-customization/column-customization-button.component';

import ArrowsVertical16 from '@carbon/icons/es/arrows--vertical/16';
import ArrowDown16 from '@carbon/icons/es/arrow--down/16';
import Filter16 from '@carbon/icons/es/filter/16';
import Reset16 from '@carbon/icons/es/reset/16';

@NgModule({
  declarations: [
    ColumnCustomizationButton,
    ColumnCustomizationModal,
    AITableComponent,
    AITableBody,
    AITableHeadComponent,
    AITableHeadCell,
    AITableRowComponent,
  ],
  imports: [
    DialogModule,
    ButtonModule,
    CommonModule,
    ListBuilderModule,
    ModalModule,
    TableModule,
    IconModule,
  ],
  exports: [
    ColumnCustomizationButton,
    ColumnCustomizationModal,
    AITableComponent,
    AITableBody,
    AITableHeadComponent,
    AITableHeadCell,
    AITableRowComponent,
  ],
  entryComponents: [ColumnCustomizationModal],
})
export class AITableModule {
  constructor(protected iconService: IconService) {
    iconService.registerAll([ArrowsVertical16, ArrowDown16, Filter16, Reset16]);
  }
}
