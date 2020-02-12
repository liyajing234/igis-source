//趋势演变
import {tools} from "../tools.js";
import {viewer} from "./Viewer.js";
const Cesium=require("cesium/Cesium");
class TrendEvolution{
    constructor() {
        let _this=this;
        _this.riskEntityList=[];

    };

    /**
     *内部调用
     * @param position 数组 经纬度
     * @param spreadRadius
     * @param angle
     */
    riskArea(position, spreadRadius, angle) {
        let _this=this;
        let lon = position.lng || position[0]
        let lat = position.lat || position[1]
        let riskEntity= viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(lon, lat),
            name: 'TrendArea',
            ellipse: {
                semiMinorAxis: spreadRadius.min,
                semiMajorAxis: spreadRadius.max,
                material: Cesium.Color.RED.withAlpha(0.5),
                rotation: Cesium.Math.toRadians(-angle)
            },
        });
        _this.riskEntityList.push(riskEntity);
        return riskEntity;
    };
    /**
     *外部调用 绘制椭圆形演变区域
     * @param position 经纬度 数组 必填
     * @param  spreadRadius 必填 数组
     * @param brng  可不填 默认为10
     * @param angle  可不填 默认为280
     * @param sceonds 可不填 默认为1
     */
    drawEllipseRiskArea(position, spreadRadius, brng, angle, sceonds) {
        let _this = this;
        let _brng=10;
        let _angle=280;
        let _sceonds=1;
        let lon = position.lng || position[0];
        let lat = position.lat || position[1];
        if(brng!=undefined){
            if(typeof(brng)=="number"){
                _brng=brng;
            }
        }
        if(angle!=undefined){
            if(typeof(angle)=="number"){
                _angle=angle;
            }
        }
        if(sceonds!=undefined){
            if(typeof(sceonds)=="number"){
                _sceonds=sceonds;
            }
        }
        for (let i = 0; i < spreadRadius.length; i++) {

            let j = 0;
            setTimeout(function () {
                let posi = tools.computerThatLonLat(lon, lat, _brng, spreadRadius[j].max);
                _this.riskArea(posi, spreadRadius[j++], _angle);
            }, i * _sceonds * 1000)
        }
    };
    /**
     *外部调用 绘制圆形演变区域
     * @param position 经纬度 数组 必填
     * @param spreadRadius 必填 数组
     * @param angle 可不填 默认为280
     * @param sceonds 可不填 默认为1
     */
    drawCircleRiskArea(position, spreadRadius, angle, sceonds) {
        let _this=this;
        let _angle=280;
        let _sceonds=1;

        let lon = position.lng || position[0];
        let lat = position.lat || position[1];
        if(angle!=undefined){
            if(typeof(angle)=="number"){
                _angle=angle;
            }
        }
        if(sceonds!=undefined){
            if(typeof(sceonds)=="number"){
                _sceonds=sceonds;
            }
        }

        for (let i = 0; i < spreadRadius.length; i++) {

            let j = 0;
            setTimeout(function () {
                _this.riskArea([lon, lat], spreadRadius[j++], _angle)
            }, i * _sceonds * 1000);
        }
    };
//有bug 待测
    stopRiskArea(){
        if(this.riskAreaTimeout!=null){
            clearTimeout(this.riskAreaTimeout);
            this.riskAreaTimeout=null;
        };

    };
    /**
     * 删除演变区域
     * @param riskArea 要删除的entity，若不传参，则删除所有AreaEntity
     */
    deleteRiskArea(riskArea) {
        let _this=this;
        if(_this.riskEntityList.length>0){
            for(let i=0;i<_this.riskEntityList.length;i++){
                if(riskArea==undefined){
                    viewer.entities.remove(_this.riskEntityList[i]);
                }
                else {
                    if(_this.riskEntityList[i]==riskArea){
                        viewer.entities.remove(_this.riskEntityList[i]);
                    }
                }
            }
        };
    };
};

class DangerDetection {
    constructor() {
        let _this=this;
         _this.scanList=[];
    };

    /**
     * 添加扫描面
     * @param center 必填 扫描面中心点 数组 经纬度
     * @param radius 可不填 扫描面半径 米 默认1500
     * @param scanColor 可不填 扫描面颜色 数组[r,g,b,a] 默认 [1,0,0,1]
     * @param duration
     */
    addScan(center, radius, scanColor, duration) {
        let _this=this;
        let lon=center.lng||center[0];
        let lat=center.lat||center[1];
        let _radius=1500;
        let _scanColor=new Cesium.Color(1.0, 0.0, 0.0, 1);
        let _duration=4000;
        if(radius!=undefined){
            if(typeof(radius)=="number"){
                _radius=radius;
            }
        }
        if(typeof scanColor!="undefined"){
            _scanColor=scanColor;
        }
        if(duration!=undefined){
            if(typeof(radius)=="number"){
                _duration=duration;
            }
        }

        viewer.scene.globe.depthTestAgainstTerrain = true;
        let CartographicCenter = new Cesium.Cartographic(Cesium.Math.toRadians(lon), Cesium.Math.toRadians(lat), 0);
        let scan= tools.AddRadarScanPostStage(viewer, CartographicCenter, _radius, _scanColor, _duration);
        _this.scanList.push(scan);
    };
    /**
     * 清除扫描面 并以标签的形式展示扫描结果
     * @param pointList 数组 键值对 [{name:"",position:[lon,lat]}] 要展示的扫描结果
     * @param scan
     */
    deleteScan(pointList,scan) {
        let _this=this;
        if(typeof scan=="undefined"){
            viewer.scene.postProcessStages.removeAll();
        }else {
            viewer.scene.postProcessStages.remove(scan);
        }
        pointList.forEach(function (item) {
            let tag=viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(item.position[0], item.position[1], 100),
                point: {
                    color: Cesium.Color.RED, //点位颜色
                    pixelSize: 5 //像素点大小
                },
                name: 'radarPoint',
                label: {
                    text: item.name,
                    font: '14pt Source Han Sans CN', //字体样式
                    fillColor: Cesium.Color.BLACK, //字体颜色
                    backgroundColor: Cesium.Color.AQUA, //背景颜色
                    showBackground: true, //是否显示背景颜色
                    style: Cesium.LabelStyle.FILL, //label样式
                    outlineWidth: 2,
                    verticalOrigin: Cesium.VerticalOrigin.CENTER, //垂直位置
                    horizontalOrigin: Cesium.HorizontalOrigin.LEFT, //水平位置
                    pixelOffset: new Cesium.Cartesian2(10, 0) //偏移
                }
            });
            _this.scanTagList.push(tag);
        })
    };
    /**
     * 清楚扫描面标签
     * @param tag 可不填 若填写 则清除特定的标签 若不填写 则清除所有标签
     */
    clearScanTags(tag) {
        let _this=this;
        if(_this.scanTagList.length>0){
            for(let i=0;i<_this.scanTagList.length;i++){
                let scanTag=_this.scanTagList[i];
                if(tag==undefined){
                    viewer.entities.remove(scanTag);
                }else {
                    if(scanTag==tag){
                        viewer.entities.remove(scanTag);
                    }
                }

            }
        }
    };
};

export {TrendEvolution,DangerDetection}