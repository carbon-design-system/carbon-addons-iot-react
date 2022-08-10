import { moduleMetadata, Story } from '@storybook/angular';
import { DateTimePickerModule } from './date-time-picker.module';
import { subDays, subHours, subMinutes, subMonths, subYears } from 'date-fns';

export default {
  title: 'Components/DateTime Picker',

  decorators: [
    moduleMetadata({
      imports: [DateTimePickerModule],
    }),
  ],
  argTypes: {
    theme: {
      name: 'Light theme',
      control: 'boolean',
      defaultValue: false
    },
    selectedChange: {
      action: 'click',
      table: {
        disable: true
      }
    },
    apply: {
      action: 'click',
      table: {
        disable: true
      }
    },
    cancel: {
      action: 'cancel',
      table: {
        disable: true
      }
    },
    zh: {
      table: {
        disable: true
      }
    }
  }
};

export const basic = (args) => ({
  template: `
    <ai-date-time-picker
      [theme]="(theme ? 'light' : null)"
      (selectedChange)="selectedChange($event)"
      (apply)="apply($event)"
      (cancel)="cancel($event)">
    </ai-date-time-picker>
  `,
  props: args,
  name: 'Basic'
});

const basicInChineseTpl: Story = (args) => ({
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
  props: args,
  name: 'Basic in Chinese'
});

export const basicInChinese = basicInChineseTpl.bind({});
basicInChinese.args = {
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
    RANGE_SEPARATOR: '至'
  }
};

const withBlockedDatesTpl = (args) => ({
  template: `
    <ai-date-time-picker
      [theme]="(theme ? 'light' : null)"
      [flatpickrOptions]="flatpickrOptions"
      (selectedChange)="selectedChange($event)"
      (apply)="apply($event)"
      (cancel)="cancel($event)">
    </ai-date-time-picker>
  `,
  props: args,
  name: 'With blocked dates'
});

export const withBlockedDates = withBlockedDatesTpl.bind({});
withBlockedDates.args = {
  flatpickrOptions: {
      maxDate: 'today',
  }
};

const withPresetRangeSelectedTpl = (args) => ({
  template: `
    <ai-date-time-picker
      [selected]="selected"
      [theme]="(theme ? 'light' : null)"
      (selectedChange)="selectedChange($event)"
      (apply)="apply($event)"
      (cancel)="cancel($event)">
    </ai-date-time-picker>
  `,
  props: args,
  name: 'With preset range selected'
});

export const withPresetRangeSelected = withPresetRangeSelectedTpl.bind({});
withPresetRangeSelected.args = {
  selected: ['LAST_6_HOURS']
};

export const withAbsoluteRangeSet = withPresetRangeSelectedTpl.bind({});
withAbsoluteRangeSet.args = {
  selected: ['ABSOLUTE', new Date(2020, 6, 15, 8, 0), new Date(2020, 9, 19, 18, 30)],
};

export const withRelativeRangeSet = withPresetRangeSelectedTpl.bind({});
withRelativeRangeSet.args = {
  selected: [
    'RELATIVE',
    null,
    null,
    {
      last: [5, 'WEEKS'],
      relativeTo: ['YESTERDAY', '15:45'],
    },
  ],
};

const withoutRelativeTpl = (args) => ({
  template: `
    <ai-date-time-picker
      [hasRelative]="hasRelative"
      [theme]="(theme ? 'light' : null)"
      (selectedChange)="selectedChange($event)"
      (apply)="apply($event)"
      (cancel)="cancel($event)">
    </ai-date-time-picker>
  `,
  props: args,
  name: 'Without relative'
});

export const withoutRelative = withoutRelativeTpl.bind({});
withoutRelative.args = {
  hasRelative: false
};

const withoutAbsoluteTpl = (args) => ({
  template: `
    <ai-date-time-picker
      [hasAbsolute]="hasAbsolute"
      (selectedChange)="selectedChange($event)"
      (apply)="apply($event)"
      (cancel)="cancel($event)">
    </ai-date-time-picker>
  `,
  props: args,
  name: 'Without absolute'
});

export const withoutAbsolute = withoutAbsoluteTpl.bind({});
withoutAbsolute.args = {
  hasAbsolute: false
};

const withoutCustomRangeSelectorsTpl = (args) => ({
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
  props: args,
  name: 'Without custom range selectors'
});

export const withoutCustomRangeSelectors = withoutCustomRangeSelectorsTpl.bind({});
withoutCustomRangeSelectors.args = {
  hasRelative: false,
  hasAbsolute: false,
};

const withCustomPresetRangesTpl = (args) => ({
  template: `
    <ai-date-time-picker
      [dateTimeRanges]="dateTimeRanges"
      [theme]="(theme ? 'light' : null)"
      (selectedChange)="selectedChange($event)"
      (apply)="apply($event)"
      (cancel)="cancel($event)">
    </ai-date-time-picker>
  `,
  props: args,
  name: 'With custom preset ranges'
});

export const withCustomPresetRanges = withCustomPresetRangesTpl.bind({});
withCustomPresetRanges.args = {
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
  name: 'With custom preset ranges'
};
