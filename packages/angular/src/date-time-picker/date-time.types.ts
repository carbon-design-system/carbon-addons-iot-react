export interface DateTimeRange {
    key: any;
    description: string;
    getRange: () => [Date, Date];
}

export interface RelativeRange {
    last: [number, string];
    relativeTo: [string, string];
}

export interface BatchLabelText {
    ABSOLUTE: string;
    RELATIVE: string;
    CUSTOM_RANGE: string;
    RELATIVE_TO: string;
    START_DATE: string;
    END_DATE: string;
    START_TIME: string;
    END_TIME: string;
    LAST: string;
    CANCEL: string;
    APPLY: string;
    BACK: string;
    NOW: string;
    YESTERDAY: string;
    YEARS: string;
    MONTHS: string;
    WEEKS: string;
    DAYS: string;
    HOURS: string;
    MINUTES: string;
    RANGE_SEPARATOR: string;
}

export type RelativeDateTimeSelection = ['RELATIVE', ...DateRange, RelativeRange];
export type AbsoluteDateTimeSelection = ['ABSOLUTE', ...DateRange];
export type CustomDateTimeSelection = AbsoluteDateTimeSelection | RelativeDateTimeSelection;
export type PresetDateTimeSelection = [string];

export type DateTimeSelection = PresetDateTimeSelection | CustomDateTimeSelection;

export type DateRange = [Date, Date];

/**
 * @member key key for the RelativeTo item
 * @member label label text in Relative to dropdown list
 * @member value integer relative to today. e.g. -1 for yesterday, 0 for today, 1 for tomorrow
 */
export type RelativeToOption = {
    key: string;
    label: string;
    value: number;
};
