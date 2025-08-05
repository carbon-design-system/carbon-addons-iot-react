/**
 *
 * @ai-apps/angular v2.155.1 | tab-action.directive.js
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


import { Directive, ElementRef } from '@angular/core';
import { Button } from 'carbon-components-angular';
export class TabActionDirective extends Button {
    constructor(elementRef) {
        super();
        this.elementRef = elementRef;
    }
    ngOnInit() {
        this.ibmButton = 'ghost';
        this.size = 'sm';
        this.iconOnly = true;
        const el = this.elementRef.nativeElement;
        el.style.width = '40px';
        el.style.height = '40px';
        el.style.justifyContent = 'center';
    }
}
TabActionDirective.decorators = [
    { type: Directive, args: [{
                selector: '[aiTabAction]',
            },] }
];
TabActionDirective.ctorParameters = () => [
    { type: ElementRef }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLWFjdGlvbi5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvdGFicy90YWItYWN0aW9uLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQWEsU0FBUyxFQUFFLFVBQVUsRUFBVSxNQUFNLGVBQWUsQ0FBQztBQUN6RSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFLbkQsTUFBTSxPQUFPLGtCQUFtQixTQUFRLE1BQU07SUFDNUMsWUFBc0IsVUFBc0I7UUFDMUMsS0FBSyxFQUFFLENBQUM7UUFEWSxlQUFVLEdBQVYsVUFBVSxDQUFZO0lBRTVDLENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7UUFDekIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDckIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUE0QixDQUFDO1FBQ3hELEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztRQUN4QixFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDekIsRUFBRSxDQUFDLEtBQUssQ0FBQyxjQUFjLEdBQUcsUUFBUSxDQUFDO0lBQ3JDLENBQUM7OztZQWhCRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGVBQWU7YUFDMUI7OztZQUw4QixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnY2FyYm9uLWNvbXBvbmVudHMtYW5ndWxhcic7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1thaVRhYkFjdGlvbl0nLFxufSlcbmV4cG9ydCBjbGFzcyBUYWJBY3Rpb25EaXJlY3RpdmUgZXh0ZW5kcyBCdXR0b24gaW1wbGVtZW50cyBPbkluaXQge1xuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgZWxlbWVudFJlZjogRWxlbWVudFJlZikge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmlibUJ1dHRvbiA9ICdnaG9zdCc7XG4gICAgdGhpcy5zaXplID0gJ3NtJztcbiAgICB0aGlzLmljb25Pbmx5ID0gdHJ1ZTtcbiAgICBjb25zdCBlbCA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50O1xuICAgIGVsLnN0eWxlLndpZHRoID0gJzQwcHgnO1xuICAgIGVsLnN0eWxlLmhlaWdodCA9ICc0MHB4JztcbiAgICBlbC5zdHlsZS5qdXN0aWZ5Q29udGVudCA9ICdjZW50ZXInO1xuICB9XG59XG4iXX0=