import TripFiltersView from './view/trip-filters-view.js';
import TripEventsPresenter from './presenter/trip-events-presenter';
import {render} from './render.js';

const pageHeader = document.querySelector('.page-header');
const tripControlsFiltersElement = pageHeader.querySelector('.trip-controls__filters');

const siteMainElement = document.querySelector('.page-main');
const tripEventsElement = siteMainElement.querySelector('.trip-events');
const boardPresenter = new TripEventsPresenter({container: tripEventsElement});

render(new TripFiltersView(), tripControlsFiltersElement);

boardPresenter.init();
