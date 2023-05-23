import dayjs from 'dayjs';

const DAY_FORMAT = 'MMM DD';
const TIME_FORMAT = 'HH:mm';
const FULL_DATE_TIME_FORMAT = 'DD/MM/YY HH:mm';
const DURATION_FORMAT = 'HH[H] mm[M]';

function getRandomInteger(a = 0, b = 1){
  const lover = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lover + Math.random() * (upper - lover + 1));
}
function getRandomValue(items){
  return items [getRandomInteger (0, items.length - 1)];
}

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
  return dayjs(endDate.diff(startDate, 'm')).format(DURATION_FORMAT);
}

function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}

export {toDay, toTime, duration, capitalize, toFullDateTime, getRandomInteger, getRandomValue};
