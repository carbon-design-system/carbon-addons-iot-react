/**
 *
 * @ai-apps/angular v2.155.1 | rule-builder.module.js
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
import { ButtonModule, DropdownModule, IconModule, IconService, InputModule, UtilsModule, } from 'carbon-components-angular';
import { RuleBuilderComponent } from './rule-builder.component';
import { ContextMenuModule } from 'carbon-components-angular/context-menu';
import Subtract32 from '@carbon/icons/es/subtract/32';
import Add32 from '@carbon/icons/es/add/32';
import TextNewLine32 from '@carbon/icons/es/text--new-line/32';
import { RuleComponent } from './rule.component';
import { FormsModule } from '@angular/forms';
import { RuleBuilderHeaderComponent } from './rule-builder-header.component';
import { RuleBuilderGroupLogicComponent } from './rule-builder-group-logic.component';
export class RuleBuilderModule {
    constructor(iconService) {
        this.iconService = iconService;
        this.iconService.register(Subtract32);
        this.iconService.register(Add32);
        this.iconService.register(TextNewLine32);
    }
}
RuleBuilderModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    RuleComponent,
                    RuleBuilderComponent,
                    RuleBuilderGroupLogicComponent,
                    RuleBuilderHeaderComponent,
                ],
                exports: [
                    RuleComponent,
                    RuleBuilderComponent,
                    RuleBuilderGroupLogicComponent,
                    RuleBuilderHeaderComponent,
                ],
                imports: [
                    CommonModule,
                    DropdownModule,
                    FormsModule,
                    ButtonModule,
                    IconModule,
                    InputModule,
                    ContextMenuModule,
                    UtilsModule,
                ],
            },] }
];
RuleBuilderModule.ctorParameters = () => [
    { type: IconService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVsZS1idWlsZGVyLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9ydWxlLWJ1aWxkZXIvcnVsZS1idWlsZGVyLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQ0wsWUFBWSxFQUNaLGNBQWMsRUFDZCxVQUFVLEVBQ1YsV0FBVyxFQUNYLFdBQVcsRUFDWCxXQUFXLEdBQ1osTUFBTSwyQkFBMkIsQ0FBQztBQUNuQyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNoRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUUzRSxPQUFPLFVBQVUsTUFBTSw4QkFBOEIsQ0FBQztBQUN0RCxPQUFPLEtBQUssTUFBTSx5QkFBeUIsQ0FBQztBQUM1QyxPQUFPLGFBQWEsTUFBTSxvQ0FBb0MsQ0FBQztBQUUvRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDakQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQzdFLE9BQU8sRUFBRSw4QkFBOEIsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBMEJ0RixNQUFNLE9BQU8saUJBQWlCO0lBQzVCLFlBQW9CLFdBQXdCO1FBQXhCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQzFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQzNDLENBQUM7OztZQTdCRixRQUFRLFNBQUM7Z0JBQ1IsWUFBWSxFQUFFO29CQUNaLGFBQWE7b0JBQ2Isb0JBQW9CO29CQUNwQiw4QkFBOEI7b0JBQzlCLDBCQUEwQjtpQkFDM0I7Z0JBQ0QsT0FBTyxFQUFFO29CQUNQLGFBQWE7b0JBQ2Isb0JBQW9CO29CQUNwQiw4QkFBOEI7b0JBQzlCLDBCQUEwQjtpQkFDM0I7Z0JBQ0QsT0FBTyxFQUFFO29CQUNQLFlBQVk7b0JBQ1osY0FBYztvQkFDZCxXQUFXO29CQUNYLFlBQVk7b0JBQ1osVUFBVTtvQkFDVixXQUFXO29CQUNYLGlCQUFpQjtvQkFDakIsV0FBVztpQkFDWjthQUNGOzs7WUF2Q0MsV0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQnV0dG9uTW9kdWxlLFxuICBEcm9wZG93bk1vZHVsZSxcbiAgSWNvbk1vZHVsZSxcbiAgSWNvblNlcnZpY2UsXG4gIElucHV0TW9kdWxlLFxuICBVdGlsc01vZHVsZSxcbn0gZnJvbSAnY2FyYm9uLWNvbXBvbmVudHMtYW5ndWxhcic7XG5pbXBvcnQgeyBSdWxlQnVpbGRlckNvbXBvbmVudCB9IGZyb20gJy4vcnVsZS1idWlsZGVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDb250ZXh0TWVudU1vZHVsZSB9IGZyb20gJ2NhcmJvbi1jb21wb25lbnRzLWFuZ3VsYXIvY29udGV4dC1tZW51JztcblxuaW1wb3J0IFN1YnRyYWN0MzIgZnJvbSAnQGNhcmJvbi9pY29ucy9lcy9zdWJ0cmFjdC8zMic7XG5pbXBvcnQgQWRkMzIgZnJvbSAnQGNhcmJvbi9pY29ucy9lcy9hZGQvMzInO1xuaW1wb3J0IFRleHROZXdMaW5lMzIgZnJvbSAnQGNhcmJvbi9pY29ucy9lcy90ZXh0LS1uZXctbGluZS8zMic7XG5cbmltcG9ydCB7IFJ1bGVDb21wb25lbnQgfSBmcm9tICcuL3J1bGUuY29tcG9uZW50JztcbmltcG9ydCB7IEZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgUnVsZUJ1aWxkZXJIZWFkZXJDb21wb25lbnQgfSBmcm9tICcuL3J1bGUtYnVpbGRlci1oZWFkZXIuY29tcG9uZW50JztcbmltcG9ydCB7IFJ1bGVCdWlsZGVyR3JvdXBMb2dpY0NvbXBvbmVudCB9IGZyb20gJy4vcnVsZS1idWlsZGVyLWdyb3VwLWxvZ2ljLmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1xuICAgIFJ1bGVDb21wb25lbnQsXG4gICAgUnVsZUJ1aWxkZXJDb21wb25lbnQsXG4gICAgUnVsZUJ1aWxkZXJHcm91cExvZ2ljQ29tcG9uZW50LFxuICAgIFJ1bGVCdWlsZGVySGVhZGVyQ29tcG9uZW50LFxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgUnVsZUNvbXBvbmVudCxcbiAgICBSdWxlQnVpbGRlckNvbXBvbmVudCxcbiAgICBSdWxlQnVpbGRlckdyb3VwTG9naWNDb21wb25lbnQsXG4gICAgUnVsZUJ1aWxkZXJIZWFkZXJDb21wb25lbnQsXG4gIF0sXG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGUsXG4gICAgRHJvcGRvd25Nb2R1bGUsXG4gICAgRm9ybXNNb2R1bGUsXG4gICAgQnV0dG9uTW9kdWxlLFxuICAgIEljb25Nb2R1bGUsXG4gICAgSW5wdXRNb2R1bGUsXG4gICAgQ29udGV4dE1lbnVNb2R1bGUsXG4gICAgVXRpbHNNb2R1bGUsXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIFJ1bGVCdWlsZGVyTW9kdWxlIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBpY29uU2VydmljZTogSWNvblNlcnZpY2UpIHtcbiAgICB0aGlzLmljb25TZXJ2aWNlLnJlZ2lzdGVyKFN1YnRyYWN0MzIpO1xuICAgIHRoaXMuaWNvblNlcnZpY2UucmVnaXN0ZXIoQWRkMzIpO1xuICAgIHRoaXMuaWNvblNlcnZpY2UucmVnaXN0ZXIoVGV4dE5ld0xpbmUzMik7XG4gIH1cbn1cbiJdfQ==