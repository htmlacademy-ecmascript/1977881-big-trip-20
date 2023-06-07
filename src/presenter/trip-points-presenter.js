import TripSortView from '../view/trip-sort-view';
import TripPointListView from '../view/trip-point-list-view';
import TripPointEditView from '../view/trip-point-edit-view';
import TripPointView from '../view/trip-point-view';
import {render, replace} from '../framework/render';
import EmptyTripPointsView from '../view/empty-trip-points-view';


export default class TripPointsPresenter {
  #container = null;
  #tripPointModel = null;

  #tripSortComponent = new TripSortView();
  #tripPointListComponent = new TripPointListView();


  constructor({container, tripPointModel}) {
    this.#container = container;
    this.#tripPointModel = tripPointModel;
  }

  init() {
    const tripPoints = [...this.#tripPointModel.tripPoints];
    render(this.#tripSortComponent, this.#container);

    if (tripPoints.length === 0) {
      render(new EmptyTripPointsView(), this.#container);
      return;
    }

    render(this.#tripPointListComponent, this.#container);

    for (const tripPoint of tripPoints) {
      this.#renderTripPoint(tripPoint);
    }
  }

  #renderTripPoint(tripPoint) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const tripPointComponent = new TripPointView({
      tripPoint,
      onRollupClick: () => {
        replacePointToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const tripPointEditComponent = new TripPointEditView({
      tripPoint,
      onRollupClick: () => {
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onFormSubmit: () => {
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replaceFormToPoint() {
      replace(tripPointComponent, tripPointEditComponent);
    }

    function replacePointToForm() {
      replace(tripPointEditComponent, tripPointComponent);
    }

    render(tripPointComponent, this.#tripPointListComponent.element);
  }
}
