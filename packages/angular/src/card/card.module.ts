import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardContentComponent } from './card-content.component';
import { CardHeaderComponent } from './card-header.component';
import { CardTitleComponent } from './card-title.component';
import { CardToolbarActionDirective } from './card-toolbar-action.directive';
import { CardToolbarComponent } from './card-toolbar.component';
import { CardComponent } from './card.component';
import { IconModule } from 'carbon-components-angular';

@NgModule({
  declarations: [
    CardContentComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardToolbarActionDirective,
    CardToolbarComponent,
    CardComponent
  ],
  exports: [
    CardContentComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardToolbarActionDirective,
    CardToolbarComponent,
    CardComponent
  ],
  imports: [CommonModule, IconModule],
})
export class CardModule {}
