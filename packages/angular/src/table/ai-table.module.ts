import { NgModule } from '@angular/core';

import { ButtonModule, DialogModule, TableModule } from 'carbon-components-angular';

import { CommonModule } from '@angular/common';
import { AITableHeadCell } from './head/ai-table-head-cell.component';
import { AITableHeadComponent } from './head/ai-table-head.component';
import { AITableComponent } from './ai-table.component';
import { AITableBody } from './body/ai-table-body.component';
import { AITableRow } from './body/ai-table-row.component';

@NgModule({
  declarations: [
    AITableBody,
    AITableComponent,
    AITableHeadComponent,
    AITableHeadCell,
    AITableRow
  ],
  imports: [DialogModule, ButtonModule, CommonModule, TableModule],
  exports: [
    AITableBody,
    AITableComponent,
    AITableHeadComponent,
    AITableHeadCell,
    AITableRow
  ]
})
export class AITableModule {}
