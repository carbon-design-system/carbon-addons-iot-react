/**
 *
 * @ai-apps/angular v2.155.1 | button-menu.module.js
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


import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule, IconModule, IconService, UtilsModule } from 'carbon-components-angular';
import { ButtonMenuComponent } from './button-menu.component';
import { ContextMenuModule } from 'carbon-components-angular/context-menu';
import ChevronUp16 from '@carbon/icons/es/chevron--up/16';
export class ButtonMenuModule {
    constructor(iconService) {
        this.iconService = iconService;
        this.iconService.register(ChevronUp16);
    }
}
ButtonMenuModule.decorators = [
    { type: NgModule, args: [{
                declarations: [ButtonMenuComponent],
                exports: [ButtonMenuComponent],
                imports: [CommonModule, ButtonModule, IconModule, ContextMenuModule, UtilsModule],
            },] }
];
ButtonMenuModule.ctorParameters = () => [
    { type: IconService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLW1lbnUubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2J1dHRvbi1tZW51L2J1dHRvbi1tZW51Lm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDL0YsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDOUQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFFM0UsT0FBTyxXQUFXLE1BQU0saUNBQWlDLENBQUM7QUFPMUQsTUFBTSxPQUFPLGdCQUFnQjtJQUMzQixZQUFvQixXQUF3QjtRQUF4QixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUMxQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN6QyxDQUFDOzs7WUFSRixRQUFRLFNBQUM7Z0JBQ1IsWUFBWSxFQUFFLENBQUMsbUJBQW1CLENBQUM7Z0JBQ25DLE9BQU8sRUFBRSxDQUFDLG1CQUFtQixDQUFDO2dCQUM5QixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxXQUFXLENBQUM7YUFDbEY7OztZQVZrQyxXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCdXR0b25Nb2R1bGUsIEljb25Nb2R1bGUsIEljb25TZXJ2aWNlLCBVdGlsc01vZHVsZSB9IGZyb20gJ2NhcmJvbi1jb21wb25lbnRzLWFuZ3VsYXInO1xuaW1wb3J0IHsgQnV0dG9uTWVudUNvbXBvbmVudCB9IGZyb20gJy4vYnV0dG9uLW1lbnUuY29tcG9uZW50JztcbmltcG9ydCB7IENvbnRleHRNZW51TW9kdWxlIH0gZnJvbSAnY2FyYm9uLWNvbXBvbmVudHMtYW5ndWxhci9jb250ZXh0LW1lbnUnO1xuXG5pbXBvcnQgQ2hldnJvblVwMTYgZnJvbSAnQGNhcmJvbi9pY29ucy9lcy9jaGV2cm9uLS11cC8xNic7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW0J1dHRvbk1lbnVDb21wb25lbnRdLFxuICBleHBvcnRzOiBbQnV0dG9uTWVudUNvbXBvbmVudF0sXG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIEJ1dHRvbk1vZHVsZSwgSWNvbk1vZHVsZSwgQ29udGV4dE1lbnVNb2R1bGUsIFV0aWxzTW9kdWxlXSxcbn0pXG5leHBvcnQgY2xhc3MgQnV0dG9uTWVudU1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaWNvblNlcnZpY2U6IEljb25TZXJ2aWNlKSB7XG4gICAgdGhpcy5pY29uU2VydmljZS5yZWdpc3RlcihDaGV2cm9uVXAxNik7XG4gIH1cbn1cbiJdfQ==