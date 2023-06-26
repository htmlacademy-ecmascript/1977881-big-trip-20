import Observable from '../framework/observable';
import {UpdateType} from '../utils/constants';

export default class TripPointsModel extends Observable {
  #tripPointsApiService;
  #tripPoints = [];

  constructor({tripPointsApiService}) {
    super();
    this.#tripPointsApiService = tripPointsApiService;
  }

  async init() {
    try {
      const tripPoints = await this.#tripPointsApiService.tripPoints;
      this.#tripPoints = tripPoints.map(this.#adaptToClient);
    } catch (e) {
      this.#tripPoints = [];
      this._notify(UpdateType.INIT, {isError: true});
    }

    this._notify(UpdateType.INIT, {isError: false});
  }

  get tripPoints() {
    return this.#tripPoints;
  }

  async updateTripPoint(updateType, updatedTripPoint) {
    const index = this.#tripPoints.findIndex((tripPoint) => tripPoint.id === updatedTripPoint.id);

    if (index === -1) {
      throw new Error('Can\'t update non-existing trip point');
    }

    try {
      const response = await this.#tripPointsApiService.updateTripPoint(updatedTripPoint);
      this.#tripPoints[index] = this.#adaptToClient(response);
      this._notify(updateType, updatedTripPoint);
    } catch (e) {
      throw new Error('Can\'t update trip point');
    }
  }

  async addTripPoint(updateType, newTripPoint) {
    try {
      const response = await this.#tripPointsApiService.addTripPoint(newTripPoint);
      this.#tripPoints = [
        this.#adaptToClient(response),
        ...this.#tripPoints,
      ];

      this._notify(updateType, newTripPoint);
    } catch (e) {
      throw new Error('Can\'t add trip point');
    }
  }

  async deleteTripPoint(updateType, tripPointToDelete) {
    const index = this.#tripPoints.findIndex((tripPoint) => tripPoint.id === tripPointToDelete.id);

    if (index === -1) {
      throw new Error('Can\'t delete non-existent trip-point');
    }

    try {
      await this.#tripPointsApiService.deleteTripPoint(tripPointToDelete);
      this.#tripPoints = [
        ...this.#tripPoints.slice(0, index),
        ...this.#tripPoints.slice(index + 1),
      ];

      this._notify(updateType);
    } catch (e) {
      throw new Error('Can\'t delete trip point');
    }
  }

  #adaptToClient(tripPointResponse) {
    const result = {
      ...tripPointResponse,
      basePrice: tripPointResponse['base_price'],
      dateFrom: tripPointResponse['date_from'] !== null
        ? new Date(tripPointResponse['date_from'])
        : null,
      dateTo: tripPointResponse['date_to'] !== null
        ? new Date(tripPointResponse['date_to'])
        : null,
      isFavorite: tripPointResponse['is_favorite']
    };

    delete result['base_price'];
    delete result['date_from'];
    delete result['date_to'];
    delete result['is_favorite'];

    return result;
  }
}
