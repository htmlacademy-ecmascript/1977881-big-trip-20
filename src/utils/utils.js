import dayjs from 'dayjs';

const DAY_FORMAT = 'MMM DD';
const TIME_FORMAT = 'HH:mm';
const FULL_DATE_TIME_FORMAT = 'DD/MM/YY HH:mm';

function convertToDay(dateTime) {
  return dateTime ? dayjs(dateTime).format(DAY_FORMAT) : '';
}

function convertToTime(dateTime) {
  return dateTime ? dayjs(dateTime).format(TIME_FORMAT) : '';
}

function convertToFullDateTime(dateTime) {
  return dateTime ? dayjs(dateTime).format(FULL_DATE_TIME_FORMAT) : '';
}

function calculateDuration(start, end) {
  const startDate = dayjs(start);
  const endDate = dayjs(end);
  const totalMinutes = endDate.diff(startDate, 'm');
  let hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  let resultTemplate = '';

  if (hours > 23) {
    const days = Math.floor(hours / 24);
    hours -= days * 24;

    if (days < 10) {
      resultTemplate += '0';
    }

    resultTemplate += days;
    resultTemplate += 'D';

    if (hours === 0) {
      resultTemplate += ' 00H';
    }
  }

  if (hours > 0) {
    resultTemplate += ' ';

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
  return date && dayjs().isAfter(date);
}

function isCurrentDate(dateFrom, dateTo) {
  return dateFrom && dateTo
    && !isInThePast(dateTo)
    && !isInFuture(dateFrom);
}

function isInFuture(date) {
  return date && dayjs().isBefore(date);
}

export {
  convertToDay,
  convertToTime,
  calculateDuration,
  capitalize,
  convertToFullDateTime,
  areDatesEqual,
  isInThePast,
  isCurrentDate,
  isInFuture
};
