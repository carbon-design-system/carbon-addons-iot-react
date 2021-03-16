import { NgModule } from '@angular/core';

import { BreadcrumbModule } from 'carbon-components-angular';

import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from './page-header.component';

@NgModule({
  declarations: [PageHeaderComponent],
  imports: [CommonModule, BreadcrumbModule],
  exports: [PageHeaderComponent],
})
export class PageHeaderModule {}
