import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  Input,
  TemplateRef,
} from '@angular/core';
import { CardService } from './card.service';

@Component({
  selector: 'ai-card-content',
  template: `
    <ng-content></ng-content>
    <div *ngIf="isEmpty" class="iot--card--empty-message-wrapper">
      <ng-container *ngIf="!isTemplate(emptyText)">{{ emptyText }}</ng-container>
      <ng-template *ngIf="isTemplate(emptyText)" [ngTemplateOutlet]="emptyText"></ng-template>
    </div>
  `,
})
export class CardContentComponent implements AfterViewInit {
  @HostBinding('class.iot--card--content') contentClass = true;
  @Input() emptyText: string | TemplateRef<any>;
  @Input() isEmpty = false;

  constructor(protected cardService: CardService, protected elementRef: ElementRef) {}

  ngAfterViewInit() {
    const hostElement: HTMLElement = this.elementRef.nativeElement;
    hostElement.style.setProperty('--card-default-height', this.cardService.getContentHeight());
  }

  public isTemplate(value) {
    return value instanceof TemplateRef;
  }
}
