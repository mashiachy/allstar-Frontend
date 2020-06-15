import Vue from 'vue';
import vSelect from 'vue-select';
import Siema from 'vue2-siema';

import {adaptiveMixin, promiseModInit, menuMixin, loadMap, filterMixin, weCanMixin} from "./base";

const promiseMod = promiseModInit();

loadMap('initMap');

window.initMap = function () {
  document.getElementById('map_wrapper').classList.remove('loading');

  class MyOverlay extends google.maps.OverlayView {
    constructor (args) {
      super();
      this.latlng = args.latlng;
      this.html = args.html;
      this.visibility = args.visibility;
      this.setMap(args.map);
    }
    createDiv() {
      this.div = document.createElement('div');
      this.div.style.position = 'absolute';
      if (this.html) {
        this.div.innerHTML = this.html;
      }
      google.maps.event.addDomListener(this.div, 'click', event => {
        google.maps.event.trigger(this, 'click');
      });
    }
    appendDivToOverlay() {
      const panes = this.getPanes();
      panes.overlayImage.appendChild(this.div);
    }
    positionDiv() {
      const point = this.getProjection().fromLatLngToDivPixel(this.latlng);
      if (point) {
        this.div.style.left = `${point.x}px`;
        this.div.style.top = `${point.y}px`;
      }
    }
    draw() {
      if (!this.div) {
        this.createDiv();
        this.appendDivToOverlay();
      }
      this.positionDiv();
    }
    remove () {
      if (this.div) {
        this.div.parentNode.removeChild(this.div);
        this.div = null;
      }
    }
    getPosition () {
      return this.latlng;
    }
    getDraggable () {
      return false;
    }
    show () {
      if (this.div) {
        this.div.style.visibility = 'visible';
      }
    }
    hide () {
      if (this.div) {
        this.div.style.visibility = 'hidden';
      }
    }
    toggle () {
      if (this.div) {
        if (this.div.style.visibility === 'visible')
          this.show();
        else
          this.hide();
      }
    }
  }

  class HTMLMapMarker extends MyOverlay {
    constructor (args) {
      super(args);
      this.id = args.id;
    }
  }

  const generateMarkerHTML = (args) => `<div class="marker marker_${args.type}"><div class="marker__inner">${args.label}</div></div>`;

  class myInfoWindow extends MyOverlay {
    constructor (args) {
      super(args);
      this.marker = args.marker;
      this.siema = args.siema;
      args.marker.addListener('click', () => {
        if (adaptiveMixin.computed.isTab()) this.marker.hide();
        adaptiveMixin.computed.isTab() ? this.show() : this.toggle();
      });
    }
    createDiv() {
      if (adaptiveMixin.computed.isTab()) {
        super.createDiv();
        google.maps.event.addDomListener(this.div.getElementsByClassName(
          'info-window-close')[0],
          'click',
          () => this.hide()
        );
        const wrapper = this.div.getElementsByClassName('info-window__cards-wrapper')[0];
        this.div.getElementsByClassName('info-window__control_right')[0].addEventListener('click', () => {
          const el = wrapper.removeChild(this.div.getElementsByClassName('map-card')[0]);
          wrapper.appendChild(el);
        });
        this.div.getElementsByClassName('info-window__control_left')[0].addEventListener('click', () => {
          const cards = this.div.getElementsByClassName('map-card');
          const el = wrapper.removeChild(cards[cards.length - 1]);
          wrapper.insertBefore(el, cards[0]);
        });
      }
    }
    appendDivToOverlay() {
      super.appendDivToOverlay();
      this.hide();
    }
    positionDiv() {
      const point = this.getProjection().fromLatLngToDivPixel(this.latlng);
      if (point) {
        this.div.style.left = `${point.x - 125}px`;
        this.div.style.top = `${point.y - 280}px`;
      }
    }
    draw() {
      if (adaptiveMixin.computed.isTab()) {
        super.draw();
      }
    }
    hide() {
      if (adaptiveMixin.computed.isTab()) {
        super.hide();
        this.marker.show();
      } else {
        this.siema.innerHTML = '';
      }
    }
    show() {
      if (adaptiveMixin.computed.isTab()) {
        super.show();
      } else {
        this.siema.innerHTML = '';
        this.siema.setAttribute('data-id', this.marker.id);
        this.html.forEach(el => {
          const div = document.createElement('div');
          div.className = 'map-card-wrapper';
          div.innerHTML = el;
          this.siema.appendChild(div);
          this.siema.style.width = `${this.html.length * 291}px`;
          main.initDrag();
        });
      }
    }
    toggle() {
      if (adaptiveMixin.computed.isTab()) {
        super.toggle();
      } else {
        this.siema.innerHTML === '' || this.marker.id !== this.siema.getAttribute('data-id') ? this.show() : this.hide();
      }
    }
  }

  const generateInfoWindowHTML = (args) => {
    let result = null;
    if (adaptiveMixin.computed.isTab())
      result = `<div class="info-window ${args.cards.length > 1 ? 'info-window_multiple' : ''}">` +
        '    <div class="info-window__control info-window__control_close info-window-close"></div>' +
        '    <div class="info-window__controls">' +
        '        <div class="info-window__control info-window__control_left"></div>' +
        '        <div class="info-window__control info-window__control_right"></div>' +
        '    </div>' +
        '    <div class="info-window__cards-wrapper">';
    else
      result = [];
    for (let i = 0; i < args.cards.length; i++) {
      let content = '<div class="map-card"><figure class="map-card__image-wrapper"><picture class="map-card__image">' +
        `<source srcset="${args.cards[i].image}.webp" type="image/webp" />` +
        `<source srcset="${args.cards[i].image}.jpg" type="image/jpeg" /><img src="${args.cards[i].image}.jpg" alt="room" /></picture>` +
        '</figure>' + `<a href="#" class="map-card__title">${args.cards[i].title}</a>` +
        `<div class="map-card__subtitle">${args.cards[i].subtitle}</div>` +
        `<div class="map-card__text">${args.cards[i].text}</div>` +
        '<div class="map-card__footer">' +
        `<div class="map-card__sqm">${args.cards[i].sqm}</div>` +
        `<div class="map-card__price ${args.cards[i].month ? 'map-card__price_month' : ''}">${args.cards[i].price}</div>` +
        '</div>' +
        '</div>';
      if (adaptiveMixin.computed.isTab())
        result += content;
      else
        result.push(content);
    }
    return adaptiveMixin.computed.isTab() ? result + '</div></div>' : result;
  };

  const lat1 = -34.407, lng1 = 150.644;

  const map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: lat1, lng: lng1},
    zoom: 14,
    disableDefaultUI: true,
  });

  if (adaptiveMixin.computed.isDesktop()) {
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
  }

  const mapSiema = document.getElementById('map-siema');

  const onceMarker = new HTMLMapMarker({
    latlng: new google.maps.LatLng(-34.412, 150.660),
    map: map,
    id: 'o',
    html: generateMarkerHTML({
      type: 'once',
      label: '$157K',
    }),
    visibility: 'visible',
  });
  const onceInfoWindow = new myInfoWindow({
    latlng: new google.maps.LatLng( -34.412, 150.660),
    siema: mapSiema,
    html: generateInfoWindowHTML({
      cards: [
        {
          image: 'img/room-4',
          title: 'Gonchara Street 26',
          subtitle: 'Tetris Hall',
          text: '1 bt, 3 bd, 9 floor, 121 sqm',
          sqm: '($45/sqm)',
          price: '$ 5 000',
          month: true,
        },
      ],
    }),
    marker: onceMarker,
    map: map,
    visibility: 'hidden',
  });
  const multipleMarker = new HTMLMapMarker({
    latlng: new google.maps.LatLng(-34.407, 150.644),
    map: map,
    id: 'm',
    html: generateMarkerHTML({
      type: 'multiple',
      label: '+5',
    }),
    visibility: 'visible',
  });
  const multipleInfoWindow = new myInfoWindow({
    latlng: new google.maps.LatLng(-34.407, 150.644),
    siema: mapSiema,
    html: generateInfoWindowHTML({
      cards: [
        {
          image: 'img/room-4',
          title: 'Gonchara Street 26 1',
          subtitle: 'Tetris Hall',
          text: '1 bt, 3 bd, 9 floor, 121 sqm',
          sqm: '($45/sqm)',
          price: '$ 5 000',
          month: true,
        },
        {
          image: 'img/room-4',
          title: 'Gonchara Street 26 2',
          subtitle: 'Tetris Hall',
          text: '1 bt, 3 bd, 9 floor, 121 sqm',
          sqm: '($45/sqm)',
          price: '$ 5 000',
          month: true,
        },
        {
          image: 'img/room-4',
          title: 'Gonchara Street 26 3',
          subtitle: 'Tetris Hall',
          text: '1 bt, 3 bd, 9 floor, 121 sqm',
          sqm: '($45/sqm)',
          price: '$ 5 000',
          month: true,
        },
        {
          image: 'img/room-4',
          title: 'Gonchara Street 26 4',
          subtitle: 'Tetris Hall',
          text: '1 bt, 3 bd, 9 floor, 121 sqm',
          sqm: '($45/sqm)',
          price: '$ 5 000',
          month: true,
        },
        {
          image: 'img/room-4',
          title: 'Gonchara Street 26 5',
          subtitle: 'Tetris Hall',
          text: '1 bt, 3 bd, 9 floor, 121 sqm',
          sqm: '($45/sqm)',
          price: '$ 5 000',
          month: true,
        },
      ],
    }),
    marker: multipleMarker,
    map: map,
    visibility: 'hidden',
  });
};

