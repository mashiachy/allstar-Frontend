import Vue from 'vue';
import vSelect from 'vue-select';
import Siema from 'vue2-siema';

import {
  adaptiveMixin,
  menuMixin,
  loadMap,
  filterMixin,
  myWOW,
  goTopInit,
  webpInit, LazyLoader, isWebp, siemaLazyInitMixin, initDouglasPeucker, initialMobileScroll
} from "./base";

initialMobileScroll(667, 50);

webpInit();
const wow = myWOW({selector: '.animated'});
goTopInit({
  selector: '.gotop',
  offset: '110vh',
});

const ll = new LazyLoader({
  selector: '[data-lazy]',
});

const mapObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadMap('initMap');
      observer.unobserve(entry.target);
    }
  });
}, {threshold: .1});
document.readyState === 'complete' ? mapObserver.observe(document.querySelector('#map_wrapper')) :
  window.addEventListener('load', () => mapObserver.observe(document.querySelector('#map_wrapper')));

window.initMap = function () {
  document.getElementById('map_wrapper').classList.remove('loading');

  let activeInfoWindow = null;
  let isDrawing = false;

  class MyOverlay extends google.maps.OverlayView {
    constructor (args) {
      super();
      this.latlng = args.latlng;
      this.html = args.html;
      this.visibility = args.visibility;
      this.map = args.map;
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
      panes.floatPane.appendChild(this.div);
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
        if (this.div.style.visibility !== 'visible')
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
      this.type = args.type;
      this.addListener('click', () => {
        map.panTo(this.getPosition());
      });
    }
    toggleActive () {
      this.div.firstChild.classList.toggle('active');
    }
    disActive () {
      this.div.firstChild.classList.remove('active');
    }
    active () {
      this.div.firstChild.classList.add('active');
    }
  }

  const generateMarkerHTML = (args) => `<div class="marker"><div class="marker__inner">${args.label}</div></div>`;

  class myInfoWindow extends MyOverlay {
    constructor (args) {
      super(args);
      this.marker = args.marker;
      this.siema = args.siema;
      this.marker.addListener('click', () => {
        if (isDrawing) return;
        this.marker.toggleActive();
        this.toggle();
      });
    }
    createDiv() {
      if (adaptiveMixin.computed.isSmTab()) {
        super.createDiv();
        google.maps.event.addDomListener(
          this.div.getElementsByClassName('info-window-close')[0],
          'click',
          () => {
            this.hide();
          },
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
        this.div.style.top = `${point.y - (this.marker.type === 'once' ? 280 : 300)}px`;
      }
    }
    draw() {
      if (adaptiveMixin.computed.isSmTab()) {
        super.draw();
      }
    }
    hide() {
      if (activeInfoWindow === this) activeInfoWindow = null;
      this.marker.disActive();
      if (adaptiveMixin.computed.isSmTab()) {
        super.hide();
      } else {
        app.destroyMapSiema();
      }
    }
    show() {
      if (activeInfoWindow) {
        activeInfoWindow.marker.disActive();
        activeInfoWindow.hide();
      }
      if (adaptiveMixin.computed.isSmTab()) {
        super.show();
      } else {
        app.initMapSiema(this.html.map(el => {
          const div = document.createElement('div');
          div.className = 'map-card-wrapper';
          div.innerHTML = el;
          return div;
        }))
      }
      activeInfoWindow = this;
      this.marker.active();
    }
    toggle() {
      if (adaptiveMixin.computed.isSmTab()) {
        super.toggle();
      } else {
        app.siemaMapActive && activeInfoWindow === this ? this.hide() : this.show();
      }
    }
  }

  const generateInfoWindowHTML = (args) => {
    let result = null;
    if (adaptiveMixin.computed.isSmTab())
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
      if (adaptiveMixin.computed.isSmTab())
        result += content;
      else
        result.push(content);
    }
    return adaptiveMixin.computed.isSmTab() ? result + '</div></div>' : result;
  };

  const lat1 = 50.4449, lng1 = 30.5087;

  const map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: lat1, lng: lng1},
    zoom: 14,
    disableDefaultUI: true,
    disableDoubleClickZoom: true,
    clickableIcons: false,
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

  if (adaptiveMixin.computed.isSmDesktop()) {
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
    latlng: new google.maps.LatLng(50.4449, 30.5087),
    map: map,
    id: 'o',
    type: 'once',
    html: generateMarkerHTML({
      label: '$157K',
    }),
    visibility: 'visible',
  });
  const multipleMarker = new HTMLMapMarker({
    latlng: new google.maps.LatLng(50.4549, 30.5107),
    map: map,
    id: 'm',
    type: 'multiple',
    html: generateMarkerHTML({
      label: '+5',
    }),
    visibility: 'visible',
  });
  const onceInfoWindow = new myInfoWindow({
    latlng: new google.maps.LatLng( 50.4449, 30.5087),
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
  const multipleInfoWindow = new myInfoWindow({
    latlng: new google.maps.LatLng(50.4549, 30.5107),
    siema: mapSiema,
    html: generateInfoWindowHTML({
      cards: [
        {
          image: 'img/room-1',
          title: 'Gonchara Street 26 1',
          subtitle: 'Tetris Hall',
          text: '1 bt, 3 bd, 9 floor, 121 sqm',
          sqm: '($45/sqm)',
          price: '$ 5 000',
          month: true,
        },
        {
          image: 'img/room-2',
          title: 'Gonchara Street 26 2',
          subtitle: 'Tetris Hall',
          text: '1 bt, 3 bd, 9 floor, 121 sqm',
          sqm: '($45/sqm)',
          price: '$ 5 000',
          month: true,
        },
        {
          image: 'img/room-3',
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
          image: 'img/room-5',
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


  if (adaptiveMixin.computed.isSmDesktop()) {
    // Drawing
    initDouglasPeucker(map);
    const defaultCursor = 'url("https://maps.gstatic.com/mapfiles/openhand_8_8.cur"), default';
    const earthRadius = 6378137.0;
    let overlay = new google.maps.OverlayView();
    overlay.draw = function () {
    };
    overlay.setMap(map);
    let polyLine = new google.maps.Polyline({
      strokeColor: '#F77100',
      strokeOpacity: 0.8,
      strokeWeight: 4,
    });
    let polygon = new google.maps.Polygon({
      strokeColor: '#F77100',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#F77100',
      fillOpacity: 0.35,
      editable: true,
      draggable: true,
      geodesic: false,
    });
    let parcelleHeig = [];
    let mousePressed = false;
    const processDraw = (evt) => {
      if (!mousePressed) return;

      let latLng = evt.latLng;
      polyLine.getPath().push(latLng);
      parcelleHeig.push(new google.maps.LatLng(latLng.lat(), latLng.lng()));
    };
    const startDraw = () => {
      mousePressed = true;
      polyLine.setPath(parcelleHeig);
      polyLine.setMap(map);
    };
    const stopDraw = () => {
      mousePressed = false;
      polygon.setPath(parcelleHeig);

      polygon.douglasPeucker(360.0 / (2.0 * Math.PI * earthRadius));

      parcelleHeig = [];
      polygon.setEditable(true);
      polygon.setDraggable(true);
      polygon.setMap(map);
      polyLine.setMap(null);

      drawingModeOff();
    };
    // Listeners for adding or removing on button click handle
    let listenersManage = () => {
      const config = [
        {
          el: document.getElementById('map'),
          eventName: 'mousedown',
          handle: startDraw,
          listener: null,
          dom: true,
        },
        {
          el: document.getElementById('map'),
          eventName: 'mouseup',
          handle: stopDraw,
          listener: null,
          dom: true,
        },
        {
          el: map,
          eventName: 'mousemove',
          handle: processDraw,
          listener: null,
          dom: false,
        }
      ];
      config.forEach((obj) => {
        if (obj.dom) {
          obj.listener = obj.el[isDrawing ? 'addEventListener' : 'removeEventListener'](obj.eventName, obj.handle);
        } else if (isDrawing) {
          obj.listener = google.maps.event.addListener(obj.el, obj.eventName, obj.handle);
        } else {
          google.maps.event.removeListener(obj.listener);
          obj.listener = null;
        }
      });
    };

    const drawingModeOn = () => {
      if (activeInfoWindow) activeInfoWindow.hide();
      isDrawing = true;
      map.setOptions({
        draggable: false,
        draggableCursor: 'default',
      });
      listenersManage();
      polygon.setEditable(false);
      polygon.setDraggable(false);
    }, drawingModeOff = () => {
      isDrawing = false;
      app.isDrawing = false;
      map.setOptions({
        draggable: true,
        draggableCursor: defaultCursor,
      });
      listenersManage();
    };
    // Listen control drawing button click
    document.getElementById('js__controlDrawing').addEventListener('click', () => {
      !isDrawing ? drawingModeOn() : drawingModeOff();
    }, {passive: true});
    document.getElementById('js__clearDrawing').addEventListener('click', () => {
      polyLine.setMap(null);
      polygon.setMap(null);
    })
  }
};

Vue.component('v-select', vSelect);
Vue.use(Siema);

const app = new Vue({
  el: '#app',
  mixins: [adaptiveMixin, menuMixin, filterMixin, siemaLazyInitMixin],
  data () {
    return {
      isDrawing: false,
      viewTab: true,
      siemaOptions: {
        duration: 200,
        easing: 'ease-out',
        perPage: 1,
        startIndex: 0,
        loop: true,
        draggable: true,
      },
      siemaMapOptions: {
        duration: 200,
        easing: 'ease-out',
        perPage: {
          320: 2,
          592: 3,
        },
        startIndex: 0,
        loop: true,
        draggable: true,
      },
      siemaMapActive: false,
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
  mounted () {
    if (!this.isSmDesktop) {
      document.querySelectorAll('.full-item-card__control').forEach(el => el.classList.add('active'));
    }
    this.ll = ll;
  },
  methods: {
    clickDrawingControl () {
      this.isDrawing = !this.isDrawing;
    },
    initSiema (siema) {
      const w = siema.$el.clientWidth;
      siema.$el.style.height = `${w*179/278}px`;
      window.addEventListener('resize', () => {
        const w = siema.$el.clientWidth;
        siema.$el.style.height = `${w*179/278}px`;
      }, {passive: true});
      for (let i of siema.$el.getElementsByClassName('full-item-card__image')) {
        const imgSrc = i.getAttribute('data-src');
        i.style.backgroundImage = `url("${imgSrc}.${isWebp ? 'webp' : 'jpg'}")`;
        i.style.height = `${w*179/278}px`;
        window.addEventListener('resize', () => {
          const w = siema.$el.clientWidth;
          i.style.height = `${w*179/278}px`;
        }, {passive: true});
      }
    },
    initMapSiema (content) {
      function cloneArrayOfNodes (arr) {
        let r = [];
        arr.forEach(el => r.push(el.cloneNode(true)));
        return arr.push(...r);
      }
      if (this.siemaMapActive) this.destroyMapSiema();
      let els = content;
      this.$refs.mapSiema.$el.innerHTML = '';
      while ((window.innerWidth >= 592 ? els.length <= 3 : els.length <= 2)) cloneArrayOfNodes(els);
      els.forEach(el => document.querySelector('.map-siema-vue').appendChild(el));
      this.$refs.siemaMapWrapper.classList.add('active');
      this.$refs.mapSiema.init();
      this.siemaMapActive = true;
    },
    destroyMapSiema () {
      this.$refs.mapSiema.destroy(true);
      this.$refs.mapSiema.$el.innerHTML = '';
      this.$refs.siemaMapWrapper.classList.remove('active');
      this.siemaMapActive = false;
    },
    clickMyButton (ev) {
      const ref = ev.target;
      const nDirection = ref.getAttribute('data-direction');
      ref.setAttribute('data-direction', nDirection === 'top' ? 'bottom' : 'top');
    },
  },
});
