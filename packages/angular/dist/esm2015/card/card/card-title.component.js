/**
 *
 * @ai-apps/angular v2.155.1 | card-title.component.js
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


import { Component, HostBinding, Input } from '@angular/core';
export class CardTitleComponent {
    constructor() {
        this.text = '';
        this.hostClass = true;
    }
}
CardTitleComponent.decorators = [
    { type: Component, args: [{
                selector: 'ai-card-title',
                template: `
    <div class="iot--card--title--text" [attr.title]="text">
      {{ text }}
    </div>
    <ng-content></ng-content>
  `
            },] }
];
CardTitleComponent.propDecorators = {
    text: [{ type: Input }],
    hostClass: [{ type: HostBinding, args: ['class.iot--card--title',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC10aXRsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY2FyZC9jYXJkLXRpdGxlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFXOUQsTUFBTSxPQUFPLGtCQUFrQjtJQVQvQjtRQVVXLFNBQUksR0FBRyxFQUFFLENBQUM7UUFDb0IsY0FBUyxHQUFHLElBQUksQ0FBQztJQUMxRCxDQUFDOzs7WUFaQSxTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGVBQWU7Z0JBQ3pCLFFBQVEsRUFBRTs7Ozs7R0FLVDthQUNGOzs7bUJBRUUsS0FBSzt3QkFDTCxXQUFXLFNBQUMsd0JBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBIb3N0QmluZGluZywgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWktY2FyZC10aXRsZScsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBjbGFzcz1cImlvdC0tY2FyZC0tdGl0bGUtLXRleHRcIiBbYXR0ci50aXRsZV09XCJ0ZXh0XCI+XG4gICAgICB7eyB0ZXh0IH19XG4gICAgPC9kaXY+XG4gICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICBgLFxufSlcbmV4cG9ydCBjbGFzcyBDYXJkVGl0bGVDb21wb25lbnQge1xuICBASW5wdXQoKSB0ZXh0ID0gJyc7XG4gIEBIb3N0QmluZGluZygnY2xhc3MuaW90LS1jYXJkLS10aXRsZScpIGhvc3RDbGFzcyA9IHRydWU7XG59XG4iXX0=