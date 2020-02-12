import {viewer} from "./Viewer.js";
import {Cesium} from "./Unit.js"
let preTime=null;
let that=null;
class Earth{
    // constructor() {
    //     let _this = this;
    //     _this.viewer=viewer;
    //     _this.clock=viewer.clock
    //     _this.clock.Animation=true;
    //     _this.clock.multiplier=2;
    //     _this.previousTime= _this.clock.currentTime.secondsOfDay;
    // }
    static get viewer(){
        return viewer;
    };
    static get preTime(){
        return preTime;
    }
    static set preTime(_preTime){
        preTime=_preTime;
    }
    static set that(_that){
        that=_that;
    }
    /**
     * 跟时间轴关联 绕z轴自动旋转地球
     */
   static autoRotate() {
        let _this = this;
        // _this.previousTime=previousTime;
        _this.that=_this;
        _this.viewer.clock.onTick.addEventListener(_this.onTickCallback);
    };
    /**
     * 取消自动旋转 移除监听事件
     */
   static cancelAutoRotate() {
        let _this = this;
        _this.viewer.clock.onTick.removeEventListener(_this.onTickCallback);
    };
    /**
     * 设置的旋转方法，参数已默认
     */
   static onTickCallback(){
        const _this=that;
        let _spinRate = 100;
        let currentTime = _this.viewer.clock.currentTime.secondsOfDay;
        let delta = (currentTime - _this.preTime) / 1000;
        _this.preTime = currentTime;
        _this.viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, -_spinRate * delta);
    };

}
export {Earth};