Vue.component('v-select', vSelect);
Vue.use(Siema);

const menu = new Vue({
  el: '#header',
  mixins: [adaptiveMixin, menuMixin],
});

const filter = new Vue({
  el: '#filter',
  mixins: [adaptiveMixin, filterMixin],
});

const main = new Vue({
  el: '#main',
  mixins: [adaptiveMixin, weCanMixin],
  data () {
    return {
      viewTab: true,
      siemaOptions: {
        duration: 200,
        easing: 'ease-out',
        perPage: 1,
        startIndex: 0,
        loop: true,
        draggable: true,
      },
      curs: [0, 0, 0, 0, 0, 0],
      drag: {
        w: 291,
        startX: 0,
        stopX: 0,
        bufX: 0,
        maxX: 0,
        nowX: 0,
        n: 0,
        c: 0,
      },
    };
  },
  methods: {
    initSiema (siema) {
      const w = siema.$el.clientWidth;
      siema.$el.style.height = `${w*179/278}px`;
      promiseMod.then(() => {
        for (let i of siema.$el.getElementsByClassName('full-item-card__image')) {
          const imgSrc = i.getAttribute('data-src');
          Modernizr.on('webp', webp => i.style.backgroundImage = `url("${imgSrc}.${webp ? 'webp' : 'jpg'}")`);
          i.style.height = `${w*179/278}px`;
        }
      });
    },
    changeActiveControlImage (el) {
      for (let i of el.getElementsByClassName('full-item-card__control')) {
        i.classList.toggle('active');
      }
    },
    clickWrapper (ev) {
      let el = ev.target;
      if (el.classList.contains('full-item-card__control')) return;
      while (!el.classList.contains('full-item-card__image-wrapper'))
        el = el.parentElement;
      if (!this.isDesktop) {
        this.changeActiveControlImage(el);
      }
    },
    changeWrapper (ev) {
      if (this.isDesktop) {
        this.changeActiveControlImage(ev.target);
      }
    },
    changeActiveCard (el) {
      el.classList.toggle('active');
    },
    clickCard (ev) {
      if (!this.isTab) {
        this.changeActiveCard(ev.target);
      }
    },
    changeCard (ev) {
      if (this.isDesktop) {
        this.changeActiveCard(ev.target);
      }
    },
    initDrag () {
      this.drag.startX = 0;
      this.drag.stopX = 0;
      this.drag.maxX = 0;
      this.drag.nowX = 0;
      this.drag.n = 0;
      this.drag.c = 0;
    },
    startDrag (ev) {
      ev = ev.changedTouches ? ev.changedTouches[0] : ev;
      this.drag.maxX = parseInt(this.$refs.mapSiema.style.width) - 1;
      this.drag.startX = ev.pageX;
      this.drag.bufX = this.drag.startX;
      this.drag.n = (this.drag.maxX - this.drag.maxX % this.drag.w) / this.drag.w;
    },
    onDrag (ev) {
      ev = ev.changedTouches ? ev.changedTouches[0] : ev;
      this.drag.nowX += (ev.pageX - this.drag.bufX);
      this.drag.bufX = ev.pageX;
    },
    stopDrag (ev) {
      ev = ev.changedTouches ? ev.changedTouches[0] : ev;
      this.drag.stopX = ev.pageX;
      let to = -this.drag.nowX;
      let cf = to > 0 ? 1 : to < 0 ? -1 : 0;
      to = Math.abs(to);
      to /= this.drag.w;
      to = (to % 1 >= 0.5 ? 1 : 0) + Math.floor(to);
      to *= cf;
      to = to < 0 ? 0 : to > this.drag.n ? this.drag.n : to;
      this.$refs.mapSiema.style.transition = 'transform .25s ease-out';
      this.drag.nowX = -to * this.drag.w;
      setTimeout(() => this.$refs.mapSiema.style.transition = '', 1000);
    },
  },
});
