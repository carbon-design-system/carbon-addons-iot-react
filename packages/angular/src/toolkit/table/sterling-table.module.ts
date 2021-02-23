import { NgModule } from '@angular/core';

import {
	ButtonModule,
	DialogModule,
	TableModule
} from 'carbon-components-angular';

import { CommonModule } from '@angular/common';
import { SCTableHeadCell } from './head/sterling-table-head-cell.component';
import { SCTableHeadComponent } from './head/sterling-table-head.component';
import { SCTableComponent } from './sterling-table.component';

@NgModule({
	declarations: [
		SCTableComponent,
		SCTableHeadComponent,
		SCTableHeadCell
	],
	imports: [
		DialogModule,
		ButtonModule,
		CommonModule,
		TableModule
	],
	exports: [
		SCTableComponent,
		SCTableHeadComponent,
		SCTableHeadCell
	]
})
export class SCTableModule {}
