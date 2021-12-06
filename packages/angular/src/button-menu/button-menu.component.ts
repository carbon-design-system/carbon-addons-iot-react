import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { DocumentService } from 'carbon-components-angular';

@Component({
  selector: 'ai-button-menu',
  template: `
    <div
      [ngClass]="{
        'iot--menu-button--open': open
      }"
      class="iot--menu-button"
    >
      <ng-container *ngIf="!split && !iconOnly">
        <button
          ibmButton="primary"
          class="iot--menu-button__primary iot--menu-button__trigger"
          (click)="toggleMenu()"
        >
          {{ label }}
          <svg *ngIf="!open" class="bx--btn__icon" [ibmIcon]="openIcon" size="16"></svg>
          <svg *ngIf="open" class="bx--btn__icon" [ibmIcon]="closeIcon" size="16"></svg>
        </button>
      </ng-container>
      <ng-container *ngIf="split && !iconOnly">
        <button
          *ngIf="!iconOnly"
          ibmButton="primary"
          class="iot--menu-button__primary"
          (click)="primaryClick.emit($event)"
        >
          {{ label }}
        </button>
        <button
          ibmButton="primary"
          [iconOnly]="true"
          [hasAssistiveText]="iconOnly && !!label"
          class="iot--menu-button__secondary iot--menu-button__trigger"
          (click)="toggleMenu()"
        >
          <svg *ngIf="!open" class="bx--btn__icon" [ibmIcon]="openIcon" size="16"></svg>
          <svg *ngIf="open" class="bx--btn__icon" [ibmIcon]="closeIcon" size="16"></svg>
        </button>
      </ng-container>
      <ng-container *ngIf="iconOnly && !split">
        <button
          ibmButton="ghost"
          [iconOnly]="true"
          [hasAssistiveText]="iconOnly && !!label"
          class="iot--menu-button__secondary"
          (click)="toggleMenu()"
        >
          <svg *ngIf="!open" class="bx--btn__icon" [ibmIcon]="openIcon" size="16"></svg>
          <svg *ngIf="open" class="bx--btn__icon" [ibmIcon]="closeIcon" size="16"></svg>
          <span *ngIf="label" class="bx--assistive-text">{{ label }}</span>
        </button>
      </ng-container>
      <ibm-context-menu [open]="open" [position]="position">
        <ng-content></ng-content>
      </ibm-context-menu>
    </div>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }

      .iot--menu-button {
        display: inline-block;
      }

      .bx--btn__icon {
        pointer-events: none;
      }
    `,
  ],
})
export class ButtonMenuComponent implements AfterViewInit {
  @Input() label = '';
  @Input() open = false;
  @Input() openIcon = 'chevron--down';
  @Input() closeIcon = 'chevron--up';
  @Input() iconOnly = false;
  @Input() split = false;
  @Input() alignMenu: 'left' | 'right' = 'left';
  @Input() placeMenu: 'top' | 'bottom' = 'bottom';
  @Output() openChange = new EventEmitter<boolean>();
  @Output() primaryClick = new EventEmitter<MouseEvent>();

  public position = {
    top: 0,
    left: 0,
  };

  constructor(protected elementRef: ElementRef, protected documentService: DocumentService) {}

  ngAfterViewInit() {
    const { nativeElement }: { nativeElement: HTMLElement } = this.elementRef;
    const menuElement: HTMLElement = nativeElement.querySelector('.bx--context-menu, .bx--menu');
    const dimensions = nativeElement.getBoundingClientRect();
    const menuDimensions = menuElement.getBoundingClientRect();
    // default placement (align left, place bottom)
    let left = dimensions.left;
    let top = dimensions.top + dimensions.height;

    if (this.alignMenu === 'right') {
      left = dimensions.right - menuDimensions.width;
    }

    if (this.placeMenu === 'top') {
      top = dimensions.top - menuDimensions.height;
    }

    this.position = { top, left };

    this.documentService.handleClick((event) => {
      const { nativeElement }: { nativeElement: HTMLElement } = this.elementRef;
      if (this.open && !nativeElement.contains(event.target as HTMLElement)) {
        this.toggleMenu();
      }
    });
  }

  toggleMenu() {
    this.open = !this.open;
    this.openChange.emit(this.open);
  }

  @HostListener('keyup', ['$event'])
  handleKeys(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.open) {
      this.toggleMenu();
      const element = this.elementRef.nativeElement as HTMLElement;
      let button: HTMLElement = element.querySelector('.iot--menu-button__primary');
      if (this.split || this.iconOnly) {
        button = element.querySelector('.iot--menu-button__secondary');
      }
      button.focus();
    }
  }
}
