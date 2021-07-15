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
