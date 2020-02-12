import {viewer} from "./Viewer.js";
const Cesium=require("cesium/Cesium");

class EarthRotate{
    constructor() {
        let _this = this;
        viewer.clock.Animation=true;
        viewer.clock.multiplier=2;
        _this.previousTime= viewer.clock.currentTime.secondsOfDay;
    }
    /**
     * 跟时间轴关联 绕z轴自动旋转地球
     */
    autoRotate() {
        let _this = this;
        // _this.previousTime=previousTime;
        viewer.clock.onTick.addEventListener(_this.onTickCallback);
    };
    /**
     * 取消自动旋转 移除监听事件
     */
    cancelAutoRotate() {
        let _this = this;
        viewer.clock.onTick.removeEventListener(_this.onTickCallback);
    };
    /**
     * 设置的旋转方法，参数已默认
     */
    onTickCallback(){
        let _this=this;
        // _this.previousTime= viewer.clock.currentTime.secondsOfDay;
        let previousTime=_this.previousTime;
        let _spinRate = 100;
        let currentTime = viewer.clock.currentTime.secondsOfDay;
        let delta = (currentTime - _this.previousTime) / 1000;
        _this.previousTime = currentTime;
        viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, -_spinRate * delta);
    };

}
export {EarthRotate};
