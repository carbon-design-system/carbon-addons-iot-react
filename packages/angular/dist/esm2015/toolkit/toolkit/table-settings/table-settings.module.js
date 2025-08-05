/**
 *
 * @ai-apps/angular v2.155.1 | table-settings.module.js
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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule, CheckboxModule, DialogModule, ModalModule, RadioModule, TabsModule, } from 'carbon-components-angular';
import { SortableListComponent } from '../sortable-list/sortable-list.component';
import { SortableListModule } from '../sortable-list/sortable-list.module';
import { UtilsModule } from '../utils/index';
import { CheckboxSettingComponent } from './settings/checkbox-setting.component';
import { RadioSettingComponent } from './settings/radio-setting.component';
import { TableSettingsModalComponent } from './table-settings-modal.component';
import { TableSettingsService } from './table-settings.service';
export class TableSettingsModule {
}
TableSettingsModule.decorators = [
    { type: NgModule, args: [{
                declarations: [TableSettingsModalComponent, CheckboxSettingComponent, RadioSettingComponent],
                exports: [TableSettingsModalComponent, CheckboxSettingComponent, RadioSettingComponent],
                providers: [TableSettingsService],
                imports: [
                    CommonModule,
                    BrowserAnimationsModule,
                    SortableListModule,
                    ModalModule,
                    ButtonModule,
                    DialogModule,
                    UtilsModule,
                    TabsModule,
                    CheckboxModule,
                    RadioModule,
                ],
                entryComponents: [SortableListComponent, CheckboxSettingComponent, RadioSettingComponent],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtc2V0dGluZ3MubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3Rvb2xraXQvdGFibGUtc2V0dGluZ3MvdGFibGUtc2V0dGluZ3MubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQy9FLE9BQU8sRUFDTCxZQUFZLEVBQ1osY0FBYyxFQUNkLFlBQVksRUFDWixXQUFXLEVBQ1gsV0FBVyxFQUNYLFVBQVUsR0FDWCxNQUFNLDJCQUEyQixDQUFDO0FBQ25DLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQ2pGLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQzNFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUNqRixPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUMzRSxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUMvRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQW9CaEUsTUFBTSxPQUFPLG1CQUFtQjs7O1lBbEIvQixRQUFRLFNBQUM7Z0JBQ1IsWUFBWSxFQUFFLENBQUMsMkJBQTJCLEVBQUUsd0JBQXdCLEVBQUUscUJBQXFCLENBQUM7Z0JBQzVGLE9BQU8sRUFBRSxDQUFDLDJCQUEyQixFQUFFLHdCQUF3QixFQUFFLHFCQUFxQixDQUFDO2dCQUN2RixTQUFTLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQztnQkFDakMsT0FBTyxFQUFFO29CQUNQLFlBQVk7b0JBQ1osdUJBQXVCO29CQUN2QixrQkFBa0I7b0JBQ2xCLFdBQVc7b0JBQ1gsWUFBWTtvQkFDWixZQUFZO29CQUNaLFdBQVc7b0JBQ1gsVUFBVTtvQkFDVixjQUFjO29CQUNkLFdBQVc7aUJBQ1o7Z0JBQ0QsZUFBZSxFQUFFLENBQUMscUJBQXFCLEVBQUUsd0JBQXdCLEVBQUUscUJBQXFCLENBQUM7YUFDMUYiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJyb3dzZXJBbmltYXRpb25zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7XG4gIEJ1dHRvbk1vZHVsZSxcbiAgQ2hlY2tib3hNb2R1bGUsXG4gIERpYWxvZ01vZHVsZSxcbiAgTW9kYWxNb2R1bGUsXG4gIFJhZGlvTW9kdWxlLFxuICBUYWJzTW9kdWxlLFxufSBmcm9tICdjYXJib24tY29tcG9uZW50cy1hbmd1bGFyJztcbmltcG9ydCB7IFNvcnRhYmxlTGlzdENvbXBvbmVudCB9IGZyb20gJy4uL3NvcnRhYmxlLWxpc3Qvc29ydGFibGUtbGlzdC5jb21wb25lbnQnO1xuaW1wb3J0IHsgU29ydGFibGVMaXN0TW9kdWxlIH0gZnJvbSAnLi4vc29ydGFibGUtbGlzdC9zb3J0YWJsZS1saXN0Lm1vZHVsZSc7XG5pbXBvcnQgeyBVdGlsc01vZHVsZSB9IGZyb20gJy4uL3V0aWxzL2luZGV4JztcbmltcG9ydCB7IENoZWNrYm94U2V0dGluZ0NvbXBvbmVudCB9IGZyb20gJy4vc2V0dGluZ3MvY2hlY2tib3gtc2V0dGluZy5jb21wb25lbnQnO1xuaW1wb3J0IHsgUmFkaW9TZXR0aW5nQ29tcG9uZW50IH0gZnJvbSAnLi9zZXR0aW5ncy9yYWRpby1zZXR0aW5nLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBUYWJsZVNldHRpbmdzTW9kYWxDb21wb25lbnQgfSBmcm9tICcuL3RhYmxlLXNldHRpbmdzLW1vZGFsLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBUYWJsZVNldHRpbmdzU2VydmljZSB9IGZyb20gJy4vdGFibGUtc2V0dGluZ3Muc2VydmljZSc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1RhYmxlU2V0dGluZ3NNb2RhbENvbXBvbmVudCwgQ2hlY2tib3hTZXR0aW5nQ29tcG9uZW50LCBSYWRpb1NldHRpbmdDb21wb25lbnRdLFxuICBleHBvcnRzOiBbVGFibGVTZXR0aW5nc01vZGFsQ29tcG9uZW50LCBDaGVja2JveFNldHRpbmdDb21wb25lbnQsIFJhZGlvU2V0dGluZ0NvbXBvbmVudF0sXG4gIHByb3ZpZGVyczogW1RhYmxlU2V0dGluZ3NTZXJ2aWNlXSxcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZSxcbiAgICBCcm93c2VyQW5pbWF0aW9uc01vZHVsZSxcbiAgICBTb3J0YWJsZUxpc3RNb2R1bGUsXG4gICAgTW9kYWxNb2R1bGUsXG4gICAgQnV0dG9uTW9kdWxlLFxuICAgIERpYWxvZ01vZHVsZSxcbiAgICBVdGlsc01vZHVsZSxcbiAgICBUYWJzTW9kdWxlLFxuICAgIENoZWNrYm94TW9kdWxlLFxuICAgIFJhZGlvTW9kdWxlLFxuICBdLFxuICBlbnRyeUNvbXBvbmVudHM6IFtTb3J0YWJsZUxpc3RDb21wb25lbnQsIENoZWNrYm94U2V0dGluZ0NvbXBvbmVudCwgUmFkaW9TZXR0aW5nQ29tcG9uZW50XSxcbn0pXG5leHBvcnQgY2xhc3MgVGFibGVTZXR0aW5nc01vZHVsZSB7fVxuIl19