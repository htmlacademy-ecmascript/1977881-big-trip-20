import TripPointsModel from './model/trip-points-model';
import TripInfoView from './view/trip-info-view';
import {render, RenderPosition} from './framework/render';
import MainPresenter from './presenter/main-presenter';
import DestinationsModel from './model/destinations-model';
import OffersModel from './model/offers-model';
import TripFiltersPresenter from './presenter/trip-filters-presenter';
import FilterModel from './model/filter-model';
import NewTripPointButtonView from './view/new-trip-point-button-view';
import TripPointsApiService from './api/trip-points-api-service';
import DestinationsApiService from './api/destinations-api-service';
import OffersApiService from './api/offers-api-service';

const END_POINT = 'https://20.ecmascript.pages.academy/big-trip';
const AUTHORIZATION = 'Basic RGVuaXNCb2dkYW5vdg==';

const pageHeaderElement = document.querySelector('.page-header');
const tripMainElement = pageHeaderElement.querySelector('.trip-main');
const tripControlsFiltersElement = pageHeaderElement.querySelector('.trip-controls__filters');

const tripPointsElement = document.querySelector('.trip-events');

const tripPointsModel = new TripPointsModel({
  tripPointsApiService: new TripPointsApiService(END_POINT, AUTHORIZATION)
});

const destinationsModel = new DestinationsModel({
  destinationsApiService: new DestinationsApiService(END_POINT, AUTHORIZATION)
});

const offersModel = new OffersModel({
  offersApiService: new OffersApiService(END_POINT, AUTHORIZATION)
});

const filterModel = new FilterModel();


render(new TripInfoView(), tripMainElement, RenderPosition.AFTERBEGIN);

const tripFilterPresenter = new TripFiltersPresenter({
  tripFilterContainer: tripControlsFiltersElement,
  filterModel,
  tripPointsModel
});

const newTripPointButtonComponent = new NewTripPointButtonView({
  onClick: handleNewTripPointButtonClick
});

const mainPresenter = new MainPresenter({
  container: tripPointsElement,
  tripPointsModel,
  destinationsModel,
  offersModel,
  filterModel,
  onNewTripPointDestroy: handleNewTripPointFormClose
});

function handleNewTripPointButtonClick() {
  mainPresenter.createTripPoint();
  newTripPointButtonComponent.element.disabled = true;
}

function handleNewTripPointFormClose() {
  newTripPointButtonComponent.element.disabled = false;
}

tripFilterPresenter.init();
mainPresenter.init();

destinationsModel.init()
  .then(() => offersModel.init())
  .then(() => tripPointsModel.init())
  .finally(() => {
    render(newTripPointButtonComponent, tripMainElement);
  });
