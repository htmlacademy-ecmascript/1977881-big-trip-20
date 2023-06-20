import AbstractView from '../framework/view/abstract-view';
import {capitalize} from '../utils/utils';

function createTripFiltersTemplate(filters, currentFilterType) {
  let result = '<form class="trip-filters" action="#" method="get">';

  for (const filter of filters) {
    result += (
      `<div class="trip-filters__filter">
        <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter"
            value="${filter}" ${filter === currentFilterType ? 'checked' : ''}>
        <label class="trip-filters__filter-label" for="filter-${filter}">${capitalize(filter)}</label>
      </div>`
    );
  }

  result += '<button class="visually-hidden" type="submit">Accept filter</button></form>';
  return result;
}

export default class TripFiltersView extends AbstractView {
  #filters;
  #currentFilterType;
  #handleFilterTypeChange;

  constructor({filters, currentFilterType, onFilterChangeType}) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#handleFilterTypeChange = onFilterChangeType;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createTripFiltersTemplate(this.#filters, this.#currentFilterType);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };
}
