import {tools} from "../tools.js";
import {viewer} from "./Viewer.js";
const Cesium=require("cesium/Cesium");
class DomRenderer {
    constructor() {
       this.enableDomRender=false;
    }


    //region 同步浮框（图表） 渲染位置功能
    //打开浮框渲染
    openDomRender(dictionary,elementId) {
        this.dictionary=dictionary;
        this.elementId=elementId;
        this.enableDomRender=true;
        this.openLoop();
    };
    //关闭浮框渲染
    closeDomRender() {
        this.enableDomRender=false;
        this.closeLoop();
        this.dictionary=new Array();
        this.elementId=null;
    };
    //动态渲染浮框 dictionary为 elementId和三维position的键值对组(array)
    rendererDom() {
        var _this=this;
       
        var elementId=_this.elementId;
        var dictionary=_this.dictionary;
        for(var key in dictionary){
            var dom=document.getElementById(key);
            var cartesian3=dictionary[key];
            //三维坐标转屏幕坐标
            var position=tools.worldCoordinateToPosition(viewer.scene,cartesian3);

            if(position!=undefined){
                dom.style.left=position.x+"px";
                dom.style.top=position.y+"px";
            }
            if(elementId==undefined){
                dom.style.display="";
            }else {
                if(key==elementId){
                    dom.style.display="";
                }else {
                    dom.style.display="none";
                }
            }
        }
    };
    //手动渲染 需关闭自动渲染
    openLoop(){
        console.log("进入手动渲染模式");
        viewer.useDefaultRenderLoop=false;
        this.loop();
    };
    closeLoop(){
        console.log("进入自动渲染模式");
        viewer.useDefaultRenderLoop=true;
    };
    loop () {
        var _this=this;
        viewer.render();
        if(_this.enableDomRender==true){
            console.log("动态渲染dom中")
            _this.rendererDom();
        }
        requestAnimationFrame(_this.loop.bind(_this));
    };
}
export {DomRenderer};