import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentOutletDirective } from './component-outlet.directive';

@NgModule({
  declarations: [ComponentOutletDirective],
  exports: [ComponentOutletDirective],
  imports: [CommonModule],
})
export class UtilsModule {}
