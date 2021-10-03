import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmptyStateComponent } from './empty-state.component';
import { AIIconsModule } from '@ai-apps/angular/icons';

@NgModule({
  declarations: [EmptyStateComponent],
  exports: [EmptyStateComponent],
  imports: [CommonModule, AIIconsModule],
})
export class EmptyStateModule {}
