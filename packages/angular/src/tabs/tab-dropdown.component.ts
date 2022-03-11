import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { DocumentService, DropdownList, DropdownService } from 'carbon-components-angular';
import { map } from 'rxjs/operators';
import { TabController } from './tab-controller.class';

@Component({
  selector: 'ai-tab-dropdown',
  template: `
    <button aiTabAction #dropdownButton (click)="toggleMenu()">
      <svg class="bx--btn__icon" ibmIcon="chevron--down" size="16"></svg>
    </button>
    <div style="display: none;" class="dropdown-menu bx--list-box--expanded" #dropdownMenu>
      <ibm-dropdown-list [items]="displayItems" (select)="onSelect($event)" [listTpl]="listTpl">
      </ibm-dropdown-list>
    </div>
  `,
  providers: [DropdownService],
})
export class TabDropdownComponent implements OnInit, OnDestroy {
  @Input() controller: TabController;
  /**
   * Template to bind to items in the `DropdownList` (optional).
   * `DropdownList` items generated from the `Tab` items are passed in as context.
   * Additional props can included in the generation of the `DropdownList` items through
   * the `dropdownListProps` field in the `Tab`s.
   *
   * For example:
   *
   * controller = new TabController([
   *  {
   *    title: 'One',
   *    dropdownListProps: {
   *      icon: 'settings'
   *    }
   *  }
   * ]);
   *
   * // List items are passed in as context in the form "{item: item}" so the let-<your_var_name>="item" is necessary
   * <ng-template #listTpl let-item="item">
   *  <svg *ngIf="item.icon" [ibmIcon]="item.icon" size="16"></svg>
   *  {{ item.content }}
   * </ng-template>
   *
   * <ai-tabs [controller]="controller" [titleTpl]="titleTpl">
   *  <ai-tab-actions>
   *    <ai-tab-dropdown [controller]="controller" [listTpl]="listTpl"></ai-tab-dropdown>
   *  </ai-tab-actions>
   * </ai-tabs>
   */
  @Input() listTpl: TemplateRef<any> = null;
  @ViewChild('dropdownMenu', { static: true }) dropdownMenu: ElementRef;
  @ViewChild('dropdownButton', { static: true }) dropdownButton: ElementRef;
  @ViewChild(DropdownList) dropdownList: DropdownList;
  isOpen = false;
  displayItems: any;

  constructor(
    protected dropdownService: DropdownService,
    protected elementRef: ElementRef,
    protected documentService: DocumentService
  ) {}

  ngOnInit() {
    // TODO: update dropdown service to handle menus fixed to the right side of the trigger
    this.dropdownService.offset = {
      /**
       * 105 = 210 / 2 the dropdown service will center the menu and
       * then align it to the left edge of the trigger element
       */
      left: 105,
    };

    this.documentService.handleClick((event) => {
      const hostElement = this.elementRef.nativeElement as HTMLElement;
      const menuElement = this.dropdownMenu.nativeElement as HTMLElement;
      const target = event.target as Node;
      if (this.isOpen && !hostElement.contains(target) && !menuElement.contains(target)) {
        this.closeMenu();
      }
    });

    this.displayItems = this.controller.tabListWithSelection.pipe(
      map((list) => {
        return list.map((item) => ({
          content: item.title,
          key: item.key,
          selected: item.selected,
          ...item.dropdownListProps,
        }));
      })
    );
  }

  onSelect(event) {
    if (!event.isUpdate) {
      this.controller.selectTab(event.item.key);
      this.closeMenu();
    }
  }

  toggleMenu() {
    if (!this.isOpen) {
      this.openMenu();
    } else {
      this.closeMenu();
    }
  }

  openMenu() {
    this.isOpen = true;
    const wrapper: HTMLElement = this.dropdownService.appendToBody(
      this.dropdownButton.nativeElement,
      this.dropdownMenu.nativeElement,
      ''
    );
    wrapper.style.width = '250px';
    this.dropdownList.initFocus();
  }

  closeMenu() {
    this.isOpen = false;
    this.dropdownService.appendToDropdown(this.elementRef.nativeElement);
  }

  ngOnDestroy() {
    this.closeMenu();
  }
}
