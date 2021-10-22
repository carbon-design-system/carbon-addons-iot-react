import { storiesOf, moduleMetadata } from '@storybook/angular';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import { DateTimePickerModule } from './date-time-picker.module';
import { subDays, subHours, subMinutes, subMonths, subYears } from 'date-fns';

const getProps = (override = {}) =>
  Object.assign(
    {},
    {
      theme: boolean('Light theme', false),
      selectedChange: action('selectionChange'),
      apply: action('apply'),
      cancel: action('cancel'),
    },
    override
  );

storiesOf('Components/DateTime Picker', module)
  .addDecorator(
    moduleMetadata({
      imports: [DateTimePickerModule],
    })
  )
  .addDecorator(withKnobs)
  .add('Basic', () => ({
    template: `
      <ai-date-time-picker
        [theme]="(theme ? 'light' : null)"
        (selectedChange)="selectedChange($event)"
        (apply)="apply($event)"
        (cancel)="cancel($event)">
      </ai-date-time-picker>
		`,
    props: getProps(),
  }))
  .add('Basic in Chinese', () => ({
    template: `
      <ai-date-time-picker
        [language]="'zh'"
        [theme]="(theme ? 'light' : null)"
        [batchText]="zh"
        [dateFormat]="'yyyy年MM月dd日'"
        [placeholder]="'yyyy年MM月dd日 HH:mm'"
        (selectedChange)="selectedChange($event)"
        (apply)="apply($event)"
        (cancel)="cancel($event)">
      </ai-date-time-picker>
		`,
    props: getProps({
      zh: {
        ABSOLUTE: '绝对',
        RELATIVE: '相对',
        CUSTOM_RANGE: '自定义范围',
        RELATIVE_TO: '相对于',
        START_DATE: '开始日期',
        END_DATE: '结束日期',
        START_TIME: '开始时间',
        END_TIME: '结束时间',
        LAST: '最后',
        CANCEL: '取消',
        APPLY: '提交',
        BACK: '返回',
        NOW: '现在',
        YESTERDAY: '昨天',
        YEARS: '年',
        MONTHS: '月',
        WEEKS: '周',
        DAYS: '天',
        HOURS: '小时',
        MINUTES: '分钟',
        RANGE_SEPARATOR: '至',
      },
    }),
  }))
  .add('With disabled date picker', () => ({
    template: `
      <ai-date-time-picker
        [theme]="(theme ? 'light' : null)"
        [datePickerDisabled]="datePickerDisabled"
        (selectedChange)="selectedChange($event)"
        (apply)="apply($event)"
        (cancel)="cancel($event)">
      </ai-date-time-picker>
		`,
    props: getProps({
      datePickerDisabled: true,
    }),
  }))
  .add('With blocked dates', () => ({
    template: `
      <ai-date-time-picker
        [theme]="(theme ? 'light' : null)"
        [flatpickrOptions]="flatpickrOptions"
        (selectedChange)="selectedChange($event)"
        (apply)="apply($event)"
        (cancel)="cancel($event)">
      </ai-date-time-picker>
		`,
    props: getProps({
      flatpickrOptions: {
        maxDate: 'today',
      },
    }),
  }))
  .add('With preset range selected', () => ({
    template: `
      <ai-date-time-picker
        [selected]="selected"
        [theme]="(theme ? 'light' : null)"
        (selectedChange)="selectedChange($event)"
        (apply)="apply($event)"
        (cancel)="cancel($event)">
      </ai-date-time-picker>
		`,
    props: getProps({
      selected: ['LAST_6_HOURS'],
    }),
  }))
  .add('With absolute range set', () => ({
    template: `
      <ai-date-time-picker
        [selected]="selected"
        [theme]="(theme ? 'light' : null)"
        (selectedChange)="selectedChange($event)"
        (apply)="apply($event)"
        (cancel)="cancel($event)">
      </ai-date-time-picker>
		`,
    props: getProps({
      selected: ['ABSOLUTE', new Date(2020, 6, 15, 8, 0), new Date(2020, 9, 19, 18, 30)],
    }),
  }))
  .add('With relative range set', () => ({
    template: `
      <ai-date-time-picker
        [selected]="selected"
        [theme]="(theme ? 'light' : null)"
        (selectedChange)="selectedChange($event)"
        (apply)="apply($event)"
        (cancel)="cancel($event)">
      </ai-date-time-picker>
		`,
    props: getProps({
      selected: [
        'RELATIVE',
        null,
        null,
        {
          last: [5, 'WEEKS'],
          relativeTo: ['YESTERDAY', '15:45'],
        },
      ],
    }),
  }))
  .add('Without relative', () => ({
    template: `
      <ai-date-time-picker
        [hasRelative]="hasRelative"
        [theme]="(theme ? 'light' : null)"
        (selectedChange)="selectedChange($event)"
        (apply)="apply($event)"
        (cancel)="cancel($event)">
      </ai-date-time-picker>
		`,
    props: getProps({
      hasRelative: false,
    }),
  }))
  .add('Without absolute', () => ({
    template: `
      <ai-date-time-picker
        [hasAbsolute]="hasAbsolute"
        (selectedChange)="selectedChange($event)"
        (apply)="apply($event)"
        (cancel)="cancel($event)">
      </ai-date-time-picker>
		`,
    props: getProps({
      hasAbsolute: false,
    }),
  }))
  .add('Without custom range selectors', () => ({
    template: `
      <ai-date-time-picker
        [hasRelative]="hasRelative"
        [hasAbsolute]="hasAbsolute"
        [theme]="(theme ? 'light' : null)"
        (selectedChange)="selectedChange($event)"
        (apply)="apply($event)"
        (cancel)="cancel($event)">
      </ai-date-time-picker>
		`,
    props: getProps({
      hasRelative: false,
      hasAbsolute: false,
    }),
  }))
  .add('With custom preset ranges', () => ({
    template: `
      <ai-date-time-picker
        [dateTimeRanges]="dateTimeRanges"
        [theme]="(theme ? 'light' : null)"
        (selectedChange)="selectedChange($event)"
        (apply)="apply($event)"
        (cancel)="cancel($event)">
      </ai-date-time-picker>
		`,
    props: getProps({
      dateTimeRanges: [
        {
          key: 'LAST_5_MINUTES',
          description: 'Last 5 minutes',
          getRange: () => {
            const now = new Date();
            const previous = subMinutes(now, 5);
            return [previous, now];
          },
        },
        {
          key: 'LAST_1_HOUR',
          description: 'Last 1 hour',
          getRange: () => {
            const now = new Date();
            const previous = subHours(now, 1);
            return [previous, now];
          },
        },
        {
          key: 'LAST_5_DAYS',
          description: 'Last 5 days',
          getRange: () => {
            const now = new Date();
            const previous = subDays(now, 5);
            return [previous, now];
          },
        },
        {
          key: 'LAST_MONTH',
          description: 'Last month',
          getRange: () => {
            const now = new Date();
            const previous = subMonths(now, 1);
            return [previous, now];
          },
        },
        {
          key: 'LAST_YEAR',
          description: 'Last year',
          getRange: () => {
            const now = new Date();
            const previous = subYears(now, 1);
            return [previous, now];
          },
        },
      ],
    }),
  }));
