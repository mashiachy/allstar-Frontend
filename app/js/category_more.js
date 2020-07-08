import Vue from 'vue';
import vSelect from 'vue-select';
import Siema from 'vue2-siema';
import VV from 'vee-validate';

import {
  adaptiveMixin,
  menuMixin,
  listingsMixin,
  loadMap,
  myWOW,
  goTopInit,
  siemaLazyInitMixin, webpInit, LazyLoader, isWebp
} from "./base";

webpInit();
const wow = myWOW({selector: '.animated'});
goTopInit({
  selector: '.gotop',
  offset: '100vh',
});

const ll = new LazyLoader({
  selector: '[data-lazy]',
});

const {ValidationProvider, extend} = VV;

extend('required', {
  validate (value) {
    return {
      required: true,
      valid: ['', null, undefined].indexOf(value) === -1
    };
  },
  computesRequired: true,
  message: 'The {_field_} field is required',
});

Vue.component('validationProvider', ValidationProvider);
Vue.component('v-select', vSelect);
Vue.use(Siema);

const app = new Vue({
  el: '#app',
  mixins: [adaptiveMixin, menuMixin, listingsMixin, siemaLazyInitMixin],
  data () {
    return {
      modalVisible: false,
      searchCode: '',
      siemaImagesOptions: {
        duration: 200,
        easing: 'ease-out',
        perPage: 1,
        startIndex: 0,
        loop: false,
        draggable: true,
        threshold: 20,
      },
      siemaImagesMiniatureOptions: {
        duration: 200,
        easing: 'ease-out',
        perPage: 5,
        startIndex: 0,
        loop: false,
        draggable: true,
        threshold: 20,
      },
      curImage: 0,
      mapVisible: false,
      form: {
        name: '',
        surname: '',
        prefix: '+057',
        phone: '',
        message: '',
      },
    };
  },
  watch: {
    curImage: function (toVal, fromVal) {
      this.$refs.allImages.getElementsByClassName('block-images__image')[fromVal].classList.remove('current');
      this.$refs.allImages.getElementsByClassName('block-images__image')[toVal].classList.add('current');
      if (this.isSmDesktop) {
        this.$refs.allImagesMiniature.getElementsByClassName('modal__miniature')[fromVal].classList.remove('current');
        this.$refs.allImagesMiniature.getElementsByClassName('modal__miniature')[toVal].classList.add('current');
        //if (fromVal)
        this.$refs.siemaModalImagesMiniature.goTo(toVal);
      }
    },
  },
  computed: {
    prefixList: () => ['+057', '+058', '+059', '+060', '+061', '+062', '+063', '+064', '+065', '+066', '+067',],
  },
  methods: {
    initOpenModal () {
      for (let el of this.$refs.siemaImages.$el.getElementsByTagName('img')) {
        el.addEventListener('click', () => this.showModal(el.getAttribute('src')));
      }
    },
    showModal (imageSrc) {
      document.documentElement.style.overflowY = 'hidden';
      document.body.style.overflowY = 'hidden';
      //console.log(this.$refs.allImagesMiniature.clientWidth);
      //this.$refs.allImagesMiniatureScroll.style.width = `${(this.$refs.allImagesMiniature.clientWidth+10)/5*this.$refs.allImagesMiniatureScroll.getAttribute('data-all')}px`;
      this.modalVisible = true;
    },
    hideModal () {
      document.documentElement.style.overflowY = 'visible';
      document.body.style.overflowY = 'visible';
      this.modalVisible = false;
    },
    showMap () {
      const mapWrapper = this.$refs.map.parentElement;
      mapWrapper.style.height = `${this.isTab ? 255 : 237}px`;
      this.mapVisible = true;
      loadMap().then(() => {
        const mapWrapper = this.$refs.map.parentElement;

        const lat1 = 50.4449, lng1 = 30.5087;
        const map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: lat1, lng: lng1},
          zoom: 14,
          disableDefaultUI: true,
          styles: [
            {
              featureType: 'poi',
              stylers: [
                { visibility: 'off' },
              ],
            },
            {
              featureType: 'transit.station.bus',
              stylers: [
                { visibility: 'off' },
              ],
            },
          ],
        });

        const control_minus = document.createElement('div');
        control_minus.classList.add('map-control', 'map-control_minus');
        google.maps.event.addDomListener(control_minus, 'click', () => {
          map.setZoom(map.getZoom() - 1);
        });

        const control_plus = document.createElement('div');
        control_plus.classList.add('map-control', 'map-control_plus');
        google.maps.event.addDomListener(control_plus, 'click', () => {
          map.setZoom(map.getZoom() + 1);
        });

        const controls = document.createElement('div');
        controls.className = 'map-control__wrapper';
        controls.appendChild(control_minus);
        controls.appendChild(control_plus);
        controls.index = 1;

        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(controls);

        new google.maps.Marker({
          position: new google.maps.LatLng(lat1, lng1),
          map: map,
          icon: `img/marker${isWebp ? '.webp' : '.png'}`,
        });
        mapWrapper.classList.remove('loading');
      });
    },
  },
  mounted () {
    this.ll = ll;
  }
});
