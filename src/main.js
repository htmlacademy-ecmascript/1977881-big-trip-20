import {render, RenderPosition} from './render';
import TripPointsPresenter from './presenter/trip-points-presenter';
import TripFiltersView from './view/trip-filters-view';
import TripPointModel from './model/trip-point-model';
import TripInfoView from './view/trip-info-view';

const pageHeader = document.querySelector('.page-header');
const tripMain = pageHeader.querySelector('.trip-main');
const tripControlsFiltersElement = pageHeader.querySelector('.trip-controls__filters');

const siteMainElement = document.querySelector('.page-main');
const tripEventsElement = siteMainElement.querySelector('.trip-events');

render(new TripInfoView(), tripMain, RenderPosition.AFTERBEGIN);
render(new TripFiltersView(), tripControlsFiltersElement, RenderPosition.BEFOREEND);

const tripPointModel = new TripPointModel();
const boardPresenter = new TripPointsPresenter({
  container: tripEventsElement,
  tripPointModel: tripPointModel
});

boardPresenter.init();
