import AbstractView from '../framework/view/abstract-view.js';

function createEmptyTripPointsTemplate() {
  return (
    `<p class="trip-events__msg">
        Server Error. Please try again later.
    </p>`
  );
}

export default class ServerErrorView extends AbstractView {
  #filterType;

  get template() {
    return createEmptyTripPointsTemplate(this.#filterType);
  }
}
