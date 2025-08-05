/**
 *
 * @ai-apps/angular v2.155.1 | flyout-menu-pane.component.d.ts
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


import { ElementRef, EventEmitter, TemplateRef } from '@angular/core';
import { AnimationFrameService, CloseMeta, Dialog, ElementService } from 'carbon-components-angular';
import { I18n } from 'carbon-components-angular/i18n';
/**
 * The Filter menu component encapsulates the OverFlowMenu directive, and the flyout iconography
 * into one convienent component
 *
 * [See demo](../../?path=/story/components-flyout-menu--basic)
 *
 * html:
 * ```
 * <ai-flyout-menu-pane>
 *	options
 * </ai-flyout-menu-pane>
 * ```
 */
export declare class FlyoutMenuPane extends Dialog {
    protected elementRef: ElementRef;
    protected elementService: ElementService;
    protected i18n: I18n;
    protected animationFrameService: AnimationFrameService;
    /**
     * This specifies any vertical and horizontal offset for the position of the dialog
     */
    set offset(os: {
        x: number;
        y: number;
    });
    get offset(): {
        x: number;
        y: number;
    };
    hasContentTemplate: boolean;
    get contentTemplate(): TemplateRef<any>;
    /**
     * Sets the role of the tooltip. If there's no focusable content we leave it as a `tooltip`,
     * if there _is_ focusable content we switch to the interactive `dialog` role.
     */
    role: string;
    buttonLabel: any;
    light: boolean;
    get position(): string;
    open: boolean;
    openChange: EventEmitter<boolean>;
    private _offset;
    constructor(elementRef: ElementRef, elementService: ElementService, i18n: I18n, animationFrameService?: AnimationFrameService);
    shouldClose: (meta: CloseMeta) => boolean;
    handleOpenChange(event: boolean): void;
    onDialogInit(): void;
    getAdjustOffset(): {
        top: number;
        left: number;
    };
}
