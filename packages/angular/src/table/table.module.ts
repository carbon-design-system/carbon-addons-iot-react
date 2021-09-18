import { NgModule } from '@angular/core';

import {
  ButtonModule,
  DialogModule,
  IconModule,
  IconService,
  ModalModule,
  TableModule,
} from 'carbon-components-angular';

import { CommonModule } from '@angular/common';
import { AITableHeadCell } from './head/table-head-cell.component';
import { AITableHeadComponent } from './head/table-head.component';
import { AITableComponent } from './table.component';

import ArrowsVertical16 from '@carbon/icons/es/arrows--vertical/16';
import ArrowDown16 from '@carbon/icons/es/arrow--down/16';
import Filter16 from '@carbon/icons/es/filter/16';
import { AIColumnCustomizationModal } from './column-customization/column-customization-modal.component';
import { ListBuilderModule } from '@ai-apps/angular/list-builder';
import { AIColumnCustomizationButton } from './column-customization/column-customization-button.component';

@NgModule({
  declarations: [
    AIColumnCustomizationButton,
    AIColumnCustomizationModal,
    AITableComponent,
    AITableHeadComponent,
    AITableHeadCell,
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
    AIColumnCustomizationButton,
    AIColumnCustomizationModal,
    AITableComponent,
    AITableHeadComponent,
    AITableHeadCell,
  ],
  entryComponents: [AIColumnCustomizationModal],
})
export class AITableModule {
  constructor(protected iconService: IconService) {
    iconService.registerAll([ArrowsVertical16, ArrowDown16, Filter16]);
  }
}
