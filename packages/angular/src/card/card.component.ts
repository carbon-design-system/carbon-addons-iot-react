import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  Optional,
  SimpleChanges,
  SkipSelf,
} from '@angular/core';
import { CardService } from './card.service';

/**
 * Provider for `CardService` that lets us either use a service provided to us
 * by the parent injector, or fall back to a new instance for this component tree.
 */
const CARD_SERVICE_PROVIDER = {
  provide: CardService,
  deps: [[new Optional(), new SkipSelf(), CardService]],
  useFactory: (parentCardService: CardService) => {
    return parentCardService || new CardService();
  },
};

@Component({
  selector: 'ai-card',
  template: `
    <ng-template #content>
      <ng-content></ng-content>
    </ng-template>
    <ng-container *ngIf="!expanded" [ngTemplateOutlet]="content"></ng-container>
    <div *ngIf="expanded" class="bx--modal is-visible">
      <div class="iot--card iot--card--wrapper expanded">
        <ng-container [ngTemplateOutlet]="content"></ng-container>
      </div>
    </div>
  `,
  providers: [CARD_SERVICE_PROVIDER],
  styles: [
    `
      .expanded {
        height: calc(100% - 50px);
        width: calc(100% - 50px);
      }
    `,
  ],
})
export class CardComponent implements OnChanges, AfterViewInit {
  @Input() defaultHeight: number = null;
  @Input() expanded = false;
  @HostBinding('class.iot--card') cardClass = true;
  @HostBinding('class.iot--card--wrapper') wrapperClass = true;
  @HostBinding('class.iot--card--wrapper__selected') @Input() selected = false;
  @HostBinding('attr.role') role = 'presentation';

  constructor(protected cardService: CardService, protected elementRef: ElementRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.expanded) {
      this.cardService.setExpanded(changes.expanded.currentValue);
    }
  }

  ngAfterViewInit() {
    if (this.defaultHeight) {
      this.cardService.setCardHeight(this.defaultHeight);
    }
    const hostElement: HTMLElement = this.elementRef.nativeElement;
    hostElement.style.setProperty('--card-default-height', this.cardService.getCardHeight());
  }
}
