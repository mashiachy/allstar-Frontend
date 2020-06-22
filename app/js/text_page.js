import Vue from 'vue';
import vSelect from 'vue-select';
import {adaptiveMixin, menuMixin, myWOW, goTopInit, webpInit, LazyLoader, screen, isWebp} from "./base";

webpInit();
const wow = myWOW({selector: '.animated'});
goTopInit({
  selector: '.gotop',
  offset: '100vh',
});

const ll = new LazyLoader({
  selector: '[data-lazy]',
});

const preloadBack = document.createElement('link');
preloadBack.setAttribute('rel', 'preload');
preloadBack.setAttribute('as', 'image');
let backSrc = `img/back-text${screen>=575?'':'-mobile'}.${isWebp ? 'webp' : 'jpg'}`;
preloadBack.setAttribute('href', backSrc);
document.querySelector('section.image').setAttribute('data-l-back', backSrc);
document.head.appendChild(preloadBack);

Vue.component('v-select', vSelect);

const app = new Vue({
  el: '#app',
  mixins: [adaptiveMixin, menuMixin,],
});
