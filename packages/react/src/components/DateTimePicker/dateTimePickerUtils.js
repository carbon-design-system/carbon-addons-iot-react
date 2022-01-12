import { cloneDeep } from 'lodash-es';

import { PICKER_KINDS, INTERVAL_VALUES, RELATIVE_VALUES } from '../../constants/DateConstants';
import dayjs from '../../utils/dayjs';
/**
 * Parses a value object into a human readable value
 * @param {Object} value - the currently selected value
 * @param {string} value.kind - preset/relative/absolute
 * @param {Object} value.preset - the preset selection
 * @param {Object} value - the relative time selection
 * @param {Object} value - the absolute time selection
 * @returns {Object} a human readable value and a furtherly augmented value object
 */
export const parseValue = (timeRange, dateTimeMask, toLabel) => {
  let readableValue = '';

  if (!timeRange) {
    return { readableValue };
  }

  const kind = timeRange.kind ?? timeRange.timeRangeKind;
  const value =
    kind === PICKER_KINDS.RELATIVE
      ? timeRange?.relative ?? timeRange.timeRangeValue
      : kind === PICKER_KINDS.ABSOLUTE
      ? timeRange?.absolute ?? timeRange.timeRangeValue
      : timeRange?.preset ?? timeRange.timeRangeValue;

  if (!value) {
    return { readableValue };
  }

  const returnValue = cloneDeep(timeRange);
  switch (kind) {
    case PICKER_KINDS.RELATIVE: {
      let endDate = dayjs();
      if (value.relativeToWhen !== '') {
        endDate =
          value.relativeToWhen === RELATIVE_VALUES.YESTERDAY
            ? dayjs().add(-1, INTERVAL_VALUES.DAYS)
            : dayjs();
        // wait to parse it until fully typed
        if (value.relativeToTime.length === 5) {
          endDate = endDate.hour(Number(value.relativeToTime.split(':')[0]));
          endDate = endDate.minute(Number(value.relativeToTime.split(':')[1]));
        }

        const startDate = endDate
          .clone()
          .subtract(
            value.lastNumber,
            value.lastInterval ? value.lastInterval : INTERVAL_VALUES.MINUTES
          );
        if (!returnValue.relative) {
          returnValue.relative = {};
        }
        returnValue.relative.start = new Date(startDate.valueOf());
        returnValue.relative.end = new Date(endDate.valueOf());
        readableValue = `${dayjs(startDate).format(dateTimeMask)} ${toLabel} ${dayjs(
          endDate
        ).format(dateTimeMask)}`;
      }
      break;
    }
    case PICKER_KINDS.ABSOLUTE: {
      let startDate = dayjs(value.start ?? value.startDate);
      if (value.startTime) {
        startDate = startDate.hours(value.startTime.split(':')[0]);
        startDate = startDate.minutes(value.startTime.split(':')[1]);
      }
      if (!returnValue.absolute) {
        returnValue.absolute = {};
      }
      returnValue.absolute.start = new Date(startDate.valueOf());
      if (value.end ?? value.endDate) {
        let endDate = dayjs(value.end ?? value.endDate);
        if (value.endTime) {
          endDate = endDate.hours(value.endTime.split(':')[0]);
          endDate = endDate.minutes(value.endTime.split(':')[1]);
        }
        returnValue.absolute.end = new Date(endDate.valueOf());
        readableValue = `${dayjs(startDate).format(dateTimeMask)} ${toLabel} ${dayjs(
          endDate
        ).format(dateTimeMask)}`;
      } else {
        readableValue = `${dayjs(startDate).format(dateTimeMask)} ${toLabel} ${dayjs(
          startDate
        ).format(dateTimeMask)}`;
      }
      break;
    }
    default:
      readableValue = value.label;
      break;
  }

  return { readableValue, ...returnValue };
};
