import Vue from 'vue';
import vSelect from 'vue-select';
import Siema from 'vue2-siema';
import {
  adaptiveMixin,
  filterMixin,
  listingsMixin,
  menuMixin,
  myWOW,
  goTopInit,
  webpInit, LazyLoader, siemaLazyInitMixin
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
Vue.use(Siema);

const app = new Vue({
  el: '#app',
  mixins: [adaptiveMixin, menuMixin, filterMixin, listingsMixin, siemaLazyInitMixin,],
  mounted () {
    this.ll = ll;
  }
});