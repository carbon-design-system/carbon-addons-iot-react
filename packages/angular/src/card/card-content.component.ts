import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
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
export class CardContentComponent implements OnInit, AfterViewInit {
  @HostBinding('class.iot--card--content') contentClass = true;
  @HostBinding('class.iot--card--content--expanded') expandedClass = false;
  /**
   * expects string | TemplateRef<any>
   */
  @Input() emptyText: any;
  @Input() isEmpty = false;

  constructor(protected cardService: CardService, protected elementRef: ElementRef) {}

  ngOnInit() {
    this.cardService.onExpand((value) => {
      this.expandedClass = value;
    });
  }

  ngAfterViewInit() {
    const hostElement: HTMLElement = this.elementRef.nativeElement;
    hostElement.style.setProperty('--card-content-height', this.cardService.getContentHeight());
  }

  public isTemplate(value) {
    return value instanceof TemplateRef;
  }
}
