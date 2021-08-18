import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  ButtonModule,
  DatePickerModule,
  DialogModule,
  I18nModule,
  IconModule,
  InputModule,
  NumberModule,
  RadioModule,
  SelectModule,
  TimePickerModule,
  TimePickerSelectModule,
} from 'carbon-components-angular';
import { DateTimePickerComponent } from './date-time-picker.component';
import { CustomDateTimeComponent } from './custom-date-time.component';
import { DateTimeAbsoluteComponent } from './date-time-absolute.component';
import { DateTimeRelativeComponent } from './date-time-relative.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DateTimePickerComponent,
    CustomDateTimeComponent,
    DateTimeAbsoluteComponent,
    DateTimeRelativeComponent,
  ],
  exports: [
    DateTimePickerComponent,
    CustomDateTimeComponent,
    DateTimeAbsoluteComponent,
    DateTimeRelativeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    RadioModule,
    SelectModule,
    NumberModule,
    TimePickerModule,
    TimePickerSelectModule,
    InputModule,
    DatePickerModule,
    I18nModule,
    IconModule,
    DialogModule,
  ],
})
export class DateTimePickerModule {}
