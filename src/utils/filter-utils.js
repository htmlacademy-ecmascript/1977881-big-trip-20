import {FilterType} from '../constants';
import {isCurrentDate, isInFuture, isInThePast} from './utils';

const filter = {
  [FilterType.EVERYTHING]: (tripPoints) => tripPoints,
  [FilterType.PAST]: (tripPoints) => tripPoints.filter((tripPoint) => isInThePast(tripPoint.dateTo)),
  [FilterType.PRESENT]: (tripPoints) => tripPoints.filter((tripPoint) => isCurrentDate(tripPoint.dateFrom, tripPoint.dateTo)),
  [FilterType.FUTURE]: (tripPoints) => tripPoints.filter((tripPoint) => isInFuture(tripPoint.dateFrom)),
};

export {filter};
