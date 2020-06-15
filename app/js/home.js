import Vue from 'vue';
import vSelect from 'vue-select';
import Siema from 'vue2-siema';
import {promiseModInit, adaptiveMixin, menuMixin, listingsMixin, weCanMixin} from "./base";

const promiseMod = promiseModInit();

function addAnimationToBackground() {
  const topImage = document.querySelector('.background');
  if (window.pageYOffset === 0 && !topImage.classList.contains('animation')) {
    topImage.classList.add('animation');
    setTimeout(function () { topImage.classList.remove('animation')}, 2000);
  }
}
window.addEventListener('scroll', addAnimationToBackground,{passive: true});
window.addEventListener('load', addAnimationToBackground, {passive: true});


Vue.component('v-select', vSelect);
Vue.use(Siema);

const filter = new Vue({
  el: '#filter',
  mixins: [adaptiveMixin],
  data () {
    return {
      activeOption: 0,
      curType: 'Apartment1',
      pricePerMonth: {
        start: 5000,
        end: 15000,
      },
      curBdrooms: '1 Bedroom',
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
    };
  },
  watch: {
    options: function (val) {
      if (!this.isTab) {
        document.body.style.paddingTop = `${val ? 1479 : 1052}px`;
      }
    },
  },
  mounted () {
    let value = 1052;
    if (this.isDesktop) {
      value = 686;
    } else if (this.isTab) {
      value = 626;
    }
    document.body.style.paddingTop = `${value}px`
  },
});

const menu = new Vue({
  el: '#header',
  mixins: [adaptiveMixin, menuMixin],
});

const main = new Vue({
  el: '#main',
  mixins: [adaptiveMixin, listingsMixin, weCanMixin],
  data () {
    return {
      siemaOptions: {
        duration: 200,
        easing: 'ease-out',
        perPage: {
          320: 3,
          480: 4,
          640: 5,
          991: 6,
          1280: 8,
        },
        startIndex: 0,
        loop: true,
        draggable: true,
        multipleDrag: true,
        threshold: 20,
      },
      siemaOptionsAutoplay: {
        duration: 200,
        easing: 'ease-out',
        perPage: {
          320: 4,
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
      },
    };
  },
});