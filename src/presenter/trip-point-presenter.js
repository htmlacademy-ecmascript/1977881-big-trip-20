import TripPointView from '../view/trip-point-view';
import TripPointEditView from '../view/trip-point-edit-view';
import {remove, render, replace} from '../framework/render';
import {UpdateType, UserAction} from '../constants';
import {areDatesEqual} from '../utils/utils';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class TripPointPresenter {
  #tripPointsContainer;
  #handleDataChange;
  #handleModeChange;

  #tripPointComponent;
  #tripPointEditComponent;

  #tripPoint;
  #idToDestinationMap;
  #typeToOffersMap;
  #mode = Mode.DEFAULT;

  constructor({tripPointsContainer, onDataChange, onModeChange}) {
    this.#tripPointsContainer = tripPointsContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(tripPoint, idToDestinationMap, typeToOffersMap) {
    this.#tripPoint = tripPoint;

    const prevTripPointComponent = this.#tripPointComponent;
    const prevTripPointEditComponent = this.#tripPointEditComponent;

    this.#idToDestinationMap = idToDestinationMap;
    this.#typeToOffersMap = typeToOffersMap;

    this.#tripPointComponent = this.#createTripPointView();

    this.#tripPointEditComponent = new TripPointEditView({
      tripPoint,
      idToDestinationMap,
      typeToOffersMap,
      onRollupClick: this.#handleRollupClick,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick
    });

    if (!prevTripPointComponent || !prevTripPointEditComponent) {
      render(this.#tripPointComponent, this.#tripPointsContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#tripPointComponent, prevTripPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#tripPointComponent, prevTripPointEditComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevTripPointComponent);
    remove(prevTripPointEditComponent);
  }

  destroy() {
    remove(this.#tripPointComponent);
    remove(this.#tripPointEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  }

  #createTripPointView() {
    return new TripPointView({
      tripPoint: this.#tripPoint,
      idToDestinationMap: this.#idToDestinationMap,
      typeToOffersMap: this.#typeToOffersMap,
      onRollupClick: () => {
        this.#replacePointToForm();
        document.addEventListener('keydown', this.#escKeyDownHandler);
      },
      onFavoriteClick: () => {
        this.#handleDataChange(
          UserAction.UPDATE_TRIP_POINT,
          UpdateType.MINOR,
          {...this.#tripPoint, isFavorite: !this.#tripPoint.isFavorite}
        );
      }
    });
  }

  #handleFormSubmit = (updatedTripPoint) => {
    const isMinorUpdate =
      !areDatesEqual(this.#tripPoint.dateFrom, updatedTripPoint.dateFrom)
      || !areDatesEqual(this.#tripPoint.dateTo, updatedTripPoint.dateTo)
      || this.#tripPoint.basePrice !== updatedTripPoint.basePrice;

    this.#handleDataChange(
      UserAction.UPDATE_TRIP_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      updatedTripPoint
    );
  };

  #handleDeleteClick = (tripPoint) => {
    this.#handleDataChange(
      UserAction.DELETE_TRIP_POINT,
      UpdateType.MINOR,
      tripPoint
    );
  };

  #handleRollupClick = () => {
    this.#replaceFormToPoint();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#tripPointEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#tripPointEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#tripPointEditComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#tripPointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#tripPointEditComponent.shake(resetFormState);
  }

  #replaceFormToPoint() {
    replace(this.#tripPointComponent, this.#tripPointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #replacePointToForm() {
    replace(this.#tripPointEditComponent, this.#tripPointComponent);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }
}
