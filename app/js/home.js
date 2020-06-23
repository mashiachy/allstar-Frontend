import Vue from "vue";
import vSelect from 'vue-select';
import Siema from 'vue2-siema';

import {
  adaptiveMixin,
  menuMixin,
  listingsMixin,
  myWOW,
  goTopInit,
  webpInit,
  isWebp,
  LazyLoader,
  screen, siemaLazyInitMixin,
} from "./base";

webpInit();
const wow = myWOW({selector: '.animated'});
goTopInit({
  selector: '.gotop',
  offset: adaptiveMixin.computed.isDesktop() ? '100vh' : '250vh',
});

const preloadBack = document.createElement('link');
preloadBack.setAttribute('rel', 'preload');
preloadBack.setAttribute('as', 'image');
let backSrc = `img/back-${screen>=1024?'desktop':screen>=700?'tab':screen>568?'mobile':'small'}.${isWebp ? 'webp' : 'jpg'}`;
preloadBack.setAttribute('href', backSrc);
document.querySelector('.background').setAttribute('data-l-back', backSrc);
document.head.appendChild(preloadBack);

const ll = new LazyLoader({
  selector: '[data-lazy]',
});

const handler = () => {
  const back = document.querySelector('.background');
  if (window.pageYOffset === 0 && !back.classList.contains('animation')) {
    back.classList.add('animation');
    window.removeEventListener('scroll', handler);
  }
};
window.addEventListener('load', () => {
  window.addEventListener('scroll', handler, {passive: true});
  handler();
});

Vue.component('v-select', vSelect);
Vue.use(Siema);

const app = new Vue({
  el: '#app',
  mixins: [adaptiveMixin, menuMixin, listingsMixin, siemaLazyInitMixin,],
  data () {
    return {
      // Filter
      activeOption: 0,
      curType: 'Apartment1',
      pricePerMonth: {
        start: 5000,
        end: 15000,
      },
      curBdrooms: [1],
      size: {
        start: 150,
        end: 200,
      },
      searchCode: '',
      options: false,
      curDistrict: '1 District',
      pricePerSqm: {
        start: 500,
        end: 1500,
      },
      floor: {
        start: 2,
        end: 3,
      },
      checkboxList: {
        elevator: true,
        terrace: false,
        balcony: true,
        sauna: false,
        penthouse: true,
        pool: false,
      },
      bedrooms: {
        1: true,
        2: false,
        3: false,
        4: false,
      },
      // Main
      siemaOptions: {
        duration: 200,
        easing: 'ease-out',
        perPage: {
          320: 2,
          380: 3,
          576: 4,
          640: 5,
          991: 6,
          1280: 8,
        },
        startIndex: 0,
        loop: true,
        draggable: true,
        multipleDrag: true,
        threshold: 20,
        playing: true,
        autoplaytime: 5000,
      },
      siemaOptionsAutoplay: {
        duration: 200,
        easing: 'ease-out',
        perPage: {
          320: 2,
          380: 3,
          576: 4,
          640: 5,
          768: 6,
          1040: 7,
          1280: 8,
        },
        startIndex: 0,
        loop: true,
        playing: true,
        autoplaytime: 500,
        draggable: true,
        multipleDrag: true,
        threshold: 20,
      },
      siemaTestimonials: {
        duration: 200,
        easing: 'ease-out',
        perPage: {
          320: 1,
          768: 2,
        },
        startIndex: 0,
        loop: true,
        draggable: true,
        multipleDrag: true,
        threshold: 20,
        playing: true,
        autoplaytime: 5000,
      },
    };
  },
  computed: {
    bedroomsLabel () {
      const numbers = Object.entries(this.bedrooms).filter(([key, value]) => value).map(([key, value]) => key).join(', ');
      return numbers + ' Bedrooms';
    },
  },
  watch: {
    options: function (val) {
      if (!this.isTab) {
        document.body.style.paddingTop = `${val ? 1445 : 1065}px`;
      }
      this.$refs.moreLabel.innerHTML = `${!val?'More options +':'Hide options -'}`;
    },
  },
  mounted () {
    this.ll = ll;
  }
});
