/**
 *
 * @ai-apps/angular v2.155.1 | card-header.component.js
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


import { Component, HostBinding } from '@angular/core';
export class CardHeaderComponent {
    constructor() {
        this.hostClass = 'true';
    }
}
CardHeaderComponent.decorators = [
    { type: Component, args: [{
                selector: 'ai-card-header',
                template: ` <ng-content></ng-content> `
            },] }
];
CardHeaderComponent.propDecorators = {
    hostClass: [{ type: HostBinding, args: ['class.iot--card--header',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC1oZWFkZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NhcmQvY2FyZC1oZWFkZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBTXZELE1BQU0sT0FBTyxtQkFBbUI7SUFKaEM7UUFLMEMsY0FBUyxHQUFHLE1BQU0sQ0FBQztJQUM3RCxDQUFDOzs7WUFOQSxTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjtnQkFDMUIsUUFBUSxFQUFFLDZCQUE2QjthQUN4Qzs7O3dCQUVFLFdBQVcsU0FBQyx5QkFBeUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEhvc3RCaW5kaW5nIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FpLWNhcmQtaGVhZGVyJyxcbiAgdGVtcGxhdGU6IGAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PiBgLFxufSlcbmV4cG9ydCBjbGFzcyBDYXJkSGVhZGVyQ29tcG9uZW50IHtcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pb3QtLWNhcmQtLWhlYWRlcicpIGhvc3RDbGFzcyA9ICd0cnVlJztcbn1cbiJdfQ==