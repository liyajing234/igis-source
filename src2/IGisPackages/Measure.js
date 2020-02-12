// 测量 绘图 军事标绘
import {GlobeTracker} from "../IGisPlugins/GlobeTracker.js";
import {viewer} from "./Viewer.js";
const Cesium = require("cesium/Cesium");
let tracker=new GlobeTracker(viewer);
let flag=1;
class Measure{
    //坐标查询
    posMeasure(){
        let _this=this;
        flag = 0;
        tracker.pickPosition(function (position, lonLat) {
        });
    };
//空间距离
    spaceDisMeasure(){
        let _this=this;
        flag = 0;
        tracker.pickSpaceDistance(function (positions, rlt) {
        });
    };
//贴地距离
    stickDisMeasure(){
        let _this=this;
        flag = 0;
        tracker.pickStickDistance(function (positions, rlt) {
        });
    };
//测量面积
    areaMeasure(){
        let _this=this;
        flag = 0;
        tracker.pickArea(function (positions, rlt) {
        });
    };
}

class DrawFigure {
    //画多边形
    drawPolygon(){
        let _this=this;
        flag = 0;
        tracker.trackPolygon(function (positions) {
            let objId = (new Date()).getTime();
            _this.shapeDic[objId] = positions;
            _this.showPolygon(objId, positions);

        });
    };
    //画折线
    drawPolyline(){
        let _this=this;
        flag = 0;
        tracker.trackPolyline(function (positions) {
            let objId = (new Date()).getTime();
            _this.shapeDic[objId] = positions;
            _this.showPolyline(objId, positions);
        });
    };
    //画矩形
    drawRectangle(){
        let _this=this;
        flag = 0;
        tracker.trackRectangle(function (positions) {
            let objId = (new Date()).getTime();
            _this.shapeDic[objId] = positions;
            _this.showRectangle(objId, positions);
        });
    };
    //画圆
    drawCircle(){
        let _this=this;
        flag = 0;
        tracker.trackCircle(function (positions) {
            let objId = (new Date()).getTime();
            _this.shapeDic[objId] = positions;
            _this.showCircle(objId, positions);
        });
    };
    //画点
    drawPoint(){
        let _this=this;
        flag = 0;
        tracker.trackPoint(function (position) {
            let objId = (new Date()).getTime();
            _this.shapeDic[objId] = position;
            _this.showPoint(objId, position);
        });
    };
    //绘制缓冲区域
    drawBufferLine(){
        let _this=this;
        flag = 0;
        tracker.trackBufferLine(function (positions, radius) {
            let objId = (new Date()).getTime();
            _this.shapeDic[objId] = {
                positions: positions,
                radius: radius
            };
            _this.showBufferLine(objId, positions, radius);
        });
    };
}

class MilitaryPlotting{
    constructor(props) {
        this.bindGloveEvent();
    }

