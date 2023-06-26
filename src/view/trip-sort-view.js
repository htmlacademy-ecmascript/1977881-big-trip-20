import AbstractView from '../framework/view/abstract-view';
import {SortType} from '../utils/constants';

function createTripSortTemplate(currentSortType) {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <div class="trip-sort__item  trip-sort__item--day">
        <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-day"
            ${currentSortType === SortType.BY_DAY ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-day" data-sort-type="${SortType.BY_DAY}">Day</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--event">
        <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>
        <label class="trip-sort__btn" for="sort-event">Event</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--time">
        <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time"
            ${currentSortType === SortType.BY_DURATION ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-time" data-sort-type="${SortType.BY_DURATION}">Time</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--price">
        <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price"
            ${currentSortType === SortType.BY_PRICE ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-price" data-sort-type="${SortType.BY_PRICE}">Price</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--offer">
        <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>
        <label class="trip-sort__btn" for="sort-offer">Offers</label>
      </div>
    </form>`
  );
}

export default class TripSortView extends AbstractView {
  #currentSortType;
  #handleSortTypeChange;

  constructor({currentSortType: currentSortType, onSortTypeChange: onSortTypeChange}) {
    super();
    this.#currentSortType = currentSortType;
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createTripSortTemplate(this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'LABEL') {
      return;
    }

    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };
}


