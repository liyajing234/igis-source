//趋势演变
import {tools} from "./tools.js";
import {viewer} from "./Viewer.js";
import {Cesium} from "./Unit.js";
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

export {TrendEvolution}