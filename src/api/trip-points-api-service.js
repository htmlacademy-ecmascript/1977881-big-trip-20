import ApiService from '../framework/api-service';

const Method = {
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};

export default class TripPointsApiService extends ApiService {
  get tripPoints() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  async updateTripPoint(tripPoint) {
    const response = await this._load({
      url: `points/${tripPoint.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(tripPoint)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  }

  async addTripPoint(tripPoint) {
    const response = await this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(tripPoint)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  }

  async deleteTripPoint(tripPoint) {
    return await this._load({
      url: `points/${tripPoint.id}`,
      method: Method.DELETE
    });
  }

  #adaptToServer(tripPointRequest) {
    const result = {
      ...tripPointRequest,
      'base_price': parseInt(tripPointRequest.basePrice, 10),
      'date_from': tripPointRequest.dateFrom instanceof Date
        ? tripPointRequest.dateFrom.toISOString()
        : null,
      'date_to': tripPointRequest.dateTo instanceof Date
        ? tripPointRequest.dateTo.toISOString()
        : null,
      'is_favorite': tripPointRequest.isFavorite
    };

    delete result.basePrice;
    delete result.dateFrom;
    delete result.dateTo;
    delete result.isFavorite;

    return result;
  }
}
