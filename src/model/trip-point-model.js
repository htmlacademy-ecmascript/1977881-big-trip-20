import {tripPointStub} from '../stub/trip-point-stub';

export default class TripPointModel {
  #tripPoints = Array.of(tripPointStub, tripPointStub, tripPointStub);

  get tripPoints() {
    return this.#tripPoints;
  }
}
