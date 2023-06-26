import {calculateDuration, capitalize, convertToDay, convertToTime} from '../utils/utils';
import AbstractView from '../framework/view/abstract-view';

function createOffersTemplate(offers, tripPoint) {
  let result = '';
  if (!offers) {
    return result;
  }

  for (const offer of offers) {
    if (!tripPoint.offers.includes(offer.id)) {
      continue;
    }

    result += (
      `<li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>`
    );
  }

  return result;
}

function createTripPointTemplate(tripPoint, idToDestinationMap, typeToOffersMap) {
  const day = convertToDay(tripPoint.dateFrom);
  const startTime = convertToTime(tripPoint.dateFrom);
  const endTime = convertToTime(tripPoint.dateTo);
  const durationTime = calculateDuration(tripPoint.dateFrom, tripPoint.dateTo);
  const eventTitle = `${capitalize(tripPoint.type)} ${idToDestinationMap.get(tripPoint.destination).name}`;
  const isFavoriteClassName = tripPoint.isFavorite ? 'event__favorite-btn--active' : '';
  const offers = typeToOffersMap.get(tripPoint.type);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${tripPoint.dateFrom}">${day}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${tripPoint.type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${eventTitle}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${tripPoint.dateFrom}">${startTime}</time>
            &mdash;
            <time class="event__end-time" datetime="${tripPoint.dateTo}">${endTime}</time>
          </p>
          <p class="event__duration">${durationTime}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${tripPoint.basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${createOffersTemplate(offers, tripPoint)}
        </ul>
        <button class="event__favorite-btn  ${isFavoriteClassName}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
}

export default class TripPointView extends AbstractView {
  #tripPoint;
  #idToDestinationMap;
  #typeToOffersMap;

  constructor({tripPoint, idToDestinationMap, typeToOffersMap, onRollupClick, onFavoriteClick}) {
    super();
    this.#tripPoint = tripPoint;
    this.#idToDestinationMap = idToDestinationMap;
    this.#typeToOffersMap = typeToOffersMap;

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', (evt) => {
        evt.preventDefault();
        onRollupClick();
      });

    this.element.querySelector('.event__favorite-btn')
      .addEventListener('click', (evt) => {
        evt.preventDefault();
        onFavoriteClick();
      });
  }

  get template() {
    return createTripPointTemplate(this.#tripPoint, this.#idToDestinationMap, this.#typeToOffersMap);
  }
}

