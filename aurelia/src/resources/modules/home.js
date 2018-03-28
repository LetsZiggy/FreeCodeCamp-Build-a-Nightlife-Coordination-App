import {inject, bindable, bindingMode} from 'aurelia-framework';
import PerfectScrollbar from 'perfect-scrollbar';
import {ApiInterface} from '../services/api-interface';
import {state} from '../services/state';

@inject(ApiInterface)
export class Home {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) state = state;

  constructor(ApiInterface) {
    this.api = ApiInterface;
  }

  attached() {
    this.checkUser = setInterval(() => {
      if(this.state.user.username && this.state.user.expire < Date.now()) {
        this.state.user.username = null;
        this.state.user.expire = null;
      }
    }, 600000);

    this.ps = new PerfectScrollbar('#results');

    window.onunload = async (event) => {
      if(this.state.user.username) {
        let data = { username: this.state.user.username, userexpire: this.state.user.expire };
        localStorage.setItem('freecodecamp-build-a-nightlife-coordination-app', JSON.stringify(data));
      }

      clearInterval(this.checkUser);
    };
  }

  detached() {
    clearInterval(this.checkUser);
    this.ps.destroy();
    this.ps = null;
  }

  handleForm(form) {

  }

  setRatings(i, rating) {
    i = rating - i;

    if(i === 0.5) {
      return('https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_star_half_black_24px.svg');
    }
    else if(i <= 0) {
      return('https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_star_border_black_24px.svg');
    }
    else {
      return('https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_star_black_24px.svg');
    }
  }

  setMap(location) {
    let address = '';

    Object.entries(location).forEach((v, i, a) => {
      if(v[0] !== 'display_address' && v[0] !== 'address2' && v[0] !== 'address3') {
        if(v[1] !== null && v[1].length > 0) {
          v[1] = v[1].replace(/\s/g, '+');
          address += v[1];

          if(v[0] !== 'state') {
            address += '+';
          }
        }
      }
    });

    return(`https://www.google.com/maps/place/${address}/`);
  }

  setRSVP(id) {
    // check if logged in
    // if not logged in
    //   show login element
    // if/after logged in
    //   submit place.id & user.username
    //   update state.rsvp list
  }
}