/**
 *
 * @ai-apps/angular v2.155.1 | flyout-menu.module.js
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


// modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// imports
import { ButtonModule, PlaceholderModule, DialogService, DialogModule, LinkModule, IconModule, I18nModule, } from 'carbon-components-angular';
import { FlyoutMenu } from './flyout-menu.component';
import { FlyoutMenuPane } from './flyout-menu-pane.component';
import { FlyoutMenuDirective } from './flyout-menu.directive';
import { FlyoutMenuFooter } from './flyout-menu-footer.component';
export class FlyoutMenuModule {
}
FlyoutMenuModule.decorators = [
    { type: NgModule, args: [{
                declarations: [FlyoutMenu, FlyoutMenuPane, FlyoutMenuDirective, FlyoutMenuFooter],
                exports: [FlyoutMenu, FlyoutMenuPane, FlyoutMenuDirective, FlyoutMenuFooter],
                providers: [DialogService],
                entryComponents: [FlyoutMenuPane],
                imports: [
                    ButtonModule,
                    CommonModule,
                    I18nModule,
                    PlaceholderModule,
                    DialogModule,
                    IconModule,
                    LinkModule,
                ],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmx5b3V0LW1lbnUubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2ZseW91dC1tZW51L2ZseW91dC1tZW51Lm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxVQUFVO0FBQ1YsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFL0MsVUFBVTtBQUNWLE9BQU8sRUFDTCxZQUFZLEVBQ1osaUJBQWlCLEVBQ2pCLGFBQWEsRUFDYixZQUFZLEVBQ1osVUFBVSxFQUNWLFVBQVUsRUFDVixVQUFVLEdBQ1gsTUFBTSwyQkFBMkIsQ0FBQztBQUVuQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDckQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQzlELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQzlELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBaUJsRSxNQUFNLE9BQU8sZ0JBQWdCOzs7WUFmNUIsUUFBUSxTQUFDO2dCQUNSLFlBQVksRUFBRSxDQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUUsbUJBQW1CLEVBQUUsZ0JBQWdCLENBQUM7Z0JBQ2pGLE9BQU8sRUFBRSxDQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUUsbUJBQW1CLEVBQUUsZ0JBQWdCLENBQUM7Z0JBQzVFLFNBQVMsRUFBRSxDQUFDLGFBQWEsQ0FBQztnQkFDMUIsZUFBZSxFQUFFLENBQUMsY0FBYyxDQUFDO2dCQUNqQyxPQUFPLEVBQUU7b0JBQ1AsWUFBWTtvQkFDWixZQUFZO29CQUNaLFVBQVU7b0JBQ1YsaUJBQWlCO29CQUNqQixZQUFZO29CQUNaLFVBQVU7b0JBQ1YsVUFBVTtpQkFDWDthQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLy8gbW9kdWxlc1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbi8vIGltcG9ydHNcbmltcG9ydCB7XG4gIEJ1dHRvbk1vZHVsZSxcbiAgUGxhY2Vob2xkZXJNb2R1bGUsXG4gIERpYWxvZ1NlcnZpY2UsXG4gIERpYWxvZ01vZHVsZSxcbiAgTGlua01vZHVsZSxcbiAgSWNvbk1vZHVsZSxcbiAgSTE4bk1vZHVsZSxcbn0gZnJvbSAnY2FyYm9uLWNvbXBvbmVudHMtYW5ndWxhcic7XG5cbmltcG9ydCB7IEZseW91dE1lbnUgfSBmcm9tICcuL2ZseW91dC1tZW51LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBGbHlvdXRNZW51UGFuZSB9IGZyb20gJy4vZmx5b3V0LW1lbnUtcGFuZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgRmx5b3V0TWVudURpcmVjdGl2ZSB9IGZyb20gJy4vZmx5b3V0LW1lbnUuZGlyZWN0aXZlJztcbmltcG9ydCB7IEZseW91dE1lbnVGb290ZXIgfSBmcm9tICcuL2ZseW91dC1tZW51LWZvb3Rlci5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtGbHlvdXRNZW51LCBGbHlvdXRNZW51UGFuZSwgRmx5b3V0TWVudURpcmVjdGl2ZSwgRmx5b3V0TWVudUZvb3Rlcl0sXG4gIGV4cG9ydHM6IFtGbHlvdXRNZW51LCBGbHlvdXRNZW51UGFuZSwgRmx5b3V0TWVudURpcmVjdGl2ZSwgRmx5b3V0TWVudUZvb3Rlcl0sXG4gIHByb3ZpZGVyczogW0RpYWxvZ1NlcnZpY2VdLFxuICBlbnRyeUNvbXBvbmVudHM6IFtGbHlvdXRNZW51UGFuZV0sXG4gIGltcG9ydHM6IFtcbiAgICBCdXR0b25Nb2R1bGUsXG4gICAgQ29tbW9uTW9kdWxlLFxuICAgIEkxOG5Nb2R1bGUsXG4gICAgUGxhY2Vob2xkZXJNb2R1bGUsXG4gICAgRGlhbG9nTW9kdWxlLFxuICAgIEljb25Nb2R1bGUsXG4gICAgTGlua01vZHVsZSxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgRmx5b3V0TWVudU1vZHVsZSB7fVxuIl19