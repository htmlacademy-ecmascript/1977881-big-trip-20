import {capitalize, toFullDateTime} from '../utils/utils';
import {TRIP_POINT_TYPES} from '../constants';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

const BLANK_POINT =
  {
    basePrice: 0,
    destination: {
      description: '',
      name: '',
      pictures: []
    },
    dateFrom: '',
    dateTo: '',
    isFavorite: false,
    offers: [],
    type: 'taxi'
  };

function createEventTypesTemplate() {
  let result = '';

  for (const type of TRIP_POINT_TYPES) {
    result += (
      `<div class="event__type-item">
        <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${capitalize(type)}</label>
      </div>`
    );
  }

  return result;
}

function createDestinationsTemplate(idToDestinationMap) {
  let result = '';

  for (const destination of idToDestinationMap.values()) {
    result += (
      `<option value="${destination.name}"></option>`
    );
  }

  return result;
}

function createPhotosTemplate(photos) {
  let result = '';
  if (!photos) {
    return result;
  }

  for (const photo of photos) {
    result += `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`;
  }

  return result;
}

function createDestinationTemplate(destination) {
  if (!destination) {
    return '';
  }

  const photosTemplate = createPhotosTemplate(destination.pictures);

  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
            ${photosTemplate}
        </div>
      </div>
    </section>`
  );
}

function createOfferTemplate(offer, isDisabled) {
  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="${offer.id}" type="checkbox" name="event-offer-luggage" checked ${isDisabled ? 'disabled' : ''}>
      <label class="event__offer-label" for="${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`
  );
}

function createOffersTemplate(offers, isDisabled) {
  if (!offers || offers.length === 0) {
    return '';
  }

  let result = `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">`;

  for (const offer of offers) {
    result += createOfferTemplate(offer, isDisabled);
  }

  result += '</div></section>';
  return result;
}

function createTripPointEditTemplate(tripPoint, idToDestinationMap, typeToOffersMap) {
  const isDisabled = tripPoint.isDisabled;
  const isSaving = tripPoint.isSaving;
  const isDeleting = tripPoint.isDeleting;

  const dateFrom = toFullDateTime(tripPoint.dateFrom);
  const dateTo = toFullDateTime(tripPoint.dateTo);
  const destination = idToDestinationMap.get(tripPoint.destination);
  const destinationTemplate = createDestinationTemplate(destination);
  const offersTemplate = createOffersTemplate(typeToOffersMap.get(tripPoint.type), isDisabled);
  const eventTypesTemplate = createEventTypesTemplate();
  const destinationsTemplate = createDestinationsTemplate(idToDestinationMap);

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${tripPoint.type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${eventTypesTemplate}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${capitalize(tripPoint.type)}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination ? destination.name : ''}" list="destination-list-1" ${isDisabled ? 'disabled' : ''}>
            <datalist id="destination-list-1">
              ${destinationsTemplate}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFrom}" ${isDisabled ? 'disabled' : ''}>
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTo}" ${isDisabled ? 'disabled' : ''}>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${tripPoint.basePrice}" ${isDisabled ? 'disabled' : ''}>
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
          <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
          <button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}>
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${offersTemplate}
          ${destinationTemplate}
        </section>
      </form>
    </li>`
  );
}

export default class TripPointEditView extends AbstractStatefulView {
  #idToDestinationMap;
  #typeToOffersMap;

  #handleRollupClick;
  #handleFormSubmit;
  #handleDeleteClick;

  #dateFromDatepicker;
  #dateToDatepicker;

  constructor({
    tripPoint = BLANK_POINT, idToDestinationMap, typeToOffersMap, onRollupClick, onFormSubmit, onDeleteClick
  }) {
    super();
    this._setState(TripPointEditView.parseTripPointToState(tripPoint));
    this.#idToDestinationMap = idToDestinationMap;
    this.#typeToOffersMap = typeToOffersMap;

    this.#handleRollupClick = onRollupClick;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleDeleteClick = onDeleteClick;

    this._restoreHandlers();
  }

  get template() {
    return createTripPointEditTemplate(this._state, this.#idToDestinationMap, this.#typeToOffersMap);
  }

  static parseTripPointToState(tripPoint) {
    return {
      ...tripPoint,
      type: tripPoint.type,
      destination: tripPoint.destination,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToTripPoint(state) {
    const tripPoint = {...state};

    delete tripPoint.isDisabled;
    delete tripPoint.isSaving;
    delete tripPoint.isDeleting;

    return tripPoint;
  }

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(TripPointEditView.parseStateToTripPoint(this._state));
  };

  removeElement() {
    super.removeElement();

    if (this.#dateFromDatepicker) {
      this.#dateFromDatepicker.destroy();
      this.#dateFromDatepicker = null;
    }

    if (this.#dateToDatepicker) {
      this.#dateToDatepicker.destroy();
      this.#dateToDatepicker = null;
    }
  }

  #setDateFromDatepicker() {
    this.#dateFromDatepicker = flatpickr(
      this.element.querySelector('input[name=event-start-time]'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        defaultDate: this._state.dateFrom,
        onChange: this.#dateFromChangeHandler,
      },
    );
  }

  #dateFromChangeHandler = ([date]) => {
    this.updateElement({
      dateFrom: date,
    });
  };

  #setDateToDatepicker() {
    this.#dateToDatepicker = flatpickr(
      this.element.querySelector('input[name=event-end-time]'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        defaultDate: this._state.dateTo,
        onChange: this.#dateToChangeHandler,
      },
    );
  }

  #dateToChangeHandler = ([date]) => {
    this.updateElement({
      dateTo: date,
    });
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(TripPointEditView.parseStateToTripPoint(this._state));
  };

  _restoreHandlers() {
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#rollupClickHandler);

    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);

    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#formDeleteClickHandler);

    this.element.querySelector('input[name=event-price]')
      .addEventListener('change', this.#priceChangeHandler);

    const eventTypes = this.element.querySelectorAll('input[name=event-type]');
    for (const eventType of eventTypes) {
      eventType.addEventListener('change', () => {
        this.updateElement({type: eventType.value});
      });
    }

    const destination = this.element.querySelector('input[name=event-destination]');
    destination.addEventListener('change', () => {
      for (const d of this.#idToDestinationMap.values()) {
        if (d.name === destination.value) {
          this.updateElement({destination: d.id});
        }
      }
    });

    this.#setDateFromDatepicker();
    this.#setDateToDatepicker();
  }

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: evt.target.value,
    });
  };
}
