export const state = {
  login: {
    chance: 2,
    delay: 0,
    timer: 0,
    interval: null
  },
  user: {
    username: null,
    expire: null,
    going: [],
    pending: []
  },
  totalGoing: { 'tian-tian-hainanese-chicken-rice-singapore-7':5 },
  places: []
};

let places = 
[{
  "id": "tian-tian-hainanese-chicken-rice-singapore-7",
  "name": "Tian Tian Hainanese Chicken Rice",
  "image_url": "https://s3-media2.fl.yelpcdn.com/bphoto/Q-guKqceInGAyGMtCuszPQ/o.jpg",
  "is_closed": false,
  "url": "https://www.yelp.com/biz/tian-tian-hainanese-chicken-rice-singapore-7?adjust_creative=FPHch0ayErMYY6DUuNzTwg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=FPHch0ayErMYY6DUuNzTwg",
  "review_count": 262,
  "categories": [
      {
          "alias": "hainan",
          "title": "Hainan"
      }
  ],
  "rating": 4,
  "coordinates": {
      "latitude": 1.28035,
      "longitude": 103.84472
  },
  "transactions": [],
  "price": "$",
  "location": {
      "address1": "1 Kadayanallur St",
      "address2": "#01 -10/11",
      "address3": "Maxwell Food Center",
      "city": "Singapore",
      "zip_code": "069120",
      "country": "SG",
      "state": "SG",
      "display_address": [
          "1 Kadayanallur St",
          "#01 -10/11",
          "Maxwell Food Center",
          "Singapore 069120",
          "Singapore"
      ]
  },
  "phone": "+6596914852",
  "display_phone": "+65 9691 4852",
  "distance": 3781.3171364230475
},
{
  "id": "league-of-captains-kuala-lumpur-2",
  "name": "League Of Captains",
  "image_url": "https://s3-media3.fl.yelpcdn.com/bphoto/JzvYGzs8dq6Tusw6Lp_03A/o.jpg",
  "is_closed": false,
  "url": "https://www.yelp.com/biz/league-of-captains-kuala-lumpur-2?adjust_creative=FPHch0ayErMYY6DUuNzTwg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=FPHch0ayErMYY6DUuNzTwg",
  "review_count": 11,
  "categories": [
      {
          "alias": "cafes",
          "title": "Cafes"
      },
      {
          "alias": "coffee",
          "title": "Coffee & Tea"
      },
      {
          "alias": "breakfast_brunch",
          "title": "Breakfast & Brunch"
      }
  ],
  "rating": 4.5,
  "coordinates": {
      "latitude": 3.15841590654982,
      "longitude": 101.699651889503
  },
  "transactions": [],
  "price": "$",
  "location": {
      "address1": "42-50, Jalan Doraisamy",
      "address2": "The Row",
      "address3": "",
      "city": "Kuala Lumpur",
      "zip_code": "50300",
      "country": "MY",
      "state": "14",
      "display_address": [
          "42-50, Jalan Doraisamy",
          "The Row",
          "50300 Kuala Lumpur",
          "Malaysia"
      ]
  },
  "phone": "+60326022281",
  "display_phone": "+60 3-2602 2281",
  "distance": 775.783488987664
}];

setTimeout(() => { state.places = places.map(v => v); }, 0);