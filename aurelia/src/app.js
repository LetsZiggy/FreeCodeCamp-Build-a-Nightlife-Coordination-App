import {inject, bindable, bindingMode} from 'aurelia-framework';
import {ApiInterface} from './resources/services/api-interface';
import {state} from './resources/services/state';

@inject(ApiInterface)
export class App {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) state = state;

  constructor(ApiInterface) {
    this.api = ApiInterface;
  }

  bind() {
    let data = JSON.parse(localStorage.getItem('freecodecamp-build-a-nightlife-coordination-app')) || {};

    if(data.username && data.userexpire && (parseInt(data.userexpire) - Date.now()) > 5000) {
      this.state.user.username = data.username || null;
      this.state.user.expire = parseInt(data.userexpire) || null;
    }
    else {
      data.username = this.state.user.username;
      data.userexpire = this.state.user.expire;
      localStorage.setItem('freecodecamp-build-a-nightlife-coordination-app', JSON.stringify(data));
    }
  }

  async attached() {
    if(this.state.user.username && this.state.user.expire && (this.state.user.expire - Date.now()) > 5000) {
      this.state.user.interval = setTimeout(async () => {
        let logout = await this.api.logoutUser();

        if(this.state.user.interval) {
          clearInterval(this.state.user.interval);
          this.state.user.interval = null;
        }

        this.state.user.username = null;
        this.state.user.expire = null;
        console.log('logout');
      }, (this.state.user.expire - Date.now()));
    }
    else {
      let logout = await this.api.logoutUser();

      if(this.state.user.interval) {
        clearInterval(this.state.user.interval);
        this.state.user.interval = null;
      }

      this.state.user.username = null;
      this.state.user.expire = null;
    }

    window.onbeforeunload = (event) => {
      if(this.state.user.interval) {
        clearInterval(this.state.user.interval);
        this.state.user.interval = null;
      }

      if(this.state.user.username) {
        let store = JSON.parse(localStorage.getItem('freecodecamp-build-a-nightlife-coordination-app')) || {};
        let data = { username: this.state.user.username, userexpire: this.state.user.expire };
        localStorage.setItem('freecodecamp-build-a-nightlife-coordination-app', JSON.stringify(data));
      }

      return;
    };
  }

  configureRouter(config, router) {
    this.router = router;
    config.title = 'FreeCodeCamp - Build a Nightlife Coordination App';
    config.map([
      {
        route: '',
        redirect: 'home'
      },
      {
        route: 'home',
        name: 'home',
        moduleId: './resources/modules/home',
        title: 'Home',
        nav: true,
      }
    ]);

    config.mapUnknownRoutes({ redirect: 'home' });
  }
}