import TripPointEditView from '../view/trip-point-edit-view';
import {remove, render, RenderPosition} from '../framework/render';
import {UpdateType, UserAction} from '../utils/constants';

export default class NewTripPointPresenter {
  #idToDestinationMap;
  #typeToOffersMap;

  #tripPointsContainer;
  #handleDataChange;
  #handleDestroy;

  #tripPointEditComponent;

  constructor({idToDestinationMap, typeToOffersMap, tripPointsContainer, onDataChange, onDestroy}) {
    this.#idToDestinationMap = idToDestinationMap;
    this.#typeToOffersMap = typeToOffersMap;
    this.#tripPointsContainer = tripPointsContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#tripPointEditComponent) {
      return;
    }

    this.#tripPointEditComponent = new TripPointEditView({
      idToDestinationMap: this.#idToDestinationMap,
      typeToOffersMap: this.#typeToOffersMap,
      onRollupClick: this.#handleRollupClick,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick
    });

    render(this.#tripPointEditComponent, this.#tripPointsContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (!this.#tripPointEditComponent) {
      return;
    }

    this.#handleDestroy();

    remove(this.#tripPointEditComponent);
    this.#tripPointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#tripPointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#tripPointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#tripPointEditComponent.shake(resetFormState);
  }

  #handleRollupClick = () => {
    this.destroy();
  };

  #handleFormSubmit = (tripPoint) => {
    this.#handleDataChange(
      UserAction.ADD_TRIP_POINT,
      UpdateType.MINOR,
      tripPoint,
    );
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
