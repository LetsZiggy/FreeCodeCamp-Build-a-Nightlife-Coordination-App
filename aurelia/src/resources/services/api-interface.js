import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';

@inject(HttpClient)
export class ApiInterface {
  constructor(HttpClient) {
    HttpClient.configure(config => {
      config.withBaseUrl('http://localhost:3000/api')
      // config.withBaseUrl('https://letsziggy-freecodecamp-build-a-voting-app.glitch.me/api')
            .withInterceptor({
              request(request) {
                return request;
              },
              requestError(requestError) {
                console.log(requestError);
                return requestError;
              },
              response(response) {
                return response;
              },
              responseError(responseError) {
                console.log(responseError);
                return responseError;
              }
      });
    });
    this.http = HttpClient;
  }

  getPlaces(location) {
    return(
      this.http.fetch(`/places`, {
                 method: 'POST',
                 credentials: 'same-origin',
                 headers: {
                   'Accept': 'application/json',
                   'Content-Type': 'application/json'
                 },
                 body: JSON.stringify({ location: location })
               })
               .then(response => response.json())
               .then(data => data)
    );
  }

  setRSVP(place, user) {
    return(
      this.http.fetch(`/setRSVP/${place}`, {
                 method: 'POST',
                 credentials: 'same-origin',
                 headers: {
                   'Accept': 'application/json',
                   'Content-Type': 'application/json'
                 },
                 body: JSON.stringify({ place: place, user: user })
               })
               .then(response => response.json())
               .then(data => data)
    );
  }

  unsetRSVP(place, user) {
    return(
      this.http.fetch(`/unsetRSVP/${place}`, {
                 method: 'POST',
                 credentials: 'same-origin',
                 headers: {
                   'Accept': 'application/json',
                   'Content-Type': 'application/json'
                 },
                 body: JSON.stringify({ place: place, user: user })
               })
               .then(response => response.json())
               .then(data => data)
    );
  }

  getUserNames(username) {
    return(
      this.http.fetch(`/user/checkname`, {
                 method: 'POST',
                 credentials: 'same-origin',
                 headers: {
                   'Accept': 'application/json',
                   'Content-Type': 'application/json'
                 },
                 body: JSON.stringify({ username: username })
               })
               .then(response => response.json())
               .then(data => data.taken)
    );
  }

  createUser(user) {
    return(
      this.http.fetch(`/user/create`, {
                 method: 'POST',
                 credentials: 'same-origin',
                 headers: {
                   'Accept': 'application/json',
                   'Content-Type': 'application/json'
                 },
                 body: JSON.stringify(user)
               })
               .then(response => response.json())
               .then(data => data)
    );
  }

  getUser(user) {
    return(
      this.http.fetch(`/user/login`, {
                 method: 'POST',
                 credentials: 'same-origin',
                 headers: {
                   'Accept': 'application/json',
                   'Content-Type': 'application/json'
                 },
                 body: JSON.stringify(user)
               })
               .then(response => response.json())
               .then(data => data)
    );
  }

  logoutUser() {
    return(
      this.http.fetch(`/user/logout`, {
                 method: 'POST',
                 credentials: 'same-origin',
                 headers: {
                   'Accept': 'application/json'
                 }
               })
               .then(response => response.json())
               .then(data => data)
    );
  }

  editUser(user) {
    return(
      this.http.fetch(`/user/edit`, {
                 method: 'POST',
                 credentials: 'same-origin',
                 headers: {
                   'Accept': 'application/json',
                   'Content-Type': 'application/json'
                 },
                 body: JSON.stringify(user)
               })
               .then(response => response.json())
               .then(data => data)
    );
  }
}