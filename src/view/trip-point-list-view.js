import AbstractView from '../framework/view/abstract-view';

function createTripPointsTemplate() {
  return '<ul class="trip-events__list"></ul>';
}

export default class TripPointListView extends AbstractView {
  get template() {
    return createTripPointsTemplate();
  }
}

