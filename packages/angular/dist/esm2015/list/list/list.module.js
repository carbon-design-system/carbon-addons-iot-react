/**
 *
 * @ai-apps/angular v2.155.1 | list.module.js
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


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxModule, IconModule, SearchModule } from 'carbon-components-angular';
import { AIListComponent } from './ai-list.component';
import { AIListHeaderComponent } from './list-header/ai-list-header.component';
import { AIListItemComponent } from './list-item/ai-list-item.component';
import { AIListTargetDirective } from './list-item/ai-list-target.directive';
import { AIListItemWrapperComponent } from './list-item/ai-list-item-wrapper.component';
export { AIListItem } from './list-item/ai-list-item.class';
export class ListModule {
}
ListModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    AIListHeaderComponent,
                    AIListItemComponent,
                    AIListItemWrapperComponent,
                    AIListComponent,
                    AIListTargetDirective,
                ],
                exports: [
                    AIListHeaderComponent,
                    AIListItemComponent,
                    AIListItemWrapperComponent,
                    AIListComponent,
                    AIListTargetDirective,
                ],
                imports: [CommonModule, IconModule, CheckboxModule, SearchModule],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGlzdC9saXN0Lm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUUvQyxPQUFPLEVBQUUsY0FBYyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNyRixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDdEQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDL0UsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDekUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDN0UsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFFeEYsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBbUI1RCxNQUFNLE9BQU8sVUFBVTs7O1lBakJ0QixRQUFRLFNBQUM7Z0JBQ1IsWUFBWSxFQUFFO29CQUNaLHFCQUFxQjtvQkFDckIsbUJBQW1CO29CQUNuQiwwQkFBMEI7b0JBQzFCLGVBQWU7b0JBQ2YscUJBQXFCO2lCQUN0QjtnQkFDRCxPQUFPLEVBQUU7b0JBQ1AscUJBQXFCO29CQUNyQixtQkFBbUI7b0JBQ25CLDBCQUEwQjtvQkFDMUIsZUFBZTtvQkFDZixxQkFBcUI7aUJBQ3RCO2dCQUNELE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLFlBQVksQ0FBQzthQUNsRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5pbXBvcnQgeyBDaGVja2JveE1vZHVsZSwgSWNvbk1vZHVsZSwgU2VhcmNoTW9kdWxlIH0gZnJvbSAnY2FyYm9uLWNvbXBvbmVudHMtYW5ndWxhcic7XG5pbXBvcnQgeyBBSUxpc3RDb21wb25lbnQgfSBmcm9tICcuL2FpLWxpc3QuY29tcG9uZW50JztcbmltcG9ydCB7IEFJTGlzdEhlYWRlckNvbXBvbmVudCB9IGZyb20gJy4vbGlzdC1oZWFkZXIvYWktbGlzdC1oZWFkZXIuY29tcG9uZW50JztcbmltcG9ydCB7IEFJTGlzdEl0ZW1Db21wb25lbnQgfSBmcm9tICcuL2xpc3QtaXRlbS9haS1saXN0LWl0ZW0uY29tcG9uZW50JztcbmltcG9ydCB7IEFJTGlzdFRhcmdldERpcmVjdGl2ZSB9IGZyb20gJy4vbGlzdC1pdGVtL2FpLWxpc3QtdGFyZ2V0LmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBBSUxpc3RJdGVtV3JhcHBlckNvbXBvbmVudCB9IGZyb20gJy4vbGlzdC1pdGVtL2FpLWxpc3QtaXRlbS13cmFwcGVyLmNvbXBvbmVudCc7XG5cbmV4cG9ydCB7IEFJTGlzdEl0ZW0gfSBmcm9tICcuL2xpc3QtaXRlbS9haS1saXN0LWl0ZW0uY2xhc3MnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBBSUxpc3RIZWFkZXJDb21wb25lbnQsXG4gICAgQUlMaXN0SXRlbUNvbXBvbmVudCxcbiAgICBBSUxpc3RJdGVtV3JhcHBlckNvbXBvbmVudCxcbiAgICBBSUxpc3RDb21wb25lbnQsXG4gICAgQUlMaXN0VGFyZ2V0RGlyZWN0aXZlLFxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgQUlMaXN0SGVhZGVyQ29tcG9uZW50LFxuICAgIEFJTGlzdEl0ZW1Db21wb25lbnQsXG4gICAgQUlMaXN0SXRlbVdyYXBwZXJDb21wb25lbnQsXG4gICAgQUlMaXN0Q29tcG9uZW50LFxuICAgIEFJTGlzdFRhcmdldERpcmVjdGl2ZSxcbiAgXSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgSWNvbk1vZHVsZSwgQ2hlY2tib3hNb2R1bGUsIFNlYXJjaE1vZHVsZV0sXG59KVxuZXhwb3J0IGNsYXNzIExpc3RNb2R1bGUge31cbiJdfQ==