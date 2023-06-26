import AbstractView from '../framework/view/abstract-view';

function createNewTripPointButtonTemplate() {
  return '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';
}

export default class NewTripPointButtonView extends AbstractView {
  #handleClick;

  constructor({onClick}) {
    super();
    this.#handleClick = onClick;
    this.element.addEventListener('click', this.#newButtonClickHandler);
  }

  get template() {
    return createNewTripPointButtonTemplate();
  }

  #newButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
  };
}
