import Vue from 'vue';
import vSelect from 'vue-select';
import {
  adaptiveMixin,
  menuMixin,
  myWOW,
  goTopInit,
  webpInit, LazyLoader,
} from "./base";

webpInit();
const wow = myWOW({selector: '.animated'});
goTopInit({
  selector: '.gotop',
  offset: adaptiveMixin.computed.isDesktop() ? '100vh' : '250vh',
});

const ll = new LazyLoader({
  selector: '[data-lazy]',
});

Vue.component('v-select', vSelect);

const app = new Vue({
  el: '#app',
  mixins: [adaptiveMixin, menuMixin,],
  mounted () {
    this.ll = ll;
  }
});