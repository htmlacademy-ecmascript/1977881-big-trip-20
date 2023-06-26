import {FilterType, UpdateType} from '../utils/constants';
import TripFiltersView from '../view/trip-filters-view';
import {remove, render, replace} from '../framework/render';

export default class TripFiltersPresenter {
  #tripFilterContainer;
  #filterModel;
  #tripPointsModel;

  #tripFilterComponent;

  constructor({tripFilterContainer, filterModel, tripPointsModel}) {
    this.#tripFilterContainer = tripFilterContainer;
    this.#filterModel = filterModel;
    this.#tripPointsModel = tripPointsModel;

    this.#tripPointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    return Object.values(FilterType);
  }

  init() {
    const prevFilterComponent = this.#tripFilterComponent;

    this.#tripFilterComponent = new TripFiltersView({
      filters: this.filters,
      currentFilterType: this.#filterModel.filter,
      onFilterChangeType: this.#handleFilterTypeChange
    });

    if (!prevFilterComponent) {
      render(this.#tripFilterComponent, this.#tripFilterContainer);
      return;
    }

    replace(this.#tripFilterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
