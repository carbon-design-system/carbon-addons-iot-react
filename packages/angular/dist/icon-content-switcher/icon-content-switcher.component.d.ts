/**
 *
 * @ai-apps/angular v2.155.1 | icon-content-switcher.component.d.ts
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


import { QueryList } from '@angular/core';
import { ContentSwitcher } from 'carbon-components-angular';
import { IconContentSwitcherOption } from '.';
/**
 * [See demo](../../?path=/story/components-icon-content-switcher--basic)
 *
 * ```html
 * <ai-icon-content-switcher (selected)="selected($event)">
 *		<button aiIconContentOption>First section</button>
 *		<button aiIconContentOption>Second section</button>
 *		<button aiIconContentOption>Third section</button>
 *	</ai-icon-content-switcher>
 *	```
 *
 * <example-url>../../iframe.html?id=components-icon-content-switcher--basic</example-url>
 */
export declare class IconContentSwitcher extends ContentSwitcher {
    options: QueryList<IconContentSwitcherOption>;
}
