import {Cesium} from "./Unit";
import {viewer} from "./Viewer";
import el from "element-ui/src/locale/lang/el";
import de from "element-ui/src/locale/lang/de";
import en from "element-ui/src/locale/lang/en";
import {eachBefore} from "echarts/src/chart/tree/traversalHelper";

var handler = null;
var activeShapePoints = [];
var activeShape;
var floatingPoint;
var drawingMode = "line";
let polygonList = [];

class DrawGraphicalHelper {
    static get handler () {
        return handler;
    }

    static set handler (_handler) {
        handler = _handler;
    }

    static get polygonList () {
        return polygonList;
    }

    static set polygonList (_polygon) {
        polygonList.push(_polygon);
    }

    //绘制点
    static createPoint (worldPosition) {
        var point = viewer.entities.add({
            position: worldPosition,
            point: {
                color: Cesium.Color.WHITE,
                pixelSize: 10,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            }
        });
        return point;
    }

//初始化为线
// var drawingMode = 'line';
//绘制图形
    static drawShape (positionData) {
        var shape;
        const _this = this;
        if (drawingMode === "line") {
            shape = viewer.entities.add({
                type: "polyline",
                polyline: {
                    positions: positionData,
                    clampToGround: true,
                    width: 3
                }
            });

        } else if (drawingMode === "polygon") {
            shape = viewer.entities.add({
                polygon: {
                    hierarchy: positionData,
                    material: new Cesium.ColorMaterialProperty(Cesium.Color.WHITE.withAlpha(0.7))
                },
                type: "polygon"
            });
        } else if (drawingMode === "circle") {
            //当positionData为数组时绘制最终图，如果为function则绘制动态图
            var value = typeof positionData.getValue === "function" ?
                positionData.getValue(0) :
                positionData;
            //var start = activeShapePoints[0];
            //var end = activeShapePoints[activeShapePoints.length - 1];
            //var r = Math.sqrt(Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2));
            //r = r ? r : r + 1;
            shape = viewer.entities.add({
                position: activeShapePoints[0],
                type: "circle",
                ellipse: {
                    semiMinorAxis: new Cesium.CallbackProperty(function () {
                        //半径 两点间距离
                        var r = Math.sqrt(Math.pow(value[0].x - value[value.length - 1].x, 2) + Math
                            .pow(value[0].y - value[value.length - 1].y, 2));
                        return r ?
                            r :
                            r + 1;
                    }, false),
                    semiMajorAxis: new Cesium.CallbackProperty(function () {
                        var r = Math.sqrt(Math.pow(value[0].x - value[value.length - 1].x, 2) + Math
                            .pow(value[0].y - value[value.length - 1].y, 2));
                        return r ?
                            r :
                            r + 1;
                    }, false),
                    material: Cesium.Color.BLUE.withAlpha(0.5),
                    outline: true
                }
            });
        } else if (drawingMode === "rectangle") {
            //当positionData为数组时绘制最终图，如果为function则绘制动态图
            var arr = typeof positionData.getValue === "function" ?
                positionData.getValue(0) :
                positionData;
            shape = viewer.entities.add({
                type: "rectangle",
                rectangle: {
                    coordinates: new Cesium.CallbackProperty(function () {
                        var obj = Cesium.Rectangle.fromCartesianArray(arr);
                        //if(obj.west==obj.east){ obj.east+=0.000001};
                        //if(obj.south==obj.north){obj.north+=0.000001};
                        return obj;
                    }, false),
                    material: Cesium.Color.RED.withAlpha(0.5)
                }
            });
        }

        return shape;
    }


// Redraw the shape so it's not dynamic and remove the dynamic shape.
    static terminateShape () {
        const _this = this;
        activeShapePoints.pop(); //去除最后一个动态点
        if (activeShapePoints.length) {
            const shape = this.drawShape(activeShapePoints); //绘制最终图
            _this.polygonList = shape;
        }
        viewer.entities.remove(floatingPoint); //去除动态点图形（当前鼠标点）
        viewer.entities.remove(activeShape); //去除动态图形
        floatingPoint = undefined;
        activeShape = undefined;
        activeShapePoints = [];
    }

