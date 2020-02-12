import {viewer} from "./Viewer.js";
import {Cesium} from "./Unit.js";
import {Point,Billboard} from "./Tags.js";
let markList=[];
let handler0=null;
class Mark {
    static get viewer(){
        return viewer;
    }
    static get handler(){
        return  handler0;
    }
    static set handler(viewer){
        handler0= new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    }
    static get MarkList(){
        return markList;
    }
    static set MarkList(mark){
        markList.push(mark);
    }
    static add(pointOptions, billboardOptions, markOptions){
        const viewer = this.viewer;
        this.handler=viewer;
        const handler=this.handler;

        const _this=this;
        const _markOptions = {};
        if (typeof markOptions !== "undefined") {
            if (typeof markOptions.id !== "undefined") {
                _markOptions.id = markOptions.id;
            }
            if (typeof markOptions.name !== "undefined") {
                _markOptions.name = markOptions.name;
            }
        }
        let point = new Point(pointOptions);
        let billboard = new Billboard(billboardOptions);
        handler.setInputAction(function (movement) {
            const cartesian = viewer.scene.pickPosition(movement.position);
            // 地图坐标（弧度） 转 十进制度数 toFixed保留小数点后几位
            let cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
            console.log(cartographic.height);
            //添加billboard图标
            if (cartographic.height >= 0) {
                let mark = viewer.entities.add({
                    position: cartesian,
                    point: point,
                    billboard: billboard
                });
                _this.MarkList=mark;
                if (typeof _markOptions.id !== "undefined") {
                    mark.id = _markOptions.id;
                }
                if (typeof _markOptions.name !== "undefined") {
                    mark.name = _markOptions.name;
                }
            }

        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
    static cancel(){
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
    static delete(){
        const _this = this;
        const handler=_this.handler;
        const viewer=this.viewer;
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        handler.setInputAction(function (movement) {
                const picked =viewer.scene.pick(movement.position);

                if (Cesium.defined(picked)) {
                    if (Cesium.defined(picked.id)) {
                        viewer.entities.remove(picked.id);
                    }
                }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
    static deleteAll(){
        const _this=this;

        if(_this.MarkList.length>0){
            for(let i=0;i<_this.MarkList.length;i++){
                const mark=_this.MarkList[i];
                _this.viewer.entities.remove(mark);
            }
        }
    }
}

export {Mark};