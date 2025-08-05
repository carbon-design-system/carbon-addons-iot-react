/**
 *
 * @ai-apps/angular v2.155.1 | draggable.directive.js
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


import { Directive, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';
export class DraggableDirective {
    constructor() {
        this.imageOffset = { x: 0, y: 0 };
        this.start = new EventEmitter();
        this.end = new EventEmitter();
        this.draggable = true;
    }
    handleDragStart(event) {
        // 20 is half the element height
        // 4 is half of a mini-unit, which centers the drag on the handle
        event.dataTransfer.setDragImage(this.dragImage, this.imageOffset.x, this.imageOffset.y);
        event.dataTransfer.effectAllowed = 'move';
        this.start.emit();
    }
    handleEnd() {
        this.end.emit();
    }
}
DraggableDirective.decorators = [
    { type: Directive, args: [{
                selector: '[scDraggable], [aiDraggable]',
            },] }
];
DraggableDirective.propDecorators = {
    dragImage: [{ type: Input }],
    imageOffset: [{ type: Input }],
    start: [{ type: Output }],
    end: [{ type: Output }],
    draggable: [{ type: HostBinding, args: ['attr.draggable',] }],
    handleDragStart: [{ type: HostListener, args: ['dragstart', ['$event'],] }],
    handleEnd: [{ type: HostListener, args: ['dragend',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZ2dhYmxlLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy90b29sa2l0L2RyYWdnYWJsZS9kcmFnZ2FibGUuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUtsRyxNQUFNLE9BQU8sa0JBQWtCO0lBSC9CO1FBTVcsZ0JBQVcsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1FBRTVCLFVBQUssR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBRTNCLFFBQUcsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBRUosY0FBUyxHQUFHLElBQUksQ0FBQztJQWVsRCxDQUFDO0lBWkMsZUFBZSxDQUFDLEtBQWdCO1FBQzlCLGdDQUFnQztRQUNoQyxpRUFBaUU7UUFDakUsS0FBSyxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hGLEtBQUssQ0FBQyxZQUFZLENBQUMsYUFBYSxHQUFHLE1BQU0sQ0FBQztRQUMxQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFHRCxTQUFTO1FBQ1AsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNsQixDQUFDOzs7WUExQkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSw4QkFBOEI7YUFDekM7Ozt3QkFFRSxLQUFLOzBCQUVMLEtBQUs7b0JBRUwsTUFBTTtrQkFFTixNQUFNO3dCQUVOLFdBQVcsU0FBQyxnQkFBZ0I7OEJBRTVCLFlBQVksU0FBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUM7d0JBU3BDLFlBQVksU0FBQyxTQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFdmVudEVtaXR0ZXIsIEhvc3RCaW5kaW5nLCBIb3N0TGlzdGVuZXIsIElucHV0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW3NjRHJhZ2dhYmxlXSwgW2FpRHJhZ2dhYmxlXScsXG59KVxuZXhwb3J0IGNsYXNzIERyYWdnYWJsZURpcmVjdGl2ZSB7XG4gIEBJbnB1dCgpIGRyYWdJbWFnZTogRWxlbWVudDtcblxuICBASW5wdXQoKSBpbWFnZU9mZnNldCA9IHsgeDogMCwgeTogMCB9O1xuXG4gIEBPdXRwdXQoKSBzdGFydCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBAT3V0cHV0KCkgZW5kID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIEBIb3N0QmluZGluZygnYXR0ci5kcmFnZ2FibGUnKSBkcmFnZ2FibGUgPSB0cnVlO1xuXG4gIEBIb3N0TGlzdGVuZXIoJ2RyYWdzdGFydCcsIFsnJGV2ZW50J10pXG4gIGhhbmRsZURyYWdTdGFydChldmVudDogRHJhZ0V2ZW50KSB7XG4gICAgLy8gMjAgaXMgaGFsZiB0aGUgZWxlbWVudCBoZWlnaHRcbiAgICAvLyA0IGlzIGhhbGYgb2YgYSBtaW5pLXVuaXQsIHdoaWNoIGNlbnRlcnMgdGhlIGRyYWcgb24gdGhlIGhhbmRsZVxuICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREcmFnSW1hZ2UodGhpcy5kcmFnSW1hZ2UsIHRoaXMuaW1hZ2VPZmZzZXQueCwgdGhpcy5pbWFnZU9mZnNldC55KTtcbiAgICBldmVudC5kYXRhVHJhbnNmZXIuZWZmZWN0QWxsb3dlZCA9ICdtb3ZlJztcbiAgICB0aGlzLnN0YXJ0LmVtaXQoKTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2RyYWdlbmQnKVxuICBoYW5kbGVFbmQoKSB7XG4gICAgdGhpcy5lbmQuZW1pdCgpO1xuICB9XG59XG4iXX0=