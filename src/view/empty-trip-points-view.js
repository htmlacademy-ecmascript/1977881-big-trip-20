import AbstractView from '../framework/view/abstract-view.js';

function createEmptyTripPointsTemplate() {
  return (
    `<p class="trip-events__msg">
      Click New Event to create your first point
    </p>`
  );
}

export default class EmptyTripPointsView extends AbstractView {
  get template() {
    return createEmptyTripPointsTemplate();
  }
}
