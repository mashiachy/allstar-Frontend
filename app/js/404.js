import Vue from "vue";

import {adaptiveMixin, menuMixin, myWOW, LazyLoader, initialMobileScroll} from "./base";

initialMobileScroll(667, 50);

const wow = myWOW({selector: '.animated'});
const ll = new LazyLoader({
  selector: '[data-lazy]',
});

const menu = new Vue({
  el: '#header',
  mixins: [adaptiveMixin, menuMixin],
});