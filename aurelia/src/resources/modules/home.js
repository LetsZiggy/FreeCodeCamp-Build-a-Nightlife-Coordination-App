import {inject, bindable, bindingMode} from 'aurelia-framework';
import PerfectScrollbar from 'perfect-scrollbar';
import {ApiInterface} from '../services/api-interface';
import {state} from '../services/state';

@inject(ApiInterface)
export class Home {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) state = state;

  constructor(ApiInterface) {
    this.api = ApiInterface;
    this.radio = null;
  }

  async attached() {
    // let location = document.cookie.replace(/(?:(?:^|.*;\s*)ipinfo\s*\=\s*([^;]*).*$)|^.*$/, "$1");

    if(this.state.user.username && this.state.user.expire && this.state.user.expire - Date.now() > 1) {
      setTimeout(async () => {
        let logout = await this.api.logoutUser();
        this.state.user.username = null;
        this.state.user.expire = null;
      }, this.state.user.expire - Date.now());
    }

    this.ps = new PerfectScrollbar('#results');

    window.onunload = async (event) => {
      if(this.state.user.username) {
        let data = JSON.parse(localStorage.getItem("freecodecamp-build-a-nightlife-coordination-app")) || {};
        data.username = this.state.user.username;
        data.userexpire = this.state.user.expire;
        localStorage.setItem('freecodecamp-build-a-nightlife-coordination-app', JSON.stringify(data));
      }
    };
  }

  detached() {
    this.ps.destroy();
    this.ps = null;
  }

  async openLogin() {
    if(this.state.user.username) {
      let data = JSON.parse(localStorage.getItem("freecodecamp-build-a-nightlife-coordination-app")) || {};
      let logout = await this.api.logoutUser();
      this.state.user.username = null;
      this.state.user.expire = null;

      data.username = this.state.user.username;
      data.userexpire = this.state.user.expire;
      localStorage.setItem('freecodecamp-build-a-nightlife-coordination-app', JSON.stringify(data));
    }
    else {
      if(this.state.login.timer) {
        this.radio = 'radio-signin';
        document.getElementById('radio-delay').checked = true;
        this.setTimerInterval(this.state, this.radio, 'signin');
      }
      document.getElementById('login-content').style.display = 'flex';
    }
  }

  async handleSearch(form) {
    let data = null;
    if(document.getElementById(form).value.length) {
      data = await this.api.getPlaces(document.getElementById(form).value);
    }
    console.log(data);
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

  async setRSVP(id) {
    if(!this.state.user.username) {
      document.getElementById('login-content').style.display = 'flex';
      this.state.user.pending.push(id);

      // login component need to handle id
    }
    else {
      //   submit place.id & user.username
      //   need to set date
      //   update state.totalGoing list
      //   update state.user.going list
    }
  }

  resetForm(form) {
    form.reset();
    Array.from(form.children).forEach((v, i, a) => {
      if(v.children[0].hasAttribute('data-length') && v.children[0].getAttribute('data-length') !== '0') {
        v.children[0].setAttribute('data-length', 0);
      }
    });
  }

  setTimerInterval(state, radio, form) {
    state.login.interval = setInterval(() => {
      state.login.timer--;
      if(state.login.timer === 0) {
        document.getElementById(radio).checked = true;
        document.getElementById('wrong-login').style.display = 'none';
        this.resetForm(document.getElementById(form));
        clearInterval(state.login.interval);
      }
    }, 1000);
  }
}