    static drawGraphical (_drawingMode) {
        const _this = this;
        drawingMode = _drawingMode;
        // const handler=this.handler;
        if (_this.handler == undefined || _this.handler == null) {
            _this.handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
        }
        //鼠标左键
        viewer.scene.globe.depthTestAgainstTerrain = true;
        _this.handler.setInputAction(function (event) {

            // We use `viewer.scene.pickPosition` here instead of `viewer.camera.pickEllipsoid` so that
            // we get the correct point when mousing over terrain.
            // scene.pickPosition只有在开启地形深度检测，且不使用默认地形时是准确的。
            var earthPosition = viewer.scene.camera.pickEllipsoid(event.position, viewer.scene.globe.ellipsoid);
            // `earthPosition` will be undefined if our mouse is not over the globe.
            if (Cesium.defined(earthPosition)) {
                if (activeShapePoints.length === 0) {
                    floatingPoint = _this.createPoint(earthPosition);
                    activeShapePoints.push(earthPosition);
                    var dynamicPositions = new Cesium.CallbackProperty(function () {
                        if (drawingMode === "polygon") {
                            return new Cesium.PolygonHierarchy(activeShapePoints);
                        }
                        return activeShapePoints;
                    }, false);
                    activeShape = _this.drawShape(dynamicPositions); //绘制动态图
                }
                activeShapePoints.push(earthPosition);
                // _this.createPoint(earthPosition);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
//鼠标移动
        _this.handler.setInputAction(function (event) {
            if (Cesium.defined(floatingPoint)) {
                var newPosition = viewer.scene.camera.pickEllipsoid(event.endPosition, viewer.scene.globe.ellipsoid);
                if (Cesium.defined(newPosition)) {
                    // floatingPoint.position.setValue(newPosition);
                    activeShapePoints.pop();
                    activeShapePoints.push(newPosition);
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        _this.handler.setInputAction(function (event) {
            _this.terminateShape();
            _this.handler.destroy();
            _this.handler = null;

        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }

    static drawPolygon (shapeJson) {
        const _this = this;
        if (shapeJson.Circle !== undefined && shapeJson.Circle.length > 0) {
            for (let i = 0; i < shapeJson.Circle.length; i++) {
                const circle = shapeJson.Circle[i];
                const points = circle.points;
                const centerlon = points.center.longitude;
                const centerlat = points.center.latitude;
                const radius = points.radius;
                let material = new Cesium.Color(1, 0, 0, 1);
                let _option = new Array();
                _option.position = Cesium.Cartesian3.fromDegrees(centerlon, centerlat, 0.0);
                _option.ellipse = {
                    semiMinorAxis: radius,
                    semiMajorAxis: radius,
                    height: 0.0,
                    material: material
                }
                if (circle.id !== undefined && circle.id !== "") {
                    _option.id = circle.id;
                }
                const a = viewer.entities.add(_option);
                if (circle.material !== undefined) {
                    if (circle.material.stripe !== undefined && circle.material.stripe !== "") {
                        let evenColor = Cesium.Color.BLACK;
                        let oddColor = Cesium.Color.WHITE;
                        let offset = 0;
                        let repeat = 32;
                        let orientation = Cesium.StripeOrientation.VERTICAL;
                        if (circle.material.stripe.evenColor !== undefined) {

                            evenColor = circle.material.stripe.evenColor;
                        }
                        if (circle.material.stripe.oddColor !== undefined) {
                            oddColor = circle.material.stripe.oddColor;
                        }
                        if (circle.material.stripe.repeat !== undefined) {
                            repeat = circle.material.stripe.repeat;
                        }
                        if (circle.material.stripe.offset !== undefined) {
                            offset = circle.material.stripe.offset;
                        }
                        if (circle.material.stripe.orientation !== undefined) {
                            if (circle.material.stripe.orientation == "VERTICAL ") {
                                orientation = Cesium.StripeOrientation.HORIZONTAL;
                            } else {
                                orientation = Cesium.StripeOrientation.VERTICAL;
                            }

                        }
                        material = new Cesium.StripeMaterialProperty({
                            evenColor: evenColor,
                            oddColor: oddColor,
                            repeat: repeat,
                            offset: offset,
                            orientation: orientation
                        })

                    } else if (circle.material.color !== undefined && circle.material.color !== "") {
                        const c = circle.material.color;
                        material = circle.material.color;
                    }
                    a.ellipse.material = material;
                }

                if (circle.name !== undefined && circle.name !== "") {
                    a.name = circle.name;
                }


                if (circle.outlineColor !== undefined && circle.outlineColor !== "") {
                    a.ellipse.outline = true;
                    a.ellipse.outlineColor = circle.outlineColor
                }
                a.type = "circle";
                _this.polygonList = a;
            }
        }
        if (shapeJson.Polygon !== undefined && shapeJson.Polygon.length > 0) {
            for (let i = 0; i < shapeJson.Polygon.length; i++) {
                const positions = []
                const polygon = shapeJson.Polygon[i];
                const points = polygon.points;
                for (let j = 0; j < points.length; j++) {
                    const point = points[j];
                    const lon = point.longitude;
                    const lat = point.latitude;
                    positions.push(lon, lat);
                }
                let material = new Cesium.Color(1, 0, 0, 1);
                let _option = new Array();
                _option.polygon = {
                    hierarchy: Cesium.Cartesian3.fromDegreesArray(positions),
                    material: material,
                    clampToGround:true
                }
                if (polygon.id !== undefined && polygon.id !== "") {
                    _option.id = polygon.id;
                }
                const a = viewer.entities.add(_option);
                if (polygon.material !== undefined) {
                    if (polygon.material.stripe !== undefined && polygon.material.stripe !== "") {
                        let evenColor = Cesium.Color.BLACK;
                        let oddColor = Cesium.Color.WHITE;
                        let offset = 0;
                        let repeat = 32;
                        let orientation = Cesium.StripeOrientation.VERTICAL;
                        if (polygon.material.stripe.evenColor !== undefined) {
                            evenColor = polygon.material.stripe.evenColor;
                        }
                        if (polygon.material.stripe.oddColor !== undefined) {
                            oddColor = polygon.material.stripe.oddColor;
                        }
                        if (polygon.material.stripe.repeat !== undefined) {
                            repeat = polygon.material.stripe.repeat;
                        }
                        if (polygon.material.stripe.offset !== undefined) {
                            offset = polygon.material.stripe.offset;
                        }
                        if (polygon.material.stripe.orientation !== undefined) {
                            if (polygon.material.stripe.orientation == "HORIZONTAL") {
                                orientation = Cesium.StripeOrientation.HORIZONTAL;
                            } else if (polygon.material.stripe.orientation == "VERTICAL") {
                                orientation = Cesium.StripeOrientation.VERTICAL;
                            }

                        }
                        material = new Cesium.StripeMaterialProperty({
                            evenColor: evenColor,
                            oddColor: oddColor,
                            repeat: repeat,
                            offset: offset,
                            orientation: orientation
                        })

                    }
                    else if (polygon.material.color !== undefined && polygon.material.color !== "") {
                        material = polygon.material.color;
                    }
                    a.polygon.material = material;
                }

                if (polygon.name !== undefined && polygon !== "") {
                    a.name = polygon.name;
                }
                a.type = "polygon";
                _this.polygonList = a;
            }
        }
        if (shapeJson.Polyline !== undefined && shapeJson.Polyline.length > 0) {
            for (let i = 0; i < shapeJson.Polyline.length; i++) {
                let _option = new Array();
                const polylinepositions = []
                const polyline = shapeJson.Polyline[i];
                const polylinepoints = polyline.points;
                for (let j = 0; j < polylinepoints.length; j++) {
                    const point = polylinepoints[j];
                    const lon = point.longitude;
                    const lat = point.latitude;
                    polylinepositions.push(lon, lat);
                }
                _option.polyline = {
                    positions: Cesium.Cartesian3.fromDegreesArray(polylinepositions),
                    material: Cesium.Color.RED,
                    width: 5.0,
                    clampToGround: true
                }
                if (polyline.id !== undefined && polyline.id !== "") {
                    _option.id = polyline.id;
                }
                const a = viewer.entities.add(_option);

                if (polyline.name !== undefined && polyline !== "") {
                    a.name = polyline.name;
                }
                if (polyline.material !== undefined && polyline.material !== "") {
                    if (polyline.material.color !== undefined && polyline.material.color !== "") {
                        a.polyline.material = polyline.material.color;
                    }
                }

                if (polyline.width !== undefined && polyline.width !== "") {
                    a.polyline.width = polyline.width;
                }
                // if (polyline.clampToGround !== undefined && typeof polyline.clampToGround == "boolean") {
                //     a.polyline.clampToGround = polyline.clampToGround;
                // }

                a.type = "polyline";
                _this.polygonList = a;
            }
        }
    }

    static deletePolygon (classify, value) {
        const _this = this;
        if (typeof classify !== "undefined") {
            if (classify === "id") {
                if (value !== undefined) {
                    for (let i = 0; i < _this.polygonList.length; i++) {
                        let poly = _this.polygonList[i];
                        if (poly.id == value) {
                            viewer.entities.remove(poly);
                        }
                    }
                }
            } else if (classify === "name") {
                if (value !== undefined) {
                    for (let i = 0; i < _this.polygonList.length; i++) {
                        let poly = _this.polygonList[i];

                        if (poly.name == value) {
                            viewer.entities.remove(poly);
                        }
                    }
                }
            } else if (classify === "type") {
                if (value !== undefined) {
                    for (let i = 0; i < _this.polygonList.length; i++) {
                        let poly = _this.polygonList[i];
                        if (poly.type !== undefined) {
                            if (poly.type == value) {
                                viewer.entities.remove(poly);
                            }
                        }

                    }
                }
            }

        } else {
            if (_this.polygonList.length > 0) {
                for (let i = 0; i < _this.polygonList.length; i++) {
                    let poly = _this.polygonList[i];
                    viewer.entities.remove(poly);
                }
            }
        }
        if (typeof polygon != "undefined") {
            viewer.entities.remove(entity);
        }
    }

    static savePolygon () {
        const polyJson = new Array();
        const Circle = new Array();
        const Polyline = new Array();
        const Polygon = new Array();
        if (this.polygonList !== undefined && this.polygonList.length > 0) {
            for (let i = 0; i < this.polygonList.length; i++) {
                const shape = polygonList[i];
                if (shape.type !== undefined) {
                    if (shape.type === "circle") {
                        let name = "";

                        let color = null;
                        let stripe = null;
                        let material = new Array();
                        let id = null;
                        let outlineColor = null;
                        let points = {
                            center: {
                                longitude: null,
                                latitude: null
                            },
                            radius: null
                        };
                        let circle = new Array();
                        if (shape.name !== undefined) {
                            name = shape.name;
                        }

                        if (shape.ellipse.material._color !== undefined) {
                            // const r = shape.ellipse.material._color._value.red;
                            // const g = shape.ellipse.material._color._value.green;
                            // const b = shape.ellipse.material._color._value.blue;
                            // const a = shape.ellipse.material._color._value.alpha;
                            color = shape.ellipse.material._color._value;
                            material.color = color;
                        } else if (shape.ellipse.material._evenColor !== undefined) {
                            let evenColor = shape.ellipse.material._evenColor._value;
                            let oddColor = shape.ellipse.material._oddColor._value;
                            let offset = shape.ellipse.material._offset._value;
                            let repeat = shape.ellipse.material._repeat._value;
                            let orientation = shape.ellipse.material._orientation._value;
                            if (orientation === 0) {
                                orientation = "HORIZONTAL";
                            } else {
                                orientation = "VERTICAL";
                            }
                            stripe = {
                                evenColor: evenColor,
                                oddColor: oddColor,
                                offset: offset,
                                repeat: repeat,
                                orientation: orientation
                            }
                            material.stripe = stripe;
                        }
                        if (shape.ellipse.outlineColor !== undefined) {
                            // const r = shape.ellipse.outlineColor._value.red;
                            // const g = shape.ellipse.outlineColor._value.green;
                            // const b = shape.ellipse.outlineColor._value.blue;
                            // const a = shape.ellipse.outlineColor._value.alpha;
                            outlineColor = shape.ellipse.outlineColor._value;
                        }
                        if (shape.ellipse._semiMajorAxis !== undefined) {
                            const radius = shape.ellipse._semiMajorAxis._value;
                            points.radius = radius;
                        }
                        if (shape.id !== undefined) {
                            id = shape.id;
                        }
                        if (shape.position !== undefined) {
                            //三维坐标转经纬度
                            const ellipsoid = viewer.scene.globe.ellipsoid;
                            // var cartesian3=new Cesium.cartesian3(x,y,z);
                            const cartographic = ellipsoid.cartesianToCartographic(shape.position._value);
                            const lat = Cesium.Math.toDegrees(cartographic.latitude);
                            const lng = Cesium.Math.toDegrees(cartographic.longitude);
                            const alt = cartographic.height;
                            points.center.longitude = lng;
                            points.center.latitude = lat;
                        }
                        if (name !== null) {
                            circle.name = name;
                        }
                        if (outlineColor !== null) {
                            circle.outlineColor = outlineColor;
                        }
                        if (material !== null) {
                            circle.material = material;
                        }
                        if (id !== null) {
                            circle.id = id;
                        }
                        circle.points = points;
                        Circle.push(circle);
                    }
                    if (shape.type === "polyline") {

                        let name = "";
                        let color = null;
                        let width = null;
                        let clampToGround = null;
                        let points = [];
                        let material = new Array();
                        let polyline = new Array();
                        let id = null;
                        if (shape.id !== undefined) {
                            id = shape.id;
                        }
                        if (shape.name !== undefined) {
                            name = shape.name;
                        }
                        if (shape.polyline.material._color !== undefined) {
                            // const r = shape.polyline.material._color._value.red;
                            // const g = shape.polyline.material._color._value.green;
                            // const b = shape.polyline.material._color._value.blue;
                            // const a = shape.polyline.material._color._value.alpha;
                            color = shape.polyline.material._color._value;
                            material.color = color;
                        }
                        if (shape.polyline.width !== undefined) {
                            width = shape.polyline.width._value;
                        }
                        if (shape.polyline.clampToGround !== undefined) {
                            clampToGround = shape.polyline.clampToGround._value;
                            ;
                        }
                        if (shape.polyline.positions !== undefined && shape.polyline.positions._value.length > 0) {
                            //三维坐标转经纬度
                            for (let j = 0; j < shape.polyline.positions._value.length; j++) {
                                const position = shape.polyline.positions._value[j];
                                const ellipsoid = viewer.scene.globe.ellipsoid;
                                // var cartesian3=new Cesium.cartesian3(x,y,z);
                                const cartographic = ellipsoid.cartesianToCartographic(position);
                                const lat = Cesium.Math.toDegrees(cartographic.latitude);
                                const lng = Cesium.Math.toDegrees(cartographic.longitude);
                                const alt = cartographic.height;
                                let point = {longitude: lng, latitude: lat}
                                points.push(point);
                            }
                        }
                        if (name !== null) {
                            polyline.name = name;
                        }
                        if (material !== null) {
                            polyline.material = material;
                        }
                        if (width !== null) {
                            polyline.width = width;
                        }
                        if (clampToGround !== null) {
                            polyline.clampToGround = clampToGround;
                        }
                        if (id !== null) {
                            polyline.id = id;
                        }
                        polyline.points = points;
                        Polyline.push(polyline);
                    }
                    if (shape.type === "polygon") {

                        let name = "";
                        let color = null;
                        let stripe = null;
                        let points = [];
                        let outlineColor = null;
                        let polygon = new Array();
                        let material = new Array();
                        let id = null;
                        if (shape.id !== undefined) {
                            id = shape.id;
                        }
                        if (shape.name !== undefined) {
                            name = shape.name;
                        }

                        if (shape.polygon.material._color !== undefined) {
                            // const r = shape.polygon.material._color._value.red;
                            // const g = shape.polygon.material._color._value.green;
                            // const b = shape.polygon.material._color._value.blue;
                            // const a = shape.polygon.material._color._value.alpha;
                            color = shape.polygon.material._color._value;
                            material.color = color;
                        } else if (shape.polygon.material._evenColor !== undefined) {
                            let evenColor = shape.polygon.material._evenColor._value;
                            let oddColor = shape.polygon.material._oddColor._value;
                            let offset = shape.polygon.material._offset._value;
                            let repeat = shape.polygon.material._repeat._value;
                            let orientation = shape.polygon.material._orientation._value;
                            if (orientation === 0) {
                                orientation = "HORIZONTAL";
                            } else {
                                orientation = "VERTICAL";
                            }
                            stripe = {
                                evenColor: evenColor,
                                oddColor: oddColor,
                                offset: offset,
                                repeat: repeat,
                                orientation: orientation
                            }
                            material.stripe = stripe;
                        }
                        if (shape.polygon.outlineColor !== undefined) {
                            // const r = shape.polygon.outlineColor._value.red;
                            // const g = shape.polygon.outlineColor._value.green;
                            // const b = shape.polygon.outlineColor._value.blue;
                            // const a = shape.polygon.outlineColor._value.alpha;
                            outlineColor = shape.polygon.outlineColor._value;
                        }
                        if (shape.polygon.hierarchy._value.positions !== undefined && shape.polygon.hierarchy._value.positions.length > 0) {
                            //三维坐标转经纬度
                            for (let j = 0; j < shape.polygon.hierarchy._value.positions.length; j++) {
                                const position = shape.polygon.hierarchy._value.positions[j];
                                const ellipsoid = viewer.scene.globe.ellipsoid;
                                // var cartesian3=new Cesium.cartesian3(x,y,z);
                                const cartographic = ellipsoid.cartesianToCartographic(position);
                                const lat = Cesium.Math.toDegrees(cartographic.latitude);
                                const lng = Cesium.Math.toDegrees(cartographic.longitude);
                                const alt = cartographic.height;
                                let point = {longitude: lng, latitude: lat}
                                points.push(point);
                            }
                        }
                        if (name !== null) {
                            polygon.name = name;
                        }
                        if (material !== null) {
                            polygon.material = material;
                        }
                        if (outlineColor !== null) {
                            polygon.outlineColor = outlineColor;
                        }
                        if (id !== null) {
                            polygon.id = id;
                        }
                        polygon.points = points;
                        Polygon.push(polygon);
                    }
                }

            }
        }
        polyJson.Circle = Circle;
        polyJson.Polyline = Polyline;
        polyJson.Polygon = Polygon;
        return polyJson;
    }

    static editPolygon () {
        let entityName="";
        //鼠标双击事件触发编辑
        let div=document.createElement("div");
        let viewerContainer=document.getElementsByClassName("cesium-viewer")[0];
        div.innerHTML='<div class="ig-editpolygon">\n' +
            '<div class="ig-editpolygon-title">\n' +
            '      编辑\n' +
            ' </div>    ' +
            ' <div class="ig-editpolygon-body">\n' +
            '    <td style="padding: 5px">名称</td>\n' +
            '     <td>\n' +
            '     <input class="ig-editpolygon-body-input" id="nameInput" value="" />\n' +
            '    </td>\n' +
            '  </div>\n' +
            '  <div class="ig-editpolygon-footer">\n' +
            '     <button class="ig-editpolygon-footer-buttonDetermine">确定</button>\n' +
            '     <button class="ig-editpolygon-footer-buttonCancel">取消</button>\n' +
            '  </div>\n' +
            '</div>'
        viewerContainer.appendChild(div);
        div.style.display="none";
        const _this = this;
        if (_this.handler == undefined || _this.handler == null) {
            _this.handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
        }
        //鼠标左键
        let timeclick = null;
        let centerPoint = null;
        let pickedEntity = null;
        let lastPickedEntity = null;
        //圆的属性
        let center = null;
        let radius = null;
        let radiusPosition = null;
        let radiusPoint = null;
        //多边形属性
        let vertexPointList = [];

        // viewer.scene.globe.depthTestAgainstTerrain = true;
        _this.handler.setInputAction(function (movement) {

            if (timeclick !== null) {
                clearTimeout(timeclick);
                timeclick = null;
            }
            viewer.scene.screenSpaceCameraController.enableRotate = true;
            viewer.scene.screenSpaceCameraController.enableTranslate = true;
            lastPickedEntity = pickedEntity;
            if (lastPickedEntity !== null&&lastPickedEntity!==undefined) {
                if (lastPickedEntity.type == "circle") {
                    if (center !== null) {
                        lastPickedEntity.position = center;
                    }
                    if (radius !== null) {
                        lastPickedEntity.ellipse.semiMinorAxis = radius;
                        lastPickedEntity.ellipse.semiMajorAxis = radius;
                    }

                }
                else if (lastPickedEntity.type == "polyline") {
                    if (vertexPointList.length > 0) {
                        let positions0 = [];
                        for (let i = 0; i < vertexPointList.length; i++) {
                            positions0.push(vertexPointList[i].position._value);
                        }
                        lastPickedEntity.polyline.positions = positions0;
                    }

                }
                else if (lastPickedEntity.type == "polygon") {
                    if (vertexPointList.length > 0) {
                        let positions0 = [];
                        for (let i = 0; i < vertexPointList.length; i++) {
                            positions0.push(vertexPointList[i].position._value);
                        }
                        lastPickedEntity.polygon.hierarchy = new Cesium.PolygonHierarchy(positions0);
                    }

                }
            }
        div.style.display="none";
        //清除已有的点
        if (centerPoint !== null) {
            viewer.entities.remove(centerPoint);
            centerPoint = null;
        }
        if (radiusPoint !== null) {
            viewer.entities.remove(radiusPoint);
            radiusPoint = null;
        }
        if (vertexPointList !== null) {
            for (let i = 0; i < vertexPointList.length; i++) {
                let vertexPoint = vertexPointList[i];
                viewer.entities.remove(vertexPoint);
            }
            vertexPointList = [];
        }
        const picked = viewer.scene.pick(movement.position);

        if (Cesium.defined(picked)) {
            let entity = picked.id;
            pickedEntity = entity;
            entityName=entity.name;
            div.style.display="";
            let names=document.getElementsByClassName("ig-editpolygon-body-input");
            if(names!==null){
                let name=names[names.length-1];
                name.value=entityName;
            }
            if (entity.type === "circle") {
                //要看圆心和半径
                center = null;
                centerPoint = null;
                center = entity.position._value;
                radius = entity.ellipse.semiMajorAxis._value;
                centerPoint = viewer.entities.add({
                    position: new Cesium.CallbackProperty(function () {
                        return center;
                    }, false),
                    point: {
                        color: Cesium.Color.RED,
                        pixelSize: 10
                    }
                })
                radiusPoint = viewer.entities.add({
                    position: new Cesium.CallbackProperty(function () {
                        //求圆上任意一点
                        let x = center.x+ radius+15;
                        let y = center.y;
                        //转经纬度
                        const ellipsoid = viewer.scene.globe.ellipsoid;
                        const cartesian = new Cesium.Cartesian3(x, y, center.z);
                        // var cartesian3=new Cesium.cartesian3(x,y,z);
                        const cartographic = ellipsoid.cartesianToCartographic(cartesian);
                        const lat = Cesium.Math.toDegrees(cartographic.latitude);
                        const lng = Cesium.Math.toDegrees(cartographic.longitude);
                        const alt = 0.1;
                        radiusPosition = Cesium.Cartesian3.fromDegrees(lng, lat, alt);
                        return radiusPosition;
                    }, false),
                    point: {
                        color: Cesium.Color.YELLOW,
                        pixelSize: 8
                    }
                })
                const ellispe = entity.ellipse;
                entity.position = new Cesium.CallbackProperty(function () {
                    return center;
                }, false);
                ellispe.semiMinorAxis = new Cesium.CallbackProperty(function () {
                    return radius;
                }, false);
                ellispe.semiMajorAxis = new Cesium.CallbackProperty(function () {
                    return radius;
                }, false)
            }
            else if (entity.type === "polyline") {
                vertexPointList = [];
                center = null;
                centerPoint = null;
                const polyline = entity.polyline;

                const positions = polyline.positions._value;
                for (let i = 0; i < positions.length; i++) {
                    const position = positions[i];
                    let po = viewer.entities.add({
                        position: position,
                        point: {
                            color: Cesium.Color.YELLOW,
                            pixelSize: 8
                        }
                    })
                    vertexPointList.push(po);
                }

                let polyPositions = entity.polyline.positions._value;
                let polyCenter = Cesium.BoundingSphere.fromPoints(polyPositions).center;
                let polyCenter1 = Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(polyCenter);
                center = polyCenter1;
                centerPoint = viewer.entities.add({
                    position: new Cesium.CallbackProperty(function () {
                        return center;
                    }, false),
                    point: {
                        color: Cesium.Color.RED,
                        pixelSize: 10
                    }
                })
                polyline.positions = new Cesium.CallbackProperty(function () {
                    let positions0 = [];
                    for (let i = 0; i < vertexPointList.length; i++) {
                        positions0.push(vertexPointList[i].position._value);
                    }
                    return positions0;
                }, false);

            }
            else if (entity.type === "polygon") {
                center = null;
                centerPoint = null;
                vertexPointList = [];
                const polygon = entity.polygon;
                const positions = polygon.hierarchy._value.positions;
                for (let i = 0; i < positions.length; i++) {
                    const position = positions[i];
                    let po = viewer.entities.add({
                        position: position,
                        point: {
                            color: Cesium.Color.YELLOW,
                            pixelSize: 8
                        }
                    })
                    vertexPointList.push(po);
                }
                //平移
                let polyPositions = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions;
                let polyCenter = Cesium.BoundingSphere.fromPoints(polyPositions).center;
                let polyCenter1 = Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(polyCenter);
                center = polyCenter1;
                let positions0 = [];
                polygon.hierarchy = new Cesium.CallbackProperty(function () {
                    positions0 = [];
                    for (let i = 0; i < vertexPointList.length; i++) {
                        positions0.push(vertexPointList[i].position._value);
                    }
                    return new Cesium.PolygonHierarchy(positions0);
                }, false);
                centerPoint = viewer.entities.add({
                    position: new Cesium.CallbackProperty(function () {
                        return center;
                    }, false),
                    point: {
                        color: Cesium.Color.RED,
                        pixelSize: 10
                    }
                })


            }
        }

    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
        _this.handler.setInputAction (function (event) {
        if (timeclick !== null) {
            clearTimeout(timeclick);
        }
        viewer.scene.screenSpaceCameraController.enableRotate = true;
        viewer.scene.screenSpaceCameraController.enableTranslate = true;
        _this.handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    },Cesium.ScreenSpaceEventType.RIGHT_CLICK);


    timeclick = setTimeout(function () {
        _this.handler.setInputAction(function (movement) {
            const picked = viewer.scene.pick(movement.position);
            if (Cesium.defined(picked)) {
                viewer.scene.screenSpaceCameraController.enableRotate = false;
                viewer.scene.screenSpaceCameraController.enableTranslate = false;
                const entity = picked.id;
                if (entity == centerPoint) {
                    _this.handler.setInputAction(function (movement) {
                        var newPosition = viewer.scene.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
                        if (Cesium.defined(newPosition)) {
                            let disx = newPosition.x - center.x;
                            let disy = newPosition.y - center.y;
                            let disz = newPosition.z - center.z;
                            for (let i = 0; i < vertexPointList.length; i++) {
                                let vertexPoint = vertexPointList[i];
                                vertexPoint.position = new Cesium.Cartesian3(vertexPoint.position._value.x + disx, vertexPoint.position._value.y + disy, vertexPoint.position._value.z + disz);
                            }
                            center = newPosition;
                        }
                    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
                } else if (entity == radiusPoint) {
                    _this.handler.setInputAction(function (movement) {
                        var newPosition = viewer.scene.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
                        if (Cesium.defined(newPosition)) {

                            radiusPosition = newPosition;
                            if (center !== null) {
                                radius = Cesium.Cartesian3.distance(center, radiusPosition);
                            }
                        }
                    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
                } else {
                    for (let i = 0; i < vertexPointList.length; i++) {
                        let vertexPoint = vertexPointList[i];
                        if (entity == vertexPoint) {
                            _this.handler.setInputAction(function (movement) {
                                var newPosition = viewer.scene.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
                                if (Cesium.defined(newPosition)) {

                                    entity.position = newPosition;
                                }
                            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
                        }
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN)
    }, 500);
    // _this.handler.setInputAction(function (movement) {
    //     _this.handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    // }, Cesium.ScreenSpaceEventType.LEFT_UP)

        //绑定确定取消按钮
        let cancels = document.getElementsByClassName("ig-editpolygon-footer-buttonCancel");
        if(cancels!==null){
            let cancel = cancels[cancels.length - 1];
            cancel.addEventListener("click", function () {
                div.style.display="none";
            })
        }


        let determines = document.getElementsByClassName("ig-editpolygon-footer-buttonDetermine");
        let determine = determines[determines.length - 1];
        determine.addEventListener("click", function () {
            div.style.display="none";
            let names=document.getElementsByClassName("ig-editpolygon-body-input");
            if(names!==null){
                let name=names[names.length-1];
                let entityName=name.value;
                if(pickedEntity!==null){
                    pickedEntity.name=entityName;
                }
            }

        })
    }

    static cancelEdit(){

    }
}
export {DrawGraphicalHelper};
