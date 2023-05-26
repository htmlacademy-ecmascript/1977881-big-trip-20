import {getRandomValue, getRandomInteger} from '../utils.js';
const CITIES = [
  'Chamonix',
  'Geneva',
  'Amsterdam',
  'Helsinki',
  'Oslo',
  'Moskow'
];

const DESCRIPTION = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.'
];
const Price = {
  MIN: 1,
  MAX: 1000
};

const TYPE = [
  'bus',
  'train',
  'taxi',
  'Ship',
  'Drive',
  'Flight'
];


function tripPointStub () {

  return {
    'name': getRandomValue(CITIES),
    'basePrice': getRandomInteger(Price.MIN, (Price.MAX / 10)),
    'destination': {
      'description':getRandomValue(DESCRIPTION),
      'name': getRandomValue(CITIES),
      'pictures': [
        {
          'src': 'https://20.objects.pages.academy/static/destinations/4.jpg',
          'description': `${CITIES} for those who value comfort and coziness`
        },
        {
          'src': 'https://20.objects.pages.academy/static/destinations/12.jpg',
          'description': `${CITIES} a true asian pearl`
        }
      ]
    },
    'dateFrom': '2023-06-14T01:28:01.397Z',
    'dateTo': '2023-06-15T07:28:01.397Z',
    'isFavorite': true,
    'offers': [
      {
        'id': '123',
        'type': 'taxi',
        'title': 'Upgrade to a business class',
        'price': getRandomInteger(Price.MIN, (Price.MAX / 10))
      },
      {
        'type': 'train',
        'title': 'Book a taxi at the arrival point',
        'price': getRandomInteger(Price.MIN, (Price.MAX / 10))
      }
    ],
    'type': getRandomValue(TYPE) };
}


export {tripPointStub};
