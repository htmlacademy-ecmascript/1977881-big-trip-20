import TripSortView from '../view/trip-sort-view';
import TripPointListView from '../view/trip-point-list-view';
import {remove, render, RenderPosition} from '../framework/render';
import EmptyTripPointsView from '../view/empty-trip-points-view';
import TripPointPresenter from './trip-point-presenter';
import {FilterType, SortType, UpdateType, UserAction} from '../utils/constants';
import {sortByDayAsc, sortByDurationDesc, sortByPriceDesc} from '../utils/sort-utils';
import {filter} from '../utils/filter-utils';
import NewTripPointPresenter from './new-trip-point-presenter';
import LoadingView from '../view/loading-view';
import ServerErrorView from '../view/server-error-view';


export default class MainPresenter {
  #container;
  #tripPointsModel;
  #filterModel;
  #destinationsModel;
  #offersModel;

  #tripSortComponent;
  #tripPointListComponent = new TripPointListView();
  #loadingComponent = new LoadingView();
  #emptyTripPointsListComponent;

  #idToTripPointsPresentersMap = new Map();
  #newTripPointPresenter;

  #currentSortType = SortType.BY_DAY;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;
  #isServerError = false;

  #idToDestinationMap = new Map();
  #typeToOffersMap = new Map();

  constructor({container, tripPointsModel, destinationsModel, offersModel, filterModel, onNewTripPointDestroy}) {
    this.#container = container;
    this.#tripPointsModel = tripPointsModel;
    this.#filterModel = filterModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#tripPointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#newTripPointPresenter = new NewTripPointPresenter({
      idToDestinationMap: this.#idToDestinationMap,
      typeToOffersMap: this.#typeToOffersMap,
      tripPointsContainer: this.#tripPointListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewTripPointDestroy
    });
  }

  init() {
    this.#renderMain();
  }

  get tripPoints() {
    this.#filterType = this.#filterModel.filter;
    const tripPoints = this.#tripPointsModel.tripPoints;
    const filteredTripPoints = filter[this.#filterType](tripPoints);

    switch (this.#currentSortType) {
      case SortType.BY_DAY:
        return filteredTripPoints.sort(sortByDayAsc);
      case SortType.BY_PRICE:
        return filteredTripPoints.sort(sortByPriceDesc);
      case SortType.BY_DURATION:
        return filteredTripPoints.sort(sortByDurationDesc);
    }

    return this.#tripPointsModel.tripPoints;
  }

  #renderMain = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.#isServerError) {
      this.#emptyTripPointsListComponent = new ServerErrorView();
      render(this.#emptyTripPointsListComponent, this.#container);
      return;
    }

    if (this.tripPoints.length === 0) {
      this.#emptyTripPointsListComponent = new EmptyTripPointsView({
        filterType: this.#filterType
      });

      render(this.#emptyTripPointsListComponent, this.#container);
      return;
    }

    this.#renderSort();
    render(this.#tripPointListComponent, this.#container);
    this.#renderTripPoints();
  };

  createTripPoint() {
    this.#currentSortType = SortType.BY_DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newTripPointPresenter.init();
  }

  #handleViewAction = async (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_TRIP_POINT:
        this.#idToTripPointsPresentersMap.get(update.id).setSaving();
        try {
          await this.#tripPointsModel.updateTripPoint(updateType, update);
        } catch (e) {
          this.#idToTripPointsPresentersMap.get(update.id).setAborting();
        }

        break;
      case UserAction.ADD_TRIP_POINT:
        this.#newTripPointPresenter.setSaving();
        try {
          await this.#tripPointsModel.addTripPoint(updateType, update);
        } catch (e) {
          this.#newTripPointPresenter.setAborting();
        }

        break;
      case UserAction.DELETE_TRIP_POINT:
        this.#idToTripPointsPresentersMap.get(update.id).setDeleting();
        try {
          await this.#tripPointsModel.deleteTripPoint(updateType, update);
        } catch (e) {
          this.#idToTripPointsPresentersMap.get(update.id).setAborting();
        }

        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#idToTripPointsPresentersMap.get(data.id).init(data, this.#idToDestinationMap, this.#typeToOffersMap);
        break;
      case UpdateType.MINOR:
        this.#clearMain();
        this.#renderMain();
        break;
      case UpdateType.MAJOR:
        this.#clearMain({resetSortType: true});
        this.#renderMain();
        break;
      case UpdateType.INIT:
        this.#isServerError = data.isError;
        this.#isLoading = false;
        remove(this.#loadingComponent);
        for (const destination of this.#destinationsModel.destinations) {
          this.#idToDestinationMap.set(destination.id, destination);
        }
        for (const offerByType of this.#offersModel.offers) {
          this.#typeToOffersMap.set(offerByType.type, offerByType.offers);
        }
        this.#renderMain();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (!sortType || this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearMain();
    this.#renderMain();
  };

  #renderSort() {
    this.#tripSortComponent = new TripSortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#tripSortComponent, this.#container);
  }

  #handleModeChange = () => {
    this.#newTripPointPresenter.destroy();
    this.#idToTripPointsPresentersMap.forEach((presenter) => presenter.resetView());
  };

  #renderTripPoints() {
    for (const tripPoint of this.tripPoints) {
      const tripPointsPresenter = new TripPointPresenter({
        tripPointsContainer: this.#tripPointListComponent.element,
        onDataChange: this.#handleViewAction,
        onModeChange: this.#handleModeChange
      });

      tripPointsPresenter.init(tripPoint, this.#idToDestinationMap, this.#typeToOffersMap);
      this.#idToTripPointsPresentersMap.set(tripPoint.id, tripPointsPresenter);
    }
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#tripPointListComponent.element, RenderPosition.AFTERBEGIN);
  }

  #clearMain({resetSortType = false} = {}) {
    this.#newTripPointPresenter.destroy();
    this.#idToTripPointsPresentersMap.forEach((presenter) => presenter.destroy());
    this.#idToTripPointsPresentersMap.clear();

    remove(this.#tripSortComponent);
    remove(this.#loadingComponent);

    if (this.#emptyTripPointsListComponent) {
      remove(this.#emptyTripPointsListComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.BY_DAY;
    }
  }
}
