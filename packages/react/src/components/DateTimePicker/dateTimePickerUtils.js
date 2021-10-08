import { PICKER_KINDS, INTERVAL_VALUES, RELATIVE_VALUES } from '../../constants/DateConstants';
import dayjs from '../../utils/dayjs';

export const getHumanReadableDate = (timeRange, dateTimeMask, toLabel) => {
  let readableValue = '';

  if (!timeRange) {
    return readableValue;
  }

  if (timeRange.range) {
    return timeRange.range;
  }

  const kind = timeRange.kind ?? timeRange.timeRangeKind;
  const value =
    kind === PICKER_KINDS.RELATIVE
      ? timeRange?.value?.relative ?? timeRange.timeRangeValue
      : PICKER_KINDS.ABSOLUTE
      ? timeRange?.value?.absolute ?? timeRange.timeRangeValue
      : timeRange?.value?.preset ?? timeRange.timeRangeValue;

  if (!value) {
    return readableValue;
  }

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
      if (value.end ?? value.endDate) {
        let endDate = dayjs(value.end ?? value.endDate);
        if (value.endTime) {
          endDate = endDate.hours(value.endTime.split(':')[0]);
          endDate = endDate.minutes(value.endTime.split(':')[1]);
        }
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
  return readableValue;
};
