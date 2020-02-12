import {viewer} from "../IGisPackages/Viewer.js";
import {Cesium} from "../IGisPackages/Unit.js"

let IGisOverviewMapControl = function () {
    this.init.apply(this, arguments);
};

IGisOverviewMapControl.prototype = {
    _container: null,
    _miniMap: null,
    _viewerMoving: false,
    _miniMapMoving: false,
    _userToggledDisplay: false,
    _minimized: false,
    tileLayer: null,
    options: {
        position: 'bottomleft',
        toggleDisplay: true,
        zoomLevelOffset: -5,
        zoomLevelFixed: false,
        centerFixed: false,
        zoomControl: false,
        zoomAnimation: false,
        autoToggleDisplay: false,
        minimized: false,
        width: 150,
        height: 150,
        collapsedWidth: 19,
        collapsedHeight: 19,
        aimingRectOptions: { color: '#ff7800', weight: 1, interactive: false },
        shadowRectOptions: { color: '#000000', weight: 1, interactive: false, opacity: 0, fillOpacity: 0 },
        strings: { hideText: '隐藏鹰眼', showText: '显示鹰眼' },
        mapOptions: {
            toggleDisplay: true,
            aimingRectOptions: {
                color: "#ff1100",
                weight: 3
            },
            shadowRectOptions: {
                color: "#0000AA",
                weight: 1,
                opacity: 0,
                fillOpacity: 0
            }
        }
    },
    init: function (layer, options) {
        this.tileLayer = layer;
        this._container = options.container;
        L.Util.setOptions(this, options);

        this.options.aimingRectOptions.interactive = false;
        this.options.shadowRectOptions.interactive = false;

        this._initMap();
        this._showInitView();
    },
    updateAimingRect: function () {
        let _this = this;
        let rect = _this._getViewRange();
        _this._aimingRect.setBounds(rect);
    },
    _initMap: function () {
        let _this = this;

        this._container.style.width = this.options.width + 'px';
        this._container.style.height = this.options.height + 'px';

        L.DomEvent.disableClickPropagation(_this._container);
        L.DomEvent.on(_this._container, 'mousewheel', L.DomEvent.stopPropagation);

        let mapOptions = {
            attributionControl: false,
            dragging: !_this.options.centerFixed,
            zoomControl: _this.options.zoomControl,
            zoomAnimation: _this.options.zoomAnimation,
            autoToggleDisplay: _this.options.autoToggleDisplay,
            touchZoom: _this.options.centerFixed ? 'center' : !_this._isZoomLevelFixed(),
            scrollWheelZoom: _this.options.centerFixed ? 'center' : !_this._isZoomLevelFixed(),
            doubleClickZoom: _this.options.centerFixed ? 'center' : !_this._isZoomLevelFixed(),
            boxZoom: !_this._isZoomLevelFixed(),
            crs: L.CRS.EPSG3857,
            center: [30, 120],
            zoom: 1
        };
        mapOptions = L.Util.extend(_this.options.mapOptions, mapOptions);  // merge
        // with
        // priority
        // of
        // the
        // local
        // mapOptions
        // object.

        _this._miniMap = new L.Map(_this._container, mapOptions);

        let layer = this.tileLayer;
        _this._miniMap.addLayer(layer);

        // These bools are used to prevent infinite loops of the two maps
        // notifying each other that they've moved.
        _this._viewerMoving = true;
        _this._miniMapMoving = false;

        // Keep a record of _this to prevent auto toggling when the user
        // explicitly doesn't want it.
        _this._userToggledDisplay = false;
        _this._minimized = false;

        if (this.options.toggleDisplay) {
            this._addToggleButton();
        }

        _this._miniMap.whenReady(L.Util.bind(function () {
            let bounds = _this._getViewRange();
            _this._aimingRect = L.rectangle(bounds, _this.options.aimingRectOptions).addTo(_this._miniMap);
            _this._shadowRect = L.rectangle(bounds, _this.options.shadowRectOptions).addTo(_this._miniMap);

            let camera = viewer.scene.camera;
            camera.moveEnd.addEventListener(function (e) {
                let rect = _this._getViewRange();
                if (!_this._miniMapMoving) {
                    _this._viewerMoving = true;
                    let zrect = _this._getZoomOutRange(rect);
                    _this._miniMap.fitBounds(zrect);
                    _this._setDisplay(_this._decideMinimized());
                } else {
                    _this._miniMapMoving = false;
                }
                _this._aimingRect.setBounds(rect);
            });
            camera.moveStart.addEventListener(function (e) {
                let rect = _this._getViewRange();
                _this._aimingRect.setBounds(rect);
            });

            _this._miniMap.on('movestart', _this._onMiniMapMoveStarted, _this);
            _this._miniMap.on('move', _this._onMiniMapMoving, _this);
            _this._miniMap.on('moveend', _this._onMiniMapMoved, _this);
        }, _this));

        return _this._container;
    },
    _addToggleButton: function () {
        this._toggleDisplayButton = this.options.toggleDisplay ? this._createButton(
            '', this._toggleButtonInitialTitleText(), ('leaflet-control-minimap-toggle-display leaflet-control-minimap-toggle-display-' +
                this.options.position), this._container, this._toggleDisplayButtonClicked, this) : undefined;
        // this._toggleDisplayButton.style.zIndex = 99999;
        this._toggleDisplayButton.style.width = this.options.collapsedWidth + 'px';
        this._toggleDisplayButton.style.height = this.options.collapsedHeight + 'px';
    },

    _toggleButtonInitialTitleText: function () {
        if (this.options.minimized) {
            return this.options.strings.showText;
        } else {
            return this.options.strings.hideText;
        }
    },

    _createButton: function (html, title, className, container, fn, context) {
        let link = L.DomUtil.create('a', className, container);
        link.innerHTML = html;
        link.href = '#';
        link.title = title;

        let stop = L.DomEvent.stopPropagation;

        L.DomEvent
            .on(link, 'click', stop)
            .on(link, 'mousedown', stop)
            .on(link, 'dblclick', stop)
            .on(link, 'click', L.DomEvent.preventDefault)
            .on(link, 'click', fn, context);

        return link;
    },

    _toggleDisplayButtonClicked: function () {
        this._userToggledDisplay = true;
        if (!this._minimized) {
            this._minimize();
        } else {
            this._restore();
        }
    },
    _showInitView: function () {
        let rect = this._getViewRange();
        let zrect = this._getZoomOutRange(rect);
        this._miniMap.fitBounds(zrect);
    },
    _setDisplay: function (minimize) {
        if (minimize !== this._minimized) {
            if (!this._minimized) {
                this._minimize();
            } else {
                this._restore();
            }
        }
    },
    _minimize: function () {
        // hide the minimap
        if (this.options.toggleDisplay) {
            this._container.style.width = this.options.collapsedWidth + 'px';
            this._container.style.height = this.options.collapsedHeight + 'px';
            this._toggleDisplayButton.className += (' minimized-' + this.options.position);
            this._toggleDisplayButton.title = this.options.strings.showText;
        } else {
            this._container.style.display = 'none';
        }
        this._minimized = true;
        this._onToggle();
    },
    _restore: function () {
        if (this.options.toggleDisplay) {
            this._container.style.width = this.options.width + 'px';
            this._container.style.height = this.options.height + 'px';
            this._toggleDisplayButton.className = this._toggleDisplayButton.className
                .replace('minimized-' + this.options.position, '');
            this._toggleDisplayButton.title = this.options.strings.hideText;
        } else {
            this._container.style.display = 'block';
        }
        this._minimized = false;
        this._onToggle();
    },
    _onMiniMapMoveStarted: function (e) {
        if (!this.options.centerFixed) {
            let lastAimingRect = this._aimingRect.getBounds();
            let sw = this._miniMap.latLngToContainerPoint(lastAimingRect.getSouthWest());
            let ne = this._miniMap.latLngToContainerPoint(lastAimingRect.getNorthEast());
            this._lastAimingRectPosition = { sw: sw, ne: ne };
        }
    },
    _onMiniMapMoving: function (e) {
        if (!this.options.centerFixed) {
            if (!this._viewerMoving && this._lastAimingRectPosition) {
                this._shadowRect.setBounds(new L.LatLngBounds(this._miniMap.containerPointToLatLng(this._lastAimingRectPosition.sw), this._miniMap.containerPointToLatLng(this._lastAimingRectPosition.ne)));
                this._shadowRect.setStyle({ opacity: 1, fillOpacity: 0.3 });
            }
        }
    },
    _onMiniMapMoved: function (e) {
        if (!this._viewerMoving) {
            this._miniMapMoving = true;

            let rect = this._shadowRect.getBounds();
            let west = rect.getWest();
            let east = rect.getEast();
            let north = rect.getNorth();
            let south = rect.getSouth();
            let destination = Cesium.Rectangle.fromDegrees(west, south, east, north);
            let orientation = {
                heading: Cesium.Math.toRadians(0),
                pitch: Cesium.Math.toRadians(-90),
                roll: 0.0
            };
            viewer.scene.camera.setView({
                destination: destination,
                orientation: orientation
            });
            this._shadowRect.setStyle({ opacity: 0, fillOpacity: 0 });
        } else {
            this._viewerMoving = false;
        }
    },
    _isZoomLevelFixed: function () {
        let zoomLevelFixed = this.options.zoomLevelFixed;
        return this._isDefined(zoomLevelFixed) && this._isInteger(zoomLevelFixed);
    },
    _decideMinimized: function () {
        if (this._userToggledDisplay) {
            return this._minimized;
        }

        if (this.options.autoToggleDisplay) {
            let bounds = this._getViewRange();
            if (bounds.contains(this._miniMap.getBounds())) {
                return true;
            }
            return false;
        }

        return this._minimized;
    },
    _isInteger: function (value) {
        return typeof value === 'number';
    },
    _isDefined: function (value) {
        return typeof value !== 'undefined';
    },
    _onToggle: function () {
        L.Util.requestAnimFrame(function () {
            L.DomEvent.on(this._container, 'transitionend', this._fireToggleEvents, this);
            if (!L.Browser.any3d) {
                L.Util.requestAnimFrame(this._fireToggleEvents, this);
            }
        }, this);
    },
    _fireToggleEvents: function () {
        L.DomEvent.off(this._container, 'transitionend', this._fireToggleEvents, this);
    },
    _getViewRange: function () {
        let viewer = viewer;
        let camera = viewer.scene.camera;
        let range = camera.computeViewRectangle();
        if(!range){
            return
        }
        let west = range.west / Math.PI * 180;
        let east = range.east / Math.PI * 180;
        let north = range.north / Math.PI * 180;
        let south = range.south / Math.PI * 180;
        let bounds = new L.LatLngBounds(
            new L.LatLng(north, west),
            new L.LatLng(south, east)
        );
        return bounds;
    },
    _getZoomOutRange: function (rect) {
        if(!rect){
            return
        }
        let west = rect.getWest();
        let east = rect.getEast();
        let north = rect.getNorth();
        let south = rect.getSouth();
        let factor = 3.0;
        let xdis = Math.abs(east - west);
        let ydis = Math.abs(north - south);
        let xoff = xdis * (factor - 1) / 2.0;
        let yoff = ydis * (factor - 1) / 2.0;
        west -= xoff;
        east += xoff;
        north += yoff;
        south -= yoff;
        if (west < -180) {
            west = -180;
        }
        if (east > 180) {
            east = 180;
        }
        if (north > 90) {
            north = 90;
        }
        if (south < -90) {
            south = -90;
        }
        let bounds = new L.LatLngBounds(
            new L.LatLng(north, west),
            new L.LatLng(south, east)
        );
        return bounds;
    },
    CLASS_NAME: "IGisOverviewMapControl"
};
export {IGisOverviewMapControl}
