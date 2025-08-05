/**
 *
 * @ai-apps/angular v2.155.1 | side-panel.module.js
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
import { SidePanel } from './side-panel.component';
import { SidePanelTitleDirective } from './side-panel-title.directive';
import { SidePanelFooterDirective } from './side-panel-footer.directive';
export class SidePanelModule {
}
SidePanelModule.decorators = [
    { type: NgModule, args: [{
                declarations: [SidePanel, SidePanelTitleDirective, SidePanelFooterDirective],
                exports: [SidePanel, SidePanelTitleDirective, SidePanelFooterDirective],
                providers: [DialogService],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lkZS1wYW5lbC5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc2lkZS1wYW5lbC9zaWRlLXBhbmVsLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxVQUFVO0FBQ1YsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFL0MsVUFBVTtBQUNWLE9BQU8sRUFDTCxZQUFZLEVBQ1osaUJBQWlCLEVBQ2pCLGFBQWEsRUFDYixZQUFZLEVBQ1osVUFBVSxFQUNWLFVBQVUsRUFDVixVQUFVLEdBQ1gsTUFBTSwyQkFBMkIsQ0FBQztBQUVuQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDbkQsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDdkUsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFnQnpFLE1BQU0sT0FBTyxlQUFlOzs7WUFkM0IsUUFBUSxTQUFDO2dCQUNSLFlBQVksRUFBRSxDQUFDLFNBQVMsRUFBRSx1QkFBdUIsRUFBRSx3QkFBd0IsQ0FBQztnQkFDNUUsT0FBTyxFQUFFLENBQUMsU0FBUyxFQUFFLHVCQUF1QixFQUFFLHdCQUF3QixDQUFDO2dCQUN2RSxTQUFTLEVBQUUsQ0FBQyxhQUFhLENBQUM7Z0JBQzFCLE9BQU8sRUFBRTtvQkFDUCxZQUFZO29CQUNaLFlBQVk7b0JBQ1osVUFBVTtvQkFDVixpQkFBaUI7b0JBQ2pCLFlBQVk7b0JBQ1osVUFBVTtvQkFDVixVQUFVO2lCQUNYO2FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBtb2R1bGVzXG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuLy8gaW1wb3J0c1xuaW1wb3J0IHtcbiAgQnV0dG9uTW9kdWxlLFxuICBQbGFjZWhvbGRlck1vZHVsZSxcbiAgRGlhbG9nU2VydmljZSxcbiAgRGlhbG9nTW9kdWxlLFxuICBMaW5rTW9kdWxlLFxuICBJY29uTW9kdWxlLFxuICBJMThuTW9kdWxlLFxufSBmcm9tICdjYXJib24tY29tcG9uZW50cy1hbmd1bGFyJztcblxuaW1wb3J0IHsgU2lkZVBhbmVsIH0gZnJvbSAnLi9zaWRlLXBhbmVsLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBTaWRlUGFuZWxUaXRsZURpcmVjdGl2ZSB9IGZyb20gJy4vc2lkZS1wYW5lbC10aXRsZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgU2lkZVBhbmVsRm9vdGVyRGlyZWN0aXZlIH0gZnJvbSAnLi9zaWRlLXBhbmVsLWZvb3Rlci5kaXJlY3RpdmUnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtTaWRlUGFuZWwsIFNpZGVQYW5lbFRpdGxlRGlyZWN0aXZlLCBTaWRlUGFuZWxGb290ZXJEaXJlY3RpdmVdLFxuICBleHBvcnRzOiBbU2lkZVBhbmVsLCBTaWRlUGFuZWxUaXRsZURpcmVjdGl2ZSwgU2lkZVBhbmVsRm9vdGVyRGlyZWN0aXZlXSxcbiAgcHJvdmlkZXJzOiBbRGlhbG9nU2VydmljZV0sXG4gIGltcG9ydHM6IFtcbiAgICBCdXR0b25Nb2R1bGUsXG4gICAgQ29tbW9uTW9kdWxlLFxuICAgIEkxOG5Nb2R1bGUsXG4gICAgUGxhY2Vob2xkZXJNb2R1bGUsXG4gICAgRGlhbG9nTW9kdWxlLFxuICAgIEljb25Nb2R1bGUsXG4gICAgTGlua01vZHVsZSxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgU2lkZVBhbmVsTW9kdWxlIHt9XG4iXX0=