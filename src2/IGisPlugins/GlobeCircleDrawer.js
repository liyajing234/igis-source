import {viewer} from "../IGisPackages/Viewer.js";
import {GlobeTooltip} from "./GlobeTooltip.js";
const Cesium=require("cesium/Cesium")

let GlobeCircleDrawer = function () {
    this.init.apply(this, arguments);
};

GlobeCircleDrawer.prototype = {
    scene: null,
    clock: null,
    canvas: null,
    camera: null,
    ellipsoid: null,
    tooltip: null,
    entity: null,
    outlineEntity: null,
    positions: [],
    drawHandler: null,
    modifyHandler: null,
    okHandler: null,
    cancelHandler: null,
    dragIcon: "images/circle_center.png",
    dragIconLight: "images/circle_red.png",
    material: null,
    radiusLineMaterial: null,
    outlineMaterial: null,
    fill: true,
    outline: true,
    outlineWidth: 3,
    extrudedHeight: 0,
    toolBarIndex: null,
    layerId: "globeEntityDrawerLayer",
    init: function (viewer) {
        let _this = this;
        _this.scene = viewer.scene;
        _this.clock = viewer.clock;
        _this.canvas = viewer.scene.canvas;
        _this.camera = viewer.scene.camera;
        _this.ellipsoid = viewer.scene.globe.ellipsoid;
        _this.tooltip = new GlobeTooltip(viewer.container);
    },
    clear: function () {
        let _this = this;
        if (_this.drawHandler) {
            _this.drawHandler.destroy();
            _this.drawHandler = null;
        }
        if (_this.modifyHandler) {
            _this.modifyHandler.destroy();
            _this.modifyHandler = null;
        }
        if (_this.toolBarIndex != null) {
            layer.close(_this.toolBarIndex);
        }
        _this._clearMarkers(_this.layerId);
        _this.tooltip.setVisible(false);
    },
    showModifyCircle: function (positions, okHandler, cancelHandler) {
        let _this = this;
        _this.positions = positions;
        _this.okHandler = okHandler;
        _this.cancelHandler = cancelHandler;
        _this._showModifyRegion2Map();
        _this._showCircleOutline2Map();
        _this._startModify();
    },
    startDrawCircle: function (okHandler, cancelHandler) {
        let _this = this;
        _this.okHandler = okHandler;
        _this.cancelHandler = cancelHandler;

        _this.positions = [];
        let floatingPoint = null;
        _this.drawHandler = new Cesium.ScreenSpaceEventHandler(_this.canvas);

        _this.drawHandler.setInputAction(function (event) {
            let position = event.position;
            if (!Cesium.defined(position)) {
                return;
            }
            let ray = _this.camera.getPickRay(position);
            if (!Cesium.defined(ray)) {
                return;
            }
            let cartesian = _this.scene.globe.pick(ray, _this.scene);
            if (!Cesium.defined(cartesian)) {
                return;
            }
            let num = _this.positions.length;
            if (num == 0) {
                _this.positions.push(cartesian);
                _this._createCenter(cartesian, 0);
                floatingPoint = _this._createPoint(cartesian, -1);
                _this._showRegion2Map();
                _this._showCircleOutline2Map();
            }
            _this.positions.push(cartesian);
            if (num > 0) {
                _this._createPoint(cartesian, 1);
            }
            if (num > 1) {
                _this.positions.pop();
                viewer.entities.remove(floatingPoint);
                _this.tooltip.setVisible(false);
                _this._startModify();
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        _this.drawHandler.setInputAction(function (event) {
            let position = event.endPosition;
            if (!Cesium.defined(position)) {
                return;
            }
            if (_this.positions.length < 1) {
                _this.tooltip.showAt(position, "<p>选择起点</p>");
                return;
            }
            _this.tooltip.showAt(position, "<p>选择终点</p>");

            let ray = _this.camera.getPickRay(position);
            if (!Cesium.defined(ray)) {
                return;
            }
            let cartesian = _this.scene.globe.pick(ray, _this.scene);
            if (!Cesium.defined(cartesian)) {
                return;
            }
            floatingPoint.position.setValue(cartesian);
            _this.positions.pop();
            _this.positions.push(cartesian);
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    },
    _startModify: function () {
        let _this = this;
        let isMoving = false;
        let pickedAnchor = null;
        if (_this.drawHandler) {
            _this.drawHandler.destroy();
            _this.drawHandler = null;
        }
        _this._showToolBar();

        _this.modifyHandler = new Cesium.ScreenSpaceEventHandler(_this.canvas);

        _this.modifyHandler.setInputAction(function (event) {
            let position = event.position;
            if (!Cesium.defined(position)) {
                return;
            }
            let ray = _this.camera.getPickRay(position);
            if (!Cesium.defined(ray)) {
                return;
            }
            let cartesian = _this.scene.globe.pick(ray, _this.scene);
            if (!Cesium.defined(cartesian)) {
                return;
            }
            if (isMoving) {
                isMoving = false;
                pickedAnchor.position.setValue(cartesian);
                let oid = pickedAnchor.oid;
                _this.positions[oid] = cartesian;
                _this.tooltip.setVisible(false);
            } else {
                let pickedObject = _this.scene.pick(position);
                if (!Cesium.defined(pickedObject)) {
                    return;
                }
                if (!Cesium.defined(pickedObject.id)) {
                    return;
                }
                let entity = pickedObject.id;
                if (entity.layerId != _this.layerId || entity.flag != "anchor") {
                    return;
                }
                pickedAnchor = entity;
                isMoving = true;
                _this.tooltip.showAt(position, "<p>移动控制点</p>");
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        _this.modifyHandler.setInputAction(function (event) {
            if (!isMoving) {
                return;
            }
            let position = event.endPosition;
            if (!Cesium.defined(position)) {
                return;
            }
            _this.tooltip.showAt(position, "<p>移动控制点</p>");

            let ray = _this.camera.getPickRay(position);
            if (!Cesium.defined(ray)) {
                return;
            }
            let cartesian = _this.scene.globe.pick(ray, _this.scene);
            if (!Cesium.defined(cartesian)) {
                return;
            }
            pickedAnchor.position.setValue(cartesian);
            let oid = pickedAnchor.oid;
            _this.positions[oid] = cartesian;
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    },
    _createCenter: function (cartesian, oid) {
        let _this = this;
        let point = viewer.entities.add({
            position: cartesian,
            billboard: {
                image: _this.dragIcon,
                eyeOffset: new Cesium.ConstantProperty(new Cesium.Cartesian3(0, 0, -500)),
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            }
        });
        point.oid = oid;
        point.layerId = _this.layerId;
        point.flag = "anchor";
        return point;
    },
    _createPoint: function (cartesian, oid) {
        let _this = this;
        let point = viewer.entities.add({
            position: cartesian,
            billboard: {
                image: _this.dragIconLight,
                eyeOffset: new Cesium.ConstantProperty(new Cesium.Cartesian3(0, 0, -500)),
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            }
        });
        point.oid = oid;
        point.layerId = _this.layerId;
        point.flag = "anchor";
        return point;
    },
    _showRegion2Map: function () {
        let _this = this;
        if (_this.material == null) {
            _this.material = Cesium.Color.fromCssColorString('#ff0').withAlpha(0.5);
        }
        if (_this.radiusLineMaterial == null) {
            _this.radiusLineMaterial = new Cesium.PolylineDashMaterialProperty({
                dashLength: 16,
                color: Cesium.Color.fromCssColorString('#00f').withAlpha(0.7)
            });
        }
        let dynamicHierarchy = new Cesium.CallbackProperty(function () {
            if (_this.positions.length > 1) {
                let dis = _this._computeCircleRadius3D(_this.positions);
                dis = (dis / 1000).toFixed(3);
                _this.entity.label.text = dis + "km";
                let pnts = _this._computeCirclePolygon(_this.positions);
                let pHierarchy = new Cesium.PolygonHierarchy(pnts);
                return pHierarchy;
            } else {
                return null;
            }
        }, false);
        let lineDynamicPositions = new Cesium.CallbackProperty(function () {
            if (_this.positions.length > 1) {
                return _this.positions;
            } else {
                return null;
            }
        }, false);
        let labelDynamicPosition = new Cesium.CallbackProperty(function () {
            if (_this.positions.length > 1) {
                let p1 = _this.positions[0];
                let p2 = _this.positions[1];
                let cp = _this._computeCenterPotition(p1, p2);
                return cp;
            } else {
                return null;
            }
        }, false);
        let bData = {
            position: labelDynamicPosition,
            label: {
                text: "",
                font: '14px Helvetica',
                fillColor: Cesium.Color.SKYBLUE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 1,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                eyeOffset: new Cesium.ConstantProperty(new Cesium.Cartesian3(0, 0, -9000)),
                pixelOffset: new Cesium.Cartesian2(16, 16)
            },
            polygon: new Cesium.PolygonGraphics({
                hierarchy: dynamicHierarchy,
                material: _this.material,
                fill: _this.fill,
                outline: _this.outline,
                outlineWidth: _this.outlineWidth,
                outlineColor: _this.outlineColor
            }),
            polyline: {
                positions: lineDynamicPositions,
                clampToGround: true,
                width: 2,
                material: _this.radiusLineMaterial
            }
        };
        if (_this.extrudedHeight > 0) {
            bData.polygon.extrudedHeight = _this.extrudedHeight;
            bData.polygon.extrudedHeightReference = Cesium.HeightReference.RELATIVE_TO_GROUND;
            bData.polygon.closeTop = true;
            bData.polygon.closeBottom = true;
        }
        _this.entity = viewer.entities.add(bData);
        _this.entity.layerId = _this.layerId;
    },
    _showModifyRegion2Map: function () {
        let _this = this;
        if (_this.material == null) {
            _this.material = Cesium.Color.fromCssColorString('#ff0').withAlpha(0.5);
        }
        if (_this.radiusLineMaterial == null) {
            _this.radiusLineMaterial = new Cesium.PolylineDashMaterialProperty({
                dashLength: 16,
                color: Cesium.Color.fromCssColorString('#00f').withAlpha(0.7)
            });
        }
        let dynamicHierarchy = new Cesium.CallbackProperty(function () {
            let dis = _this._computeCircleRadius3D(_this.positions);
            dis = (dis / 1000).toFixed(3);
            _this.entity.label.text = dis + "km";
            let pnts = _this._computeCirclePolygon(_this.positions);
            let pHierarchy = new Cesium.PolygonHierarchy(pnts);
            return pHierarchy;
        }, false);
        let lineDynamicPositions = new Cesium.CallbackProperty(function () {
            if (_this.positions.length > 1) {
                return _this.positions;
            } else {
                return null;
            }
        }, false);
        let labelDynamicPosition = new Cesium.CallbackProperty(function () {
            if (_this.positions.length > 1) {
                let p1 = _this.positions[0];
                let p2 = _this.positions[1];
                let cp = _this._computeCenterPotition(p1, p2);
                return cp;
            } else {
                return null;
            }
        }, false);
        let dis = _this._computeCircleRadius3D(_this.positions);
        dis = (dis / 1000).toFixed(3) + "km";
        let bData = {
            position: labelDynamicPosition,
            label: {
                text: dis,
                font: '14px Helvetica',
                fillColor: Cesium.Color.SKYBLUE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 1,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                eyeOffset: new Cesium.ConstantProperty(new Cesium.Cartesian3(0, 0, -9000)),
                pixelOffset: new Cesium.Cartesian2(16, 16)
            },
            polygon: new Cesium.PolygonGraphics({
                hierarchy: dynamicHierarchy,
                material: _this.material,
                fill: _this.fill,
                outline: _this.outline,
                outlineWidth: _this.outlineWidth,
                outlineColor: _this.outlineColor
            }),
            polyline: {
                positions: lineDynamicPositions,
                clampToGround: true,
                width: 2,
                material: _this.radiusLineMaterial
            }
        };
        if (_this.extrudedHeight > 0) {
            bData.polygon.extrudedHeight = _this.extrudedHeight;
            bData.polygon.extrudedHeightReference = Cesium.HeightReference.RELATIVE_TO_GROUND;
            bData.polygon.closeTop = true;
            bData.polygon.closeBottom = true;
        }
        _this.entity = viewer.entities.add(bData);
        _this.entity.layerId = _this.layerId;
        _this._createCenter(_this.positions[0], 0);
        _this._createPoint(_this.positions[1], 1);
    },
    _showCircleOutline2Map: function () {
        let _this = this;
        if (_this.outlineMaterial == null) {
            _this.outlineMaterial = new Cesium.PolylineDashMaterialProperty({
                dashLength: 16,
                color: Cesium.Color.fromCssColorString('#f00').withAlpha(0.7)
            });
        }
        let outelinePositions = new Cesium.CallbackProperty(function () {
            let pnts = _this._computeCirclePolygon(_this.positions);
            return pnts;
        }, false);
        let bData = {
            polyline: {
                positions: outelinePositions,
                clampToGround: true,
                width: _this.outlineWidth,
                material: _this.outlineMaterial
            }
        };
        _this.outlineEntity = viewer.entities.add(bData);
        _this.outlineEntity.layerId = _this.layerId;
    },
    _computeCenterPotition: function (p1, p2) {
        let _this = this;
        let c1 = _this.ellipsoid.cartesianToCartographic(p1);
        let c2 = _this.ellipsoid.cartesianToCartographic(p2);
        let cm = new Cesium.EllipsoidGeodesic(c1, c2).interpolateUsingFraction(0.5);
        let cp = _this.ellipsoid.cartographicToCartesian(cm);
        return cp;
    },
    _computeCirclePolygon: function (positions) {
        let _this = this;

        try {
            if (!positions || positions.length < 2) {
                return null;
            }
            let cp = positions[0];
            let r = _this._computeCircleRadius3D(positions);
            let pnts = _this._computeCirclePolygon2(cp, r);
            return pnts;
        } catch (err) {
            return null;
        }
    },
    _computeCirclePolygon2: function (center, radius) {
        let _this = this;

        try {
            if (!center || radius <= 0) {
                return null;
            }
            let cep = Cesium.EllipseGeometryLibrary.computeEllipsePositions({
                center: center,
                semiMajorAxis: radius,
                semiMinorAxis: radius,
                rotation: 0,
                granularity: 0.005
            }, false, true);
            if (!cep || !cep.outerPositions) {
                return null;
            }
            let pnts = Cesium.Cartesian3.unpackArray(cep.outerPositions);
            let first = pnts[0];
            pnts[pnts.length] = first;
            return pnts;
        } catch (err) {
            return null;
        }
    },
    _computeCirclePolygon3: function (center, semiMajorAxis, semiMinorAxis, rotation) {
        let _this = this;

        try {
            if (!center || semiMajorAxis <= 0 || semiMinorAxis <= 0) {
                return null;
            }
            let cep = Cesium.EllipseGeometryLibrary.computeEllipsePositions({
                center: center,
                semiMajorAxis: semiMajorAxis,
                semiMinorAxis: semiMinorAxis,
                rotation: rotation,
                granularity: 0.005
            }, false, true);
            if (!cep || !cep.outerPositions) {
                return null;
            }
            let pnts = Cesium.Cartesian3.unpackArray(cep.outerPositions);
            let first = pnts[0];
            pnts[pnts.length] = first;
            return pnts;
        } catch (err) {
            return null;
        }
    },
    _computeCirclePolygonForDegree: function (positions) {
        let _this = this;
        let cp = _this.ellipsoid.cartesianToCartographic(positions[0]);
        let rp = _this.ellipsoid.cartesianToCartographic(positions[1]);
        let x0 = cp.longitude;
        let y0 = cp.latitude;
        let xr = rp.longitude;
        let yr = rp.latitude;
        let r = Math.sqrt(Math.pow((x0 - xr), 2) + Math.pow((y0 - yr), 2));

        let pnts = [];
        for (let i = 0; i < 360; i++) {
            let x1 = x0 + r * Math.cos(i * Math.PI / 180);
            let y1 = y0 + r * Math.sin(i * Math.PI / 180);
            let p1 = Cesium.Cartesian3.fromRadians(x1, y1);
            pnts.push(p1);
        }
        return pnts;
    },
    _computeCircleRadius3D: function (positions) {
        let distance = 0;
        let c1 = positions[0];
        let c2 = positions[1];
        let x = Math.pow(c1.x - c2.x, 2);
        let y = Math.pow(c1.y - c2.y, 2);
        let z = Math.pow(c1.z - c2.z, 2);
        let dis = Math.sqrt(x + y + z);
        return dis;
    },
    _showToolBar: function () {
        let _this = this;
        _this._createToolBar();
        let width = $(window).width();
        let wTop = 60;
        let wLeft = parseInt((width - 145) / 2);
        _this.toolBarIndex = layer.open({
            title: false,
            type: 1,
            fixed: true,
            resize: false,
            shade: 0,
            content: $("#shapeEditContainer"),
            offset: [wTop + "px", wLeft + "px"],
            move: "#shapeEditRTCorner"
        });
        let cssSel = "#layui-layer" + _this.toolBarIndex + " .layui-layer-close2";
        $(cssSel).hide();
    },
    _createToolBar: function () {
        let _this = this;
        let objs = $("#shapeEditContainer");
        objs.remove();
        let html = '<div id="shapeEditContainer" style="padding: 10px 10px;">'
            + '    <button name="btnOK" class="layui-btn layui-btn-xs layui-btn-normal"> <i class="layui-icon"></i> 确定 </button>'
            + '    <button name="btnCancel" class="layui-btn layui-btn-xs layui-btn-danger"> <i class="layui-icon">ဆ</i> 取消 </button>'
            + '    <div id="shapeEditRTCorner" style="width: 16px; position: absolute; right: 0px; top: 0px; bottom: 0px">'
            + '    </div>'
            + '</div>';
        $("body").append(html);

        let btnOK = $("#shapeEditContainer button[name='btnOK']");
        let btnCancel = $("#shapeEditContainer button[name='btnCancel']");
        btnOK.unbind("click").bind("click", function () {
            _this.clear();
            layer.close(_this.toolBarIndex);
            if (_this.okHandler) {
                _this.okHandler(_this.positions);
            }
        });
        btnCancel.unbind("click").bind("click", function () {
            _this.clear();
            layer.close(_this.toolBarIndex);
            if (_this.cancelHandler) {
                _this.cancelHandler();
            }
        });
    },
    _clearMarkers: function (layerName) {
        let _this = this;
        let viewer = viewer;
        let entityList = viewer.entities.values;
        if (entityList == null || entityList.length < 1)
            return;
        for (let i = 0; i < entityList.length; i++) {
            let entity = entityList[i];
            if (entity.layerId == layerName) {
                viewer.entities.remove(entity);
                i--;
            }
        }
    },
    CLASS_NAME: "GlobeCircleDrawer"
};
export {GlobeCircleDrawer};
