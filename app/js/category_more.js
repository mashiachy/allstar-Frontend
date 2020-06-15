import Vue from 'vue';
import vSelect from 'vue-select';
import Siema from 'vue2-siema';

import {adaptiveMixin, promiseModInit, menuMixin, listingsMixin, loadMap, weCanMixin} from "./base";

const promiseMod = promiseModInit();

Vue.component('v-select', vSelect);
Vue.use(Siema);

const menu = new Vue({
  el: '#header',
  mixins: [adaptiveMixin, menuMixin],
});

const main = new Vue({
  el: '#main',
  mixins: [adaptiveMixin, listingsMixin, weCanMixin],
  data () {
    return {
      searchCode: '',
      siemaImagesOptions: {
        duration: 200,
        easing: 'ease-out',
        perPage: 1,
        startIndex: 0,
        loop: true,
        draggable: true,
        threshold: 20,
      },
      curImage: 0,
      mapVisible: false,
      form: {
        name: '',
        surname: '',
        prefix: '057',
        phone: '',
        message: '',
      },
    };
  },
  watch: {
    curImage: function (toVal, fromVal) {
      this.$refs.allImages.getElementsByClassName('block-images__image')[fromVal].classList.remove('current');
      this.$refs.allImages.getElementsByClassName('block-images__image')[toVal].classList.add('current');
    },
  },
  computed: {
    prefixList: () => ['057', '058', '059', '060', '061', '062', '063', '064', '065', '066', '067',],
  },
  methods: {
    initOpenModal () {
      promiseMod.then(() =>
        Modernizr.on('webp', webp => {
          const imgs = this.$refs.siemaImages.$el.getElementsByTagName('img');
          for (let el of imgs) {
            el.addEventListener('click', () => {
              const imageSrc = el.getAttribute('src');
              modal.show(`${imageSrc.split('.')[0]}.${webp ? 'webp' : 'jpg'}`);
            });
          }
        })
      );
    },
    showMap () {
      const mapWrapper = this.$refs.map.parentElement;
      mapWrapper.style.height = `${this.isTab ? 255 : 237}px`;
      this.mapVisible = true;
      loadMap().then(() => {
        const mapWrapper = this.$refs.map.parentElement;

        const lat1 = -34.407, lng1 = 150.644;
        const map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: lat1, lng: lng1},
          zoom: 14,
          disableDefaultUI: true,
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

        promiseMod.then(() =>
          Modernizr.on('webp', webp =>
            new google.maps.Marker({
              position: new google.maps.LatLng(lat1, lng1),
              map: map,
              icon: `img/marker${webp ? '.webp' : '.jpg'}`,
            })
          )
        );
        mapWrapper.classList.remove('loading');
      });
    },
  },
});

const modal = new Vue({
  el: '#modal',
  data () {
    return {
      visible: false,
    };
  },
  methods: {
    show (imageSrc) {
      this.$refs.modal.style.top = `${window.pageYOffset}px`;
      this.$refs.modal.style.height = `${window.innerHeight}px`;
      this.$refs.image.setAttribute('src', imageSrc);
      document.documentElement.style.overflowY = 'hidden';
      document.body.style.overflowY = 'hidden';
      this.visible = true;
    },
    hide () {
      document.documentElement.style.overflowY = 'auto';
      document.body.style.overflowY = 'auto';
      this.visible = false;
    },
  },
});