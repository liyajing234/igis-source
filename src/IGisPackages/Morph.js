import {Dom} from "./Dom.js";
// require("cesium/Widgets/widgets.css");
import {Cesium} from "./Unit.js";
import twoD from "../../igisimgs/2d.png";
import threeD from "../../igisimgs/3d.png";
// import {viewer} from "./Viewer.js";
let viewer=null;
class Morph {
    /**
     * 二三维切换
     * @param viewer
     */
    constructor(viewer) {
    }
    static get viewer(){
        return viewer;
    }
    static set viewer(_viewer){
        viewer=_viewer;
    }
    /**
     * 创建简单的2D 3D按钮，实现二三维切换
     * @param classOptions2D
     * @param classOptions3D
     */
    static createButton(classOptions2D,classOptions3D){
        let _this=this;
        classOptions2D.iconUrl=twoD;
        let dom2D=Dom.create(classOptions2D);
        classOptions3D.iconUrl=threeD;
        let dom3D=Dom.create(classOptions3D);
        dom2D.onclick=function (){
            _this.to2D();
        }
        dom3D.onclick=function (){
            _this.to3D();
        }
    }

    /**
     * 转2D视图
     */
   static to2D(){
        let _this=this;
        if(viewer==null){
            console.log("viewer无定义，可以尝试IGis.Morph.viewer=viewer先赋值");
        }else {
            console.log(_this.viewer)
            //参数 duration，切换成2D过渡动画的时间，如果设置成0，则无动画，坐标位置保持原来的。
            _this.viewer.scene.morphTo2D(0);
        }

    };
    /**
     * 转3D视图
     */
   static to3D(){
        let _this=this;
        if(viewer==null){
            console.log("viewer无定义，可以尝试IGis.Morph.viewer=viewer先赋值");
        }else {_this.viewer.scene.morphTo3D(0);}
    };
}
export {Morph}