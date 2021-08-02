import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { DocumentService } from 'carbon-components-angular';

import { TabHeader as IBMTabHeader } from 'carbon-components-angular/tabs';
import { Tab, TabAction } from './tab.interface';

@Component({
  selector: 'ai-tab-header',
  template: `
    <li
      [ngClass]="{
        'bx--tabs__nav-item--selected bx--tabs--scrollable__nav-item--selected': active,
        'bx--tabs__nav-item--disabled bx--tabs--scrollable__nav-item--disabled': disabled
      }"
      class="bx--tabs--scrollable__nav-item"
      role="presentation"
      (click)="selectTab()"
    >
      <div
        class="bx--tabs--scrollable__nav-link"
        #tabItem
        [attr.aria-selected]="active"
        draggable="false"
        [title]="title"
        [attr.tabindex]="active ? 0 : -1"
        role="tab"
      >
        <div class="ai--tabs--header_content">
          <ng-content></ng-content>
        </div>
        <ng-container *ngIf="tabAction">
          <button
            ibmButton="ghost"
            class="ai--tabs--header_action"
            [title]="tabAction.title"
            (click)="onActionClick(tabAction)"
          >
            <svg [ibmIcon]="tabAction.icon" size="16"></svg>
          </button>
        </ng-container>
        <ng-container *ngIf="tabActions">
          <button
            ibmButton="ghost"
            class="ai--tabs--header_action"
            (click)="onTabMenuClick($event)"
          >
            <svg ibmIcon="overflow-menu--vertical" size="16"></svg>
          </button>
          <ibm-context-menu [open]="menuOpen" [position]="menuPosition">
            <ibm-context-menu-item
              *ngFor="let action of tabActions"
              [label]="action.title"
              [icon]="action.icon"
              (click)="onActionClick(action)"
              (keydown.enter)="onActionClick(action)"
              (keydown.space)="onActionClick(action)"
            >
            </ibm-context-menu-item>
          </ibm-context-menu>
        </ng-container>
      </div>
    </li>
  `,
  styles: [
    `
      .bx--tabs--scrollable__nav-link {
        display: flex;
        align-items: end;
      }

      ::ng-deep .bx--tabs--scrollable .bx--tabs--scrollable__nav-link {
        padding: 0;
      }

      .ai--tabs--header_content {
        width: 100%;
        padding: 0.75rem 1rem 0.5rem;
      }

      .ai--tabs--header_action {
        padding: 0;
        min-height: 0;
        height: 1.5rem;
        width: 1.5rem;
        align-content: center;
        justify-content: center;
        margin-bottom: 0.3rem;
        margin-right: 0.5rem;
      }
    `,
  ],
  providers: [
    {
      provide: IBMTabHeader,
      useExisting: TabHeader,
    },
  ],
})
export class TabHeader extends IBMTabHeader implements OnChanges, AfterViewInit {
  @Input() tab: Tab;
  @Input() actions: TabAction[] = [];

  tabAction = null;
  tabActions = null;
  menuOpen = false;
  menuPosition = {
    top: 0,
    left: 0,
  };

  constructor(protected elementRef: ElementRef, protected documentService: DocumentService) {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    const actions = changes.actions?.currentValue;
    if (actions) {
      if (actions.length === 1) {
        this.tabAction = Object.assign(
          {},
          {
            title: '',
            icon: 'close',
            onClick: () => {},
          },
          actions[0]
        );
      } else if (actions.length > 1) {
        this.tabActions = actions.map((action) =>
          Object.assign(
            {},
            {
              title: '',
              icon: '',
              onClick: () => {},
            },
            action
          )
        );
      }
    }
  }

  ngAfterViewInit() {
    this.documentService.handleClick((event) => {
      const { nativeElement }: { nativeElement: HTMLElement } = this.elementRef;
      if (this.menuOpen && !nativeElement.contains(event.target as HTMLElement)) {
        this.menuOpen = false;
      }
    });
  }

  onActionClick(action: TabAction) {
    action.onClick(this.tab);
    this.menuOpen = false;
  }

  onTabMenuClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const button = target.closest('button');
    const buttonRect = button.getBoundingClientRect();
    const menuRect = button.parentElement
      .querySelector('.bx--context-menu')
      .getBoundingClientRect();
    this.menuOpen = !this.menuOpen;
    this.menuPosition = {
      top: buttonRect.top + buttonRect.height,
      left: buttonRect.right - menuRect.width,
    };
  }
}
