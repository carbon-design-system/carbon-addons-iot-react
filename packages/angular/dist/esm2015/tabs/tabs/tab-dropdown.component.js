/**
 *
 * @ai-apps/angular v2.155.1 | tab-dropdown.component.js
 *
 * Copyright 2014, 2025 IBM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


import { Component, ElementRef, Input, TemplateRef, ViewChild, } from '@angular/core';
import { DocumentService, DropdownList, DropdownService } from 'carbon-components-angular';
import { map } from 'rxjs/operators';
import { TabController } from './tab-controller.class';
export class TabDropdownComponent {
    constructor(dropdownService, elementRef, documentService) {
        this.dropdownService = dropdownService;
        this.elementRef = elementRef;
        this.documentService = documentService;
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
        this.listTpl = null;
        this.isOpen = false;
    }
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
            const hostElement = this.elementRef.nativeElement;
            const menuElement = this.dropdownMenu.nativeElement;
            const target = event.target;
            if (this.isOpen && !hostElement.contains(target) && !menuElement.contains(target)) {
                this.closeMenu();
            }
        });
        this.displayItems = this.controller.tabListWithSelection.pipe(map((list) => {
            return list.map((item) => (Object.assign({ content: item.title, key: item.key, selected: item.selected }, item.dropdownListProps)));
        }));
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
        }
        else {
            this.closeMenu();
        }
    }
    openMenu() {
        this.isOpen = true;
        const wrapper = this.dropdownService.appendToBody(this.dropdownButton.nativeElement, this.dropdownMenu.nativeElement, '');
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
TabDropdownComponent.decorators = [
    { type: Component, args: [{
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
                providers: [DropdownService]
            },] }
];
TabDropdownComponent.ctorParameters = () => [
    { type: DropdownService },
    { type: ElementRef },
    { type: DocumentService }
];
TabDropdownComponent.propDecorators = {
    controller: [{ type: Input }],
    listTpl: [{ type: Input }],
    dropdownMenu: [{ type: ViewChild, args: ['dropdownMenu', { static: true },] }],
    dropdownButton: [{ type: ViewChild, args: ['dropdownButton', { static: true },] }],
    dropdownList: [{ type: ViewChild, args: [DropdownList,] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLWRyb3Bkb3duLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy90YWJzL3RhYi1kcm9wZG93bi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsS0FBSyxFQUdMLFdBQVcsRUFDWCxTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGVBQWUsRUFBRSxZQUFZLEVBQUUsZUFBZSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDM0YsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3JDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQWV2RCxNQUFNLE9BQU8sb0JBQW9CO0lBc0MvQixZQUNZLGVBQWdDLEVBQ2hDLFVBQXNCLEVBQ3RCLGVBQWdDO1FBRmhDLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUNoQyxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ3RCLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQXZDNUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7V0E0Qkc7UUFDTSxZQUFPLEdBQXFCLElBQUksQ0FBQztRQUkxQyxXQUFNLEdBQUcsS0FBSyxDQUFDO0lBT1osQ0FBQztJQUVKLFFBQVE7UUFDTix1RkFBdUY7UUFDdkYsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEdBQUc7WUFDNUI7OztlQUdHO1lBQ0gsSUFBSSxFQUFFLEdBQUc7U0FDVixDQUFDO1FBRUYsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUN6QyxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQTRCLENBQUM7WUFDakUsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUE0QixDQUFDO1lBQ25FLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFjLENBQUM7WUFDcEMsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQ2pGLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQzthQUNsQjtRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FDM0QsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDWCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLGlCQUN4QixPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFDbkIsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQ2IsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLElBQ3BCLElBQUksQ0FBQyxpQkFBaUIsRUFDekIsQ0FBQyxDQUFDO1FBQ04sQ0FBQyxDQUFDLENBQ0gsQ0FBQztJQUNKLENBQUM7SUFFRCxRQUFRLENBQUMsS0FBSztRQUNaLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFO1lBQ25CLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDMUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1NBQ2xCO0lBQ0gsQ0FBQztJQUVELFVBQVU7UUFDUixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNoQixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDakI7YUFBTTtZQUNMLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztTQUNsQjtJQUNILENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDbkIsTUFBTSxPQUFPLEdBQWdCLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUM1RCxJQUFJLENBQUMsY0FBYyxDQUFDLGFBQWEsRUFDakMsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQy9CLEVBQUUsQ0FDSCxDQUFDO1FBQ0YsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDO1FBQzlCLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDaEMsQ0FBQztJQUVELFNBQVM7UUFDUCxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNwQixJQUFJLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDbkIsQ0FBQzs7O1lBekhGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsaUJBQWlCO2dCQUMzQixRQUFRLEVBQUU7Ozs7Ozs7O0dBUVQ7Z0JBQ0QsU0FBUyxFQUFFLENBQUMsZUFBZSxDQUFDO2FBQzdCOzs7WUFoQnVDLGVBQWU7WUFQckQsVUFBVTtZQU9ILGVBQWU7Ozt5QkFrQnJCLEtBQUs7c0JBOEJMLEtBQUs7MkJBQ0wsU0FBUyxTQUFDLGNBQWMsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7NkJBQzFDLFNBQVMsU0FBQyxnQkFBZ0IsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7MkJBQzVDLFNBQVMsU0FBQyxZQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q2hpbGQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRG9jdW1lbnRTZXJ2aWNlLCBEcm9wZG93bkxpc3QsIERyb3Bkb3duU2VydmljZSB9IGZyb20gJ2NhcmJvbi1jb21wb25lbnRzLWFuZ3VsYXInO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgVGFiQ29udHJvbGxlciB9IGZyb20gJy4vdGFiLWNvbnRyb2xsZXIuY2xhc3MnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhaS10YWItZHJvcGRvd24nLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxidXR0b24gYWlUYWJBY3Rpb24gI2Ryb3Bkb3duQnV0dG9uIChjbGljayk9XCJ0b2dnbGVNZW51KClcIj5cbiAgICAgIDxzdmcgY2xhc3M9XCJieC0tYnRuX19pY29uXCIgaWJtSWNvbj1cImNoZXZyb24tLWRvd25cIiBzaXplPVwiMTZcIj48L3N2Zz5cbiAgICA8L2J1dHRvbj5cbiAgICA8ZGl2IHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIiBjbGFzcz1cImRyb3Bkb3duLW1lbnUgYngtLWxpc3QtYm94LS1leHBhbmRlZFwiICNkcm9wZG93bk1lbnU+XG4gICAgICA8aWJtLWRyb3Bkb3duLWxpc3QgW2l0ZW1zXT1cImRpc3BsYXlJdGVtc1wiIChzZWxlY3QpPVwib25TZWxlY3QoJGV2ZW50KVwiIFtsaXN0VHBsXT1cImxpc3RUcGxcIj5cbiAgICAgIDwvaWJtLWRyb3Bkb3duLWxpc3Q+XG4gICAgPC9kaXY+XG4gIGAsXG4gIHByb3ZpZGVyczogW0Ryb3Bkb3duU2VydmljZV0sXG59KVxuZXhwb3J0IGNsYXNzIFRhYkRyb3Bkb3duQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICBASW5wdXQoKSBjb250cm9sbGVyOiBUYWJDb250cm9sbGVyO1xuICAvKipcbiAgICogVGVtcGxhdGUgdG8gYmluZCB0byBpdGVtcyBpbiB0aGUgYERyb3Bkb3duTGlzdGAgKG9wdGlvbmFsKS5cbiAgICogYERyb3Bkb3duTGlzdGAgaXRlbXMgZ2VuZXJhdGVkIGZyb20gdGhlIGBUYWJgIGl0ZW1zIGFyZSBwYXNzZWQgaW4gYXMgY29udGV4dC5cbiAgICogQWRkaXRpb25hbCBwcm9wcyBjYW4gaW5jbHVkZWQgaW4gdGhlIGdlbmVyYXRpb24gb2YgdGhlIGBEcm9wZG93bkxpc3RgIGl0ZW1zIHRocm91Z2hcbiAgICogdGhlIGBkcm9wZG93bkxpc3RQcm9wc2AgZmllbGQgaW4gdGhlIGBUYWJgcy5cbiAgICpcbiAgICogRm9yIGV4YW1wbGU6XG4gICAqXG4gICAqIGNvbnRyb2xsZXIgPSBuZXcgVGFiQ29udHJvbGxlcihbXG4gICAqICB7XG4gICAqICAgIHRpdGxlOiAnT25lJyxcbiAgICogICAgZHJvcGRvd25MaXN0UHJvcHM6IHtcbiAgICogICAgICBpY29uOiAnc2V0dGluZ3MnXG4gICAqICAgIH1cbiAgICogIH1cbiAgICogXSk7XG4gICAqXG4gICAqIC8vIExpc3QgaXRlbXMgYXJlIHBhc3NlZCBpbiBhcyBjb250ZXh0IGluIHRoZSBmb3JtIFwie2l0ZW06IGl0ZW19XCIgc28gdGhlIGxldC08eW91cl92YXJfbmFtZT49XCJpdGVtXCIgaXMgbmVjZXNzYXJ5XG4gICAqIDxuZy10ZW1wbGF0ZSAjbGlzdFRwbCBsZXQtaXRlbT1cIml0ZW1cIj5cbiAgICogIDxzdmcgKm5nSWY9XCJpdGVtLmljb25cIiBbaWJtSWNvbl09XCJpdGVtLmljb25cIiBzaXplPVwiMTZcIj48L3N2Zz5cbiAgICogIHt7IGl0ZW0uY29udGVudCB9fVxuICAgKiA8L25nLXRlbXBsYXRlPlxuICAgKlxuICAgKiA8YWktdGFicyBbY29udHJvbGxlcl09XCJjb250cm9sbGVyXCIgW3RpdGxlVHBsXT1cInRpdGxlVHBsXCI+XG4gICAqICA8YWktdGFiLWFjdGlvbnM+XG4gICAqICAgIDxhaS10YWItZHJvcGRvd24gW2NvbnRyb2xsZXJdPVwiY29udHJvbGxlclwiIFtsaXN0VHBsXT1cImxpc3RUcGxcIj48L2FpLXRhYi1kcm9wZG93bj5cbiAgICogIDwvYWktdGFiLWFjdGlvbnM+XG4gICAqIDwvYWktdGFicz5cbiAgICovXG4gIEBJbnB1dCgpIGxpc3RUcGw6IFRlbXBsYXRlUmVmPGFueT4gPSBudWxsO1xuICBAVmlld0NoaWxkKCdkcm9wZG93bk1lbnUnLCB7IHN0YXRpYzogdHJ1ZSB9KSBkcm9wZG93bk1lbnU6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ2Ryb3Bkb3duQnV0dG9uJywgeyBzdGF0aWM6IHRydWUgfSkgZHJvcGRvd25CdXR0b246IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoRHJvcGRvd25MaXN0KSBkcm9wZG93bkxpc3Q6IERyb3Bkb3duTGlzdDtcbiAgaXNPcGVuID0gZmFsc2U7XG4gIGRpc3BsYXlJdGVtczogYW55O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBkcm9wZG93blNlcnZpY2U6IERyb3Bkb3duU2VydmljZSxcbiAgICBwcm90ZWN0ZWQgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBwcm90ZWN0ZWQgZG9jdW1lbnRTZXJ2aWNlOiBEb2N1bWVudFNlcnZpY2VcbiAgKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIC8vIFRPRE86IHVwZGF0ZSBkcm9wZG93biBzZXJ2aWNlIHRvIGhhbmRsZSBtZW51cyBmaXhlZCB0byB0aGUgcmlnaHQgc2lkZSBvZiB0aGUgdHJpZ2dlclxuICAgIHRoaXMuZHJvcGRvd25TZXJ2aWNlLm9mZnNldCA9IHtcbiAgICAgIC8qKlxuICAgICAgICogMTA1ID0gMjEwIC8gMiB0aGUgZHJvcGRvd24gc2VydmljZSB3aWxsIGNlbnRlciB0aGUgbWVudSBhbmRcbiAgICAgICAqIHRoZW4gYWxpZ24gaXQgdG8gdGhlIGxlZnQgZWRnZSBvZiB0aGUgdHJpZ2dlciBlbGVtZW50XG4gICAgICAgKi9cbiAgICAgIGxlZnQ6IDEwNSxcbiAgICB9O1xuXG4gICAgdGhpcy5kb2N1bWVudFNlcnZpY2UuaGFuZGxlQ2xpY2soKGV2ZW50KSA9PiB7XG4gICAgICBjb25zdCBob3N0RWxlbWVudCA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50O1xuICAgICAgY29uc3QgbWVudUVsZW1lbnQgPSB0aGlzLmRyb3Bkb3duTWVudS5uYXRpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50O1xuICAgICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IGFzIE5vZGU7XG4gICAgICBpZiAodGhpcy5pc09wZW4gJiYgIWhvc3RFbGVtZW50LmNvbnRhaW5zKHRhcmdldCkgJiYgIW1lbnVFbGVtZW50LmNvbnRhaW5zKHRhcmdldCkpIHtcbiAgICAgICAgdGhpcy5jbG9zZU1lbnUoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuZGlzcGxheUl0ZW1zID0gdGhpcy5jb250cm9sbGVyLnRhYkxpc3RXaXRoU2VsZWN0aW9uLnBpcGUoXG4gICAgICBtYXAoKGxpc3QpID0+IHtcbiAgICAgICAgcmV0dXJuIGxpc3QubWFwKChpdGVtKSA9PiAoe1xuICAgICAgICAgIGNvbnRlbnQ6IGl0ZW0udGl0bGUsXG4gICAgICAgICAga2V5OiBpdGVtLmtleSxcbiAgICAgICAgICBzZWxlY3RlZDogaXRlbS5zZWxlY3RlZCxcbiAgICAgICAgICAuLi5pdGVtLmRyb3Bkb3duTGlzdFByb3BzLFxuICAgICAgICB9KSk7XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBvblNlbGVjdChldmVudCkge1xuICAgIGlmICghZXZlbnQuaXNVcGRhdGUpIHtcbiAgICAgIHRoaXMuY29udHJvbGxlci5zZWxlY3RUYWIoZXZlbnQuaXRlbS5rZXkpO1xuICAgICAgdGhpcy5jbG9zZU1lbnUoKTtcbiAgICB9XG4gIH1cblxuICB0b2dnbGVNZW51KCkge1xuICAgIGlmICghdGhpcy5pc09wZW4pIHtcbiAgICAgIHRoaXMub3Blbk1lbnUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jbG9zZU1lbnUoKTtcbiAgICB9XG4gIH1cblxuICBvcGVuTWVudSgpIHtcbiAgICB0aGlzLmlzT3BlbiA9IHRydWU7XG4gICAgY29uc3Qgd3JhcHBlcjogSFRNTEVsZW1lbnQgPSB0aGlzLmRyb3Bkb3duU2VydmljZS5hcHBlbmRUb0JvZHkoXG4gICAgICB0aGlzLmRyb3Bkb3duQnV0dG9uLm5hdGl2ZUVsZW1lbnQsXG4gICAgICB0aGlzLmRyb3Bkb3duTWVudS5uYXRpdmVFbGVtZW50LFxuICAgICAgJydcbiAgICApO1xuICAgIHdyYXBwZXIuc3R5bGUud2lkdGggPSAnMjUwcHgnO1xuICAgIHRoaXMuZHJvcGRvd25MaXN0LmluaXRGb2N1cygpO1xuICB9XG5cbiAgY2xvc2VNZW51KCkge1xuICAgIHRoaXMuaXNPcGVuID0gZmFsc2U7XG4gICAgdGhpcy5kcm9wZG93blNlcnZpY2UuYXBwZW5kVG9Ecm9wZG93bih0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmNsb3NlTWVudSgpO1xuICB9XG59XG4iXX0=