    //直线箭头  有bug缺绘制的点
    straightArrow(){
        let _this=this;
        flag = 0;
        tracker.trackStraightArrow(function (positions) {
            let objId = (new Date()).getTime();
            _this.shapeDic[objId] = positions;
            _this.showStraightArrow(objId, positions);
        });
    };
//攻击箭头
    attackArrow() {
        let _this=this;
        flag = 0;
        tracker.trackAttackArrow(function (positions, custom) {
            let objId = (new Date()).getTime();
            _this.shapeDic[objId] = {
                custom: custom,
                positions: positions
            };
            _this.showAttackArrow(objId, positions);
        });
    };
//钳击箭头 有bug缺绘制的点
    pincerArrow(){
        let _this=this;
        flag = 0;
        tracker.trackPincerArrow(function (positions, custom) {
            let objId = (new Date()).getTime();
            _this.shapeDic[objId] = {
                custom: custom,
                positions: positions
            };
            _this.showPincerArrow(objId, positions);
        });
    };
//编辑箭头  有bug 无法编辑
    editShape(){
        let _this=this;
        layer.msg("点击要编辑的箭头！");
        flag = 1;
        //清除标绘状态
        tracker.clear();
    };
//删除箭头 有bug 无法删除
    deleteShape(){
        let _this=this;
        layer.msg("点击要删除的箭头！");
        flag = 2;
        //清除标绘状态
        tracker.clear();
    };

//region 添加箭头功能 监听鼠标左键
    bindGloveEvent(){
        let _this = this;
        let viewer = _this.viewer;
        let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction(function (movement) {
            let pick = viewer.scene.pick(movement.position);
            if (!pick) {
                return;
            }
            let obj = pick.id;
            if (!obj || !obj.layerId || flag == 0) {
                return;
            }
            let objId = obj.objId;
            //flag为编辑或删除标识,1为编辑，2为删除
            if (flag == 1) {
                switch (obj.shapeType) {
                    case "Polygon":
                        flag = 0;
                        _this.editPolygon(objId);
                        break;
                    case "Polyline":
                        flag = 0;
                        _this.editPolyline(objId);
                        break;
                    case "Rectangle":
                        flag = 0;
                        _this.editRectangle(objId);
                        break;
                    case "Circle":
                        flag = 0;
                        _this.editCircle(objId);
                        break;
                    case "Point":
                        flag = 0;
                        _this.editPoint(objId);
                        break;
                    case "BufferLine":
                        flag = 0;
                        _this.editBufferLine(objId);
                        break;
                    case "StraightArrow":
                        flag = 0;
                        _this.editStraightArrow(objId);
                        break;
                    case "AttackArrow":
                        flag = 0;
                        _this.editAttackArrow(objId);
                        break;
                    case "PincerArrow":
                        flag = 0;
                        _this.editPincerArrow(objId);
                        break;
                    default:
                        break;
                }
            } else if (flag == 2) {
                _this.clearEntityById(objId);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    };

    showPolygon(objId, positions) {
        let _this=this;
        let material = Cesium.Color.fromCssColorString('#ff0').withAlpha(0.5);
        let outlineMaterial = new Cesium.PolylineDashMaterialProperty({
            dashLength: 16,
            color: Cesium.Color.fromCssColorString('#00f').withAlpha(0.7)
        });
        let outlinePositions = [].concat(positions);
        outlinePositions.push(positions[0]);
        let bData = {
            layerId: _this.layerId,
            objId: objId,
            shapeType: "Polygon",
            polyline: {
                positions: outlinePositions,
                clampToGround: true,
                width: 2,
                material: outlineMaterial
            },
            polygon: new Cesium.PolygonGraphics({
                hierarchy: positions,
                asynchronous: false,
                material: material
            })
        };
        let entity = _this.viewer.entities.add(bData);
    };
    showPolyline(objId, positions) {
        let _this=this;
        let material = new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.25,
            color: Cesium.Color.fromCssColorString('#00f').withAlpha(0.9)
        });
        let bData = {
            layerId: _this.layerId,
            objId: objId,
            shapeType: "Polyline",
            polyline: {
                positions: positions,
                clampToGround: true,
                width: 8,
                material: material
            }
        };
        let entity = _this.viewer.entities.add(bData);
    };
    showRectangle(objId, positions) {
        let _this=this;
        let material = Cesium.Color.fromCssColorString('#ff0').withAlpha(0.5);
        let outlineMaterial = new Cesium.PolylineDashMaterialProperty({
            dashLength: 16,
            color: Cesium.Color.fromCssColorString('#00f').withAlpha(0.7)
        });
        let rect = Cesium.Rectangle.fromCartesianArray(positions);
        let arr = [rect.west, rect.north, rect.east, rect.north, rect.east, rect.south, rect.west, rect.south, rect.west, rect.north];
        let outlinePositions = Cesium.Cartesian3.fromRadiansArray(arr);
        let bData = {
            layerId: _this.layerId,
            objId: objId,
            shapeType: "Rectangle",
            polyline: {
                positions: outlinePositions,
                clampToGround: true,
                width: 2,
                material: outlineMaterial
            },
            rectangle: {
                coordinates: rect,
                material: material
            }
        };
        let entity = _this.viewer.entities.add(bData);
    };
    showCircle(objId, positions) {
        _this=this;
        let material = Cesium.Color.fromCssColorString('#ff0').withAlpha(0.5);
        let outlineMaterial = new Cesium.PolylineDashMaterialProperty({
            dashLength: 16,
            color: Cesium.Color.fromCssColorString('#f00').withAlpha(0.7)
        });
        let radiusMaterial = new Cesium.PolylineDashMaterialProperty({
            dashLength: 16,
            color: Cesium.Color.fromCssColorString('#00f').withAlpha(0.7)
        });
        let pnts = tracker.circleDrawer._computeCirclePolygon(positions);
        let dis = tracker.circleDrawer._computeCircleRadius3D(positions);
        dis = (dis / 1000).toFixed(3);
        let text = dis + "km";
        let bData = {
            layerId: _this.layerId,
            objId: objId,
            shapeType: "Circle",
            position: positions[0],
            label: {
                text: text,
                font: '16px Helvetica',
                fillColor: Cesium.Color.SKYBLUE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 1,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                eyeOffset: new Cesium.ConstantProperty(new Cesium.Cartesian3(0, 0, -9000)),
                pixelOffset: new Cesium.Cartesian2(16, 16)
            },
            billboard: {
                image: "images/circle_center.png",
                eyeOffset: new Cesium.ConstantProperty(new Cesium.Cartesian3(0, 0, -500)),
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            },
            polyline: {
                positions: positions,
                clampToGround: true,
                width: 2,
                material: radiusMaterial
            },
            polygon: new Cesium.PolygonGraphics({
                hierarchy: pnts,
                asynchronous: false,
                material: material
            })
        };
        let entity = viewer.entities.add(bData);

        let outlineBdata = {
            layerId: layerId,
            objId: objId,
            shapeType: "Circle",
            polyline: {
                positions: pnts,
                clampToGround: true,
                width: 2,
                material: outlineMaterial
            }
        };
        let outlineEntity = _this.viewer.entities.add(outlineBdata);
    };
    showPoint(objId, position) {
        let _this=this;
        let entity = viewer.entities.add({
            layerId: _this.layerId,
            objId: objId,
            shapeType: "Point",
            position: position,
            billboard: {
                image: "images/circle_red.png",
                eyeOffset: new Cesium.ConstantProperty(new Cesium.Cartesian3(0, 0, -500)),
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            }
        });
    };
    showBufferLine(objId, positions, radius) {
        let _this=this;
        let buffer = tracker.bufferLineDrawer.computeBufferLine(positions, radius);
        let material = Cesium.Color.fromCssColorString('#ff0').withAlpha(0.5);
        let lineMaterial = new Cesium.PolylineDashMaterialProperty({
            dashLength: 16,
            color: Cesium.Color.fromCssColorString('#00f').withAlpha(0.7)
        });
        let bData = {
            layerId: _this.layerId,
            objId: objId,
            shapeType: "BufferLine",
            polygon: new Cesium.PolygonGraphics({
                hierarchy: buffer,
                asynchronous: false,
                material: material
            }),
            polyline: {
                positions: positions,
                clampToGround: true,
                width: 2,
                material: lineMaterial
            }
        };
        let entity = _this.viewer.entities.add(bData);
    };
    showStraightArrow(objId, positions) {
        let _this=this;
        let material = Cesium.Color.fromCssColorString('#ff0').withAlpha(0.5);
        let outlineMaterial = new Cesium.PolylineDashMaterialProperty({
            dashLength: 16,
            color: Cesium.Color.fromCssColorString('#f00').withAlpha(0.7)
        });
        let outlinePositions = [].concat(positions);
        outlinePositions.push(positions[0]);
        let bData = {
            layerId: _this.layerId,
            objId: objId,
            shapeType: "StraightArrow",
            polyline: {
                positions: outlinePositions,
                clampToGround: true,
                width: 2,
                material: outlineMaterial
            },
            polygon: new Cesium.PolygonGraphics({
                hierarchy: positions,
                asynchronous: false,
                material: material
            })
        };
        let entity = _this.viewer.entities.add(bData);
    };
    showAttackArrow(objId, positions){
        let _this=this;
        let material = Cesium.Color.fromCssColorString('#ff0').withAlpha(0.5);
        let outlineMaterial = new Cesium.PolylineDashMaterialProperty({
            dashLength: 16,
            color: Cesium.Color.fromCssColorString('#f00').withAlpha(0.7)
        });
        let outlinePositions = [].concat(positions);
        outlinePositions.push(positions[0]);
        let bData = {
            layerId: _this.layerId,
            objId: objId,
            shapeType: "AttackArrow",
            polyline: {
                positions: outlinePositions,
                clampToGround: true,
                width: 2,
                material: outlineMaterial
            },
            polygon: new Cesium.PolygonGraphics({
                hierarchy: positions,
                asynchronous: false,
                material: material
            })
        };
        let entity = _this.viewer.entities.add(bData);
    };
    showPincerArrow(objId, positions) {
        let _this=this;
        let material = Cesium.Color.fromCssColorString('#ff0').withAlpha(0.5);
        let outlineMaterial = new Cesium.PolylineDashMaterialProperty({
            dashLength: 16,
            color: Cesium.Color.fromCssColorString('#f00').withAlpha(0.7)
        });
        let outlinePositions = [].concat(positions);
        outlinePositions.push(positions[0]);
        let bData = {
            layerId: _this.layerId,
            objId: objId,
            shapeType: "PincerArrow",
            polyline: {
                positions: outlinePositions,
                clampToGround: true,
                width: 2,
                material: outlineMaterial
            },
            polygon: new Cesium.PolygonGraphics({
                hierarchy: positions,
                asynchronous: false,
                material: material
            })
        };
        let entity = _this.viewer.entities.add(bData);
    };
    editPolygon(objId) {
        let _this = this;
        let oldPositions = _this.shapeDic[objId];

        //先移除entity
        _this.clearEntityById(objId);

        //进入编辑状态
        tracker.polygonDrawer.showModifyPolygon(oldPositions, function (positions) {
            _this.shapeDic[objId] = positions;
            _this.showPolygon(objId, positions);
        }, function () {
            _this.showPolygon(objId, oldPositions);
        });
    };
    editPolyline (objId) {
        let _this=this;
        let oldPositions = _this.shapeDic[objId];

        //先移除entity
        _this.clearEntityById(objId);

        //进入编辑状态
        tracker.polylineDrawer.showModifyPolyline(oldPositions, function (positions) {
            _this.shapeDic[objId] = positions;
            _this.showPolyline(objId, positions);
        }, function () {
            _this.showPolyline(objId, oldPositions);
        });
    };
    editRectangle (objId) {
        let _this=this;
        let oldPositions = _this.shapeDic[objId];

        //先移除entity
        _this.clearEntityById(objId);

        //进入编辑状态
        tracker.rectDrawer.showModifyRectangle(oldPositions, function (positions) {
            _this.shapeDic[objId] = positions;
            _this.showRectangle(objId, positions);
        }, function () {
            _this.showRectangle(objId, oldPositions);
        });
    };
    editCircle (objId) {
        let _this=this;
        let oldPositions = _this.shapeDic[objId];

        //先移除entity
        _this.clearEntityById(objId);

        //进入编辑状态
        tracker.circleDrawer.showModifyCircle(oldPositions, function (positions) {
            _this.shapeDic[objId] = positions;
            _this.showCircle(objId, positions);
        }, function () {
            _this.showCircle(objId, oldPositions);
        });
    };
    editPoint (objId) {
        let _this=this;
        let oldPosition = _this.shapeDic[objId];

        //先移除entity
        _this.clearEntityById(objId);

        //进入编辑状态
        tracker.pointDrawer.showModifyPoint(oldPosition, function (position) {
            _this.shapeDic[objId] = position;
            _this.showPoint(objId, position);
        }, function () {
            _this.showPoint(objId, oldPosition);
        });
    };
    editBufferLine (objId) {
        let _this=this;
        let old = _this.shapeDic[objId];

        //先移除entity
        _this.clearEntityById(objId);

        //进入编辑状态
        tracker.bufferLineDrawer.showModifyBufferLine(old.positions, old.radius, function (positions, radius) {
            _this.shapeDic[objId] = {
                positions: positions,
                radius: radius
            };
            _this.showBufferLine(objId, positions, radius);
        }, function () {
            _this.showBufferLine(old.positions, old.radius, old);
        });
    };
    editStraightArrow (objId) {
        let _this=this;
        let oldPositions = _this.shapeDic[objId];

        //先移除entity
        _this.clearEntityById(objId);

        //进入编辑状态
        tracker.straightArrowDrawer.showModifyStraightArrow(oldPositions, function (positions) {
            _this.shapeDic[objId] = positions;
            _this.showStraightArrow(objId, positions);
        }, function () {
            _this.showStraightArrow(objId, oldPositions);
        });
    };
    editAttackArrow (objId) {
        let _this=this;
        let old = _this.shapeDic[objId];

        //先移除entity
        _this.clearEntityById(objId);

        tracker.attackArrowDrawer.showModifyAttackArrow(old.custom, function (positions, custom) {
            //保存编辑结果
            _this.shapeDic[objId] = {
                custom: custom,
                positions: positions
            };
            _this.showAttackArrow(objId, positions);
        }, function () {
            _this.showAttackArrow(objId, old.positions);
        });
    };
    editPincerArrow (objId) {
        let _this=this;
        let old = _this.shapeDic[objId];

        //先移除entity
        _this.clearEntityById(objId);

        tracker.pincerArrowDrawer.showModifyPincerArrow(old.custom, function (positions, custom) {
            //保存编辑结果
            _this.shapeDic[objId] = {
                custom: custom,
                positions: positions
            };
            _this.showPincerArrow(objId, positions);
        }, function () {
            _this.showPincerArrow(objId, old.positions);
        });
    };
    clearEntityById (objId) {
        let _this=this;
        let entityList = _this.viewer.entities.values;
        if (entityList == null || entityList.length < 1) {
            return;
        }
        for (let i = 0; i < entityList.length; i++) {
            let entity = entityList[i];
            if (entity.layerId == layerId && entity.objId == objId) {
                _this.viewer.entities.remove(entity);
                i--;
            }
        }
    };
//endregion
}
export {Measure,DrawFigure,MilitaryPlotting};


