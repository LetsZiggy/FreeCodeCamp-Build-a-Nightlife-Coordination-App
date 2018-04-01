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
  location: null,
  totalGoing: {},
  places: []
};