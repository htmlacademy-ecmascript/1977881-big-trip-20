import dayjs from 'dayjs';

const DAY_FORMAT = 'MMM DD';
const TIME_FORMAT = 'HH:mm';
const FULL_DATE_TIME_FORMAT = 'DD/MM/YY HH:mm';

function toDay(dateTime) {
  return dateTime ? dayjs(dateTime).format(DAY_FORMAT) : '';
}

function toTime(dateTime) {
  return dateTime ? dayjs(dateTime).format(TIME_FORMAT) : '';
}

function toFullDateTime(dateTime) {
  return dateTime ? dayjs(dateTime).format(FULL_DATE_TIME_FORMAT) : '';
}

function duration(start, end) {
  const startDate = dayjs(start);
  const endDate = dayjs(end);
  const totalMinutes = endDate.diff(startDate, 'm');
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  let resultTemplate = '';
  if (hours > 0) {
    if (hours < 10) {
      resultTemplate += '0';
    }

    resultTemplate += hours;
    resultTemplate += 'H';
  }

  if (minutes > 0) {
    resultTemplate += ' ';
    if (minutes < 10) {
      resultTemplate += '0';
    }

    resultTemplate += minutes;
    resultTemplate += 'M';
  }

  return resultTemplate;
}

function areDatesEqual(d1, d2) {
  return (d1 === d2) || dayjs(d1).isSame(d2);
}

function capitalize(str) {
  if (!str) {
    return str;
  }

  return str[0].toUpperCase() + str.slice(1);
}

function isInThePast(date) {
  return date && dayjs().isAfter(date, 'D');
}

function isCurrentDate(dateFrom, dateTo) {
  return dateFrom && dateTo
    && !isInThePast(dateTo)
    && !isInFuture(dateFrom);
}

function isInFuture(date) {
  return date && dayjs().isBefore(date, 'D');
}

export {toDay, toTime, duration, capitalize, toFullDateTime, areDatesEqual, isInThePast, isCurrentDate, isInFuture};
