import {
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { CloseMeta, OverflowMenuDirective } from 'carbon-components-angular';
import { I18n } from 'carbon-components-angular/i18n';

/**
 * The Filter menu component encapsulates the OverFlowMenu directive, and the filter iconography
 * into one convienent component
 *
 * [See demo](../../?path=/story/components-filter-menu--basic)
 *
 * html:
 * ```
 * <ai-filter-menu>
 *	options
 * </ai-filter-menu>
 * ```
 *
 * <example-url>../../iframe.html?id=components-filter-menu--basic</example-url>
 */
@Component({
  selector: 'ai-filter-menu',
  template: `
		<button
			[ibmOverflowMenu]="templateRef"
			[ngClass]="{'bx--overflow-menu--open': open}"
			class="bx--overflow-menu {{triggerClass}}"
			[attr.aria-label]="buttonLabel"
			[flip]="flip"
      [customPane]="true"
			[isOpen]="open"
			(isOpenChange)="handleOpenChange($event)"
			[offset]="offset"
			[wrapperClass]="wrapperClass"
			aria-haspopup="true"
			class="bx--overflow-menu"
			type="button"
      [shouldClose]="shouldClose"
			[placement]="placement">
			<ng-template *ngIf="customTrigger; else defaultIcon" [ngTemplateOutlet]="customTrigger"></ng-template>
		</button>
		<ng-template #templateRef>
			<div class="pane-content" #paneContentRef>
        <div class="title">
          {{title}}
          <a ibmLink (click)="clearFilterClicked($event)" class="clear-filter" href="#">{{clearFilterText}}</a>
        </div>
        <ng-content></ng-content>
      </div>
      <div class="filter-actions">
        <ng-content select="[cancelButton]"></ng-content>
        <ng-content select="[applyButton]"></ng-content>
      </div>
		</ng-template>
		<ng-template #defaultIcon>
			<svg ibmIcon="filter" size="16" class="bx--overflow-menu__icon"></svg>
		</ng-template>
	`,
  styleUrls: ['./filter-menu.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FilterMenu {

  /**
   * This specifies any vertical and horizontal offset for the position of the dialog
   */
  @Input() set offset(os: { x: number, y: number }) {
    this._offset = os;
  }
  get offset(): { x: number, y: number } {
    if (!this._offset) {
      return { x: (this.flip ? -1 : 1) * 4, y: 0 };
    }
    return this._offset;
  }
  @Input() buttonLabel = this.i18n.get().OVERFLOW_MENU.OVERFLOW;

  @Input() flip = false;

  @Input() placement: 'bottom' | 'top' = 'bottom';

  @Input() open = false;

  @Output() openChange = new EventEmitter<boolean>();

  @Output() clearFilter = new EventEmitter();

  /**
   * Sets the custom overflow menu trigger
   */
  @Input() customTrigger: TemplateRef<any>;

  @Input() wrapperClass = '';

  /**
   * This appends additional classes to the overflow trigger/button.
   */
  @Input() triggerClass = '';

  @Input() title = 'Filter';
  @Input() clearFilterText = 'Clear filter';

  @ViewChild('paneContentRef', { static: false }) paneContentRef: ElementRef;

  // @ts-ignore
  @ContentChild(OverflowMenuDirective, { static: false }) overflowMenuDirective: OverflowMenuDirective;

  private _offset;

  constructor(protected elementRef: ElementRef, protected i18n: I18n) { }

  shouldClose = (meta: CloseMeta) => {
    return !this.paneContentRef.nativeElement.contains(meta.target);
  }

  handleOpenChange(event: boolean) {
    this.open = event;
    this.openChange.emit(event);
  }

  clearFilterClicked(event) {
    event.preventDefault();
    this.clearFilter.emit();
  }
}
