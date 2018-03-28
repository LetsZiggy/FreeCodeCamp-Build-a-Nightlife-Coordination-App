import {bindable, bindingMode} from 'aurelia-framework';
import {state} from './resources/services/state';

export class App {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) state = state;

  attached() {
    let data = JSON.parse(localStorage.getItem("freecodecamp-build-a-nightlife-coordination-app")) || {};

    if(data && data.userexpire > Date.now()) {
      this.state.user.username = data.username;
      this.state.user.expire = data.userexpire;
    }
  }

  configureRouter(config, router) {
    this.router = router;
    config.title = 'FreeCodeCamp - Build a Nightlife Coordination App';
    config.map([
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