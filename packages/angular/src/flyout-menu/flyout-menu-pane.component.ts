import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Optional,
  Output,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import {
  AnimationFrameService,
  CloseMeta,
  closestAttr,
  Dialog,
  ElementService,
  position,
} from 'carbon-components-angular';
import { I18n } from 'carbon-components-angular/i18n';

/**
 * The Filter menu component encapsulates the OverFlowMenu directive, and the flyout iconography
 * into one convienent component
 *
 * [See demo](../../?path=/story/components-flyout-menu--basic)
 *
 * html:
 * ```
 * <ai-flyout-menu-pane>
 *	options
 * </ai-flyout-menu-pane>
 * ```
 */
@Component({
  selector: 'ai-flyout-menu-pane',
  template: `
    <div
      #dialog
      [id]="dialogConfig.compID"
      [attr.role]="role"
      [attr.data-floating-menu-direction]="dialogConfig.placement"
      class="bx--tooltip bx--tooltip--shown iot--flyout-menu--body"
      [ngClass]="{
        'iot--flyout-menu--body__bottom-start': position === 'bottom-start',
        'iot--flyout-menu--body__bottom-end': position === 'bottom-end',
        'iot--flyout-menu--body__top-start': position === 'top-start',
        'iot--flyout-menu--body__top-end': position === 'top-end',
        'iot--flyout-menu--body__left-start': position === 'left-start',
        'iot--flyout-menu--body__left-end': position === 'left-end',
        'iot--flyout-menu--body__right-start': position === 'right-start',
        'iot--flyout-menu--body__right-end': position === 'right-end',
        'iot--flyout-menu--body__light': light,
        'iot--flyout-menu--body__open': open
      }"
    >
      <ng-template
        *ngIf="hasContentTemplate"
        [ngTemplateOutlet]="contentTemplate"
        [ngTemplateOutletContext]="{ tooltip: this }"
      >
      </ng-template>
      <p *ngIf="!hasContentTemplate">
        {{ dialogConfig.content }}
      </p>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class FlyoutMenuPane extends Dialog {
  /**
   * This specifies any vertical and horizontal offset for the position of the dialog
   */
  @Input() set offset(os: { x: number; y: number }) {
    this._offset = os;
  }
  get offset(): { x: number; y: number } {
    if (!this._offset) {
      return { x: (this.dialogConfig.flip ? -1 : 1) * 4, y: 0 };
    }
    return this._offset;
  }
  public hasContentTemplate = true;
  public get contentTemplate() {
    return this.dialogConfig.content as TemplateRef<any>;
  }
  /**
   * Sets the role of the tooltip. If there's no focusable content we leave it as a `tooltip`,
   * if there _is_ focusable content we switch to the interactive `dialog` role.
   */
  public role = 'tooltip';
  @Input() buttonLabel = this.i18n.get().OVERFLOW_MENU.OVERFLOW;

  @Input() light = false;

  get position() {
    return `${this.dialogConfig.placement}-${this.dialogConfig.flip ? 'end' : 'start'}`;
  }

  @Input() open = true;

  @Output() openChange = new EventEmitter<boolean>();

  private _offset;

  constructor(
    protected elementRef: ElementRef,
    protected elementService: ElementService,
    protected i18n: I18n,
    @Optional() protected animationFrameService: AnimationFrameService = null
  ) {
    super(elementRef, elementService, animationFrameService);
  }

  shouldClose = (meta: CloseMeta) => {
    return !this.dialog.nativeElement.contains(meta.target);
  };

  handleOpenChange(event: boolean) {
    this.open = event;
    this.openChange.emit(event);
  }

  onDialogInit() {
    const chevronWidth = 16;
    const chevronHeight = 14;
    const borderWidth = 2;

    const positionOverflowMenuVertically = (pos) => {
      let offset;
      const closestRel = closestAttr(
        'position',
        ['relative', 'fixed', 'absolute'],
        this.elementRef.nativeElement
      );
      let topFix =
        (closestRel ? closestRel.getBoundingClientRect().top * -1 : 0) -
        chevronHeight / 2 +
        1 * borderWidth;
      const leftFix = closestRel ? closestRel.getBoundingClientRect().left * -1 : 0;

      if (this.dialogConfig.placement === 'top') {
        topFix += chevronHeight / 2;
      }

      /*
       * 20 is half the width of the overflow menu trigger element.
       * we also move the element by half of it's own width, since
       * position service will try and center everything
       */
      offset = Math.round(this.dialog.nativeElement.offsetWidth / 2) - 20 - chevronWidth / 2;
      if (this.dialogConfig.flip) {
        return position.addOffset(pos, topFix, -offset + leftFix);
      }
      return position.addOffset(pos, topFix, offset + leftFix);
    };

    this.addGap['bottom'] = positionOverflowMenuVertically;
    this.addGap['top'] = positionOverflowMenuVertically;

    const positionOverflowMenuHorizontally = (pos) => {
      const adjustedOffset = this.getAdjustOffset();
      const topFix =
        (this.dialog.nativeElement.offsetHeight -
          this.dialogConfig.parentRef.nativeElement.offsetHeight -
          borderWidth) /
        2;
      let leftFix = (this.dialogConfig.placement === 'right' ? 1 : -1) * borderWidth;
      if (this.dialogConfig.placement === 'right') {
        leftFix -= chevronWidth / 2;
      }
      if (this.dialogConfig.flip) {
        return position.addOffset(
          pos,
          -5 + adjustedOffset.top - topFix,
          adjustedOffset.left + leftFix + chevronWidth / 2
        );
      }
      return position.addOffset(
        pos,
        -3 + adjustedOffset.top + topFix,
        adjustedOffset.left + leftFix
      );
    };

    this.addGap['left'] = positionOverflowMenuHorizontally;
    this.addGap['right'] = positionOverflowMenuHorizontally;

    if (!this.dialogConfig.menuLabel) {
      this.dialogConfig.menuLabel = this.i18n.get().OVERFLOW_MENU.OVERFLOW;
    }
  }

  getAdjustOffset() {
    const closestWithPos = closestAttr(
      'position',
      ['relative', 'fixed', 'absolute'],
      this.elementRef.nativeElement.parentElement
    );
    const topPos = closestWithPos ? closestWithPos.getBoundingClientRect().top * -1 : 0;
    const leftPos = closestWithPos ? closestWithPos.getBoundingClientRect().left * -1 : 0;

    return { top: topPos, left: leftPos };
  }
}
