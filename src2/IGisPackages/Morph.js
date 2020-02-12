import {Dom} from "./Dom.js";

const Cesium=require("cesium/Cesium");
class Morph {
    /**
     * 创建简单的2D 3D按钮，实现二三维切换
     * @param viewer
     * @param classOptions2D
     * @param classOptions3D
     */
    constructor(viewer,classOptions2D,classOptions3D) {
        let _this=this;
        _this.viewer=viewer;
        let dom2= new Dom();
        let dom2D=dom2.createDom(classOptions2D);
        let dom3=new Dom();
        let dom3D=dom3.createDom(classOptions3D);
        dom2D.onclick=_this.morphTo2D();
        dom3D.onclick=_this.morphTo3D();
    }
    morphTo2D(){
        _this.viewer.scene.morphTo2D(1);
    };
    /**
     * 转3D视图
     */
    morphTo3D(){

        _this.viewer.scene.morphTo3D(1);
    };
}
export {Morph}