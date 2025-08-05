/**
 *
 * @ai-apps/angular v2.155.1 | droppable.directive.js
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


import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
export class DroppableDirective {
    constructor() {
        this.active = new EventEmitter();
        this.leave = new EventEmitter();
        this.dropping = new EventEmitter();
    }
    handleDrag(event) {
        event.preventDefault();
        this.active.emit(true);
    }
    handleDrop() {
        this.active.emit(false);
        this.dropping.emit();
    }
    handleLeave() {
        this.leave.emit();
    }
}
DroppableDirective.decorators = [
    { type: Directive, args: [{
                selector: '[scDropzone], [aiDropzone]',
            },] }
];
DroppableDirective.propDecorators = {
    active: [{ type: Output }],
    leave: [{ type: Output }],
    dropping: [{ type: Output }],
    handleDrag: [{ type: HostListener, args: ['dragover', ['$event'],] }, { type: HostListener, args: ['dragenter', ['$event'],] }],
    handleDrop: [{ type: HostListener, args: ['drop',] }],
    handleLeave: [{ type: HostListener, args: ['dragleave',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcHBhYmxlLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy90b29sa2l0L2RyYWdnYWJsZS9kcm9wcGFibGUuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFLOUUsTUFBTSxPQUFPLGtCQUFrQjtJQUgvQjtRQUlZLFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBVyxDQUFDO1FBRXJDLFVBQUssR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBRTNCLGFBQVEsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO0lBbUIxQyxDQUFDO0lBZkMsVUFBVSxDQUFDLEtBQWdCO1FBQ3pCLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBR0QsVUFBVTtRQUNSLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDdkIsQ0FBQztJQUdELFdBQVc7UUFDVCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3BCLENBQUM7OztZQTFCRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLDRCQUE0QjthQUN2Qzs7O3FCQUVFLE1BQU07b0JBRU4sTUFBTTt1QkFFTixNQUFNO3lCQUVOLFlBQVksU0FBQyxVQUFVLEVBQUUsQ0FBQyxRQUFRLENBQUMsY0FDbkMsWUFBWSxTQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQzt5QkFNcEMsWUFBWSxTQUFDLE1BQU07MEJBTW5CLFlBQVksU0FBQyxXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFdmVudEVtaXR0ZXIsIEhvc3RMaXN0ZW5lciwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tzY0Ryb3B6b25lXSwgW2FpRHJvcHpvbmVdJyxcbn0pXG5leHBvcnQgY2xhc3MgRHJvcHBhYmxlRGlyZWN0aXZlIHtcbiAgQE91dHB1dCgpIGFjdGl2ZSA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcblxuICBAT3V0cHV0KCkgbGVhdmUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgQE91dHB1dCgpIGRyb3BwaW5nID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIEBIb3N0TGlzdGVuZXIoJ2RyYWdvdmVyJywgWyckZXZlbnQnXSlcbiAgQEhvc3RMaXN0ZW5lcignZHJhZ2VudGVyJywgWyckZXZlbnQnXSlcbiAgaGFuZGxlRHJhZyhldmVudDogRHJhZ0V2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLmFjdGl2ZS5lbWl0KHRydWUpO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignZHJvcCcpXG4gIGhhbmRsZURyb3AoKSB7XG4gICAgdGhpcy5hY3RpdmUuZW1pdChmYWxzZSk7XG4gICAgdGhpcy5kcm9wcGluZy5lbWl0KCk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdkcmFnbGVhdmUnKVxuICBoYW5kbGVMZWF2ZSgpIHtcbiAgICB0aGlzLmxlYXZlLmVtaXQoKTtcbiAgfVxufVxuIl19