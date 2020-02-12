import {tools} from "./tools.js";
import {viewer} from "./Viewer.js";
import {Cesium} from "./Unit.js"
let EnableDomRender = false;
let Dictionary=new Array();
let ElementId=null;
let ElementIdList=[];
let CurrentState=false;
class DomRenderer {
    static get viewer(){
        return viewer;
    }
    static get domRender(){
        return EnableDomRender;
    }
    static set domRender(enable){
        EnableDomRender=enable;
    }
    static get dictionary(){
        return Dictionary;
    }
    static set dictionary(obj){
        let id=obj.id;
        let position=obj.position;
        let offset=obj.offset;
        Dictionary[id]={
            position:position,
            offset:offset
        };
    }
    static get elementId(){
        return ElementId;
    }
    static set elementId(_elementId){
        ElementId=_elementId;
    }
    static get elementIdList(){
        return ElementIdList;
    }
    static set elementIdList(_elementIdList){
        ElementIdList=_elementIdList;
    }

    static get currentState(){
        return CurrentState;
    }
    static set currentState(_currentState){
        CurrentState=_currentState;
    }

    //region 同步浮框（图表） 渲染位置功能
    //打开浮框渲染
    static open() {
        if(this.currentState==true){

        }else {
            this.domRender=true;

            this.openLoop();

            this.currentState=true
        }


    };
    //关闭浮框渲染
    static close() {
        if(this.currentState==true){
            this.domRender=false;
            this.closeLoop();
            for(var key in this.dictionary) {
                var dom = document.getElementById(key);
                dom.style.display="none";
            }
            // this.dictionary=new Array();
            // this.elementId=null;
            // this.elementIdList=[];
            this.currentState=false;
        }

    };
    //动态渲染浮框 dictionary为 elementId和三维position的键值对组(array)
    static rendererDom() {
        var _this=this;

        var elementId=_this.elementId;
        var elementIdList=_this.elementIdList
        var dictionary=_this.dictionary;

        if(dictionary!==null&&dictionary!=undefined)
        {
            for(var key in dictionary){
                var dom=document.getElementById(key);
                if(dom!==null&&dom!==undefined)
                {
                    var cartesian3=dictionary[key].position;
                    var res = false;
                    var e = cartesian3,
                        f = viewer.scene.camera.position,
                        g = viewer.scene.globe.ellipsoid.cartesianToCartographic(f).height;
                    if (!(g += 1 * viewer.scene.globe.ellipsoid.maximumRadius, Cesium.Cartesian3.distance(f, e) > g*4/5)) {
                        res = true;
                    }
                    //三维坐标转屏幕坐标
                    var position=Cesium.SceneTransforms.wgs84ToWindowCoordinates(_this.viewer.scene,cartesian3);

                    if(position!=undefined){

                        var offset=dictionary[key].offset;
                        if(offset!==undefined){
                            dom.style.left=position.x-offset[0]+"px";
                            dom.style.top=position.y-offset[1]+"px";
                        }else {
                            //                             //获取元素宽高
                            let offsetWidth=dom.offsetWidth;
                            let offsetHeight=dom.offsetHeight;
                            let offsetLeft=dom.offsetLeft;
                            let offsetTop=dom.offsetTop;
                            if(offsetTop<offsetHeight){

                            }else{

                            }
                            dom.style.left=position.x-offsetWidth/2+"px";
                            dom.style.top=position.y-offsetHeight+"px";
                        }
                    }
                    if(res){
                        dom.style.visibility="visible";
                    }else {
                        dom.style.visibility="hidden";
                    }

                    // if(elementIdList!==undefined&&elementIdList!==null&&elementIdList.length>0){
                    //
                    //     dom.style.display="none";
                    //     for(var j=0;j<elementIdList.length;j++){
                    //         if(key==elementIdList[j]){
                    //             if(res){
                    //                 dom.style.display="";
                    //             }
                    //         }
                    //     }
                    // }
                    // else if(elementId!==undefined&&elementId!==null){
                    //     if(key==elementId){
                    //         if(res){
                    //             dom.style.display="";
                    //         }else {
                    //             dom.style.display="none";
                    //         }
                    //
                    //     }else {
                    //         dom.style.display="none";
                    //     }
                    // }
                    // else {
                    //
                    //     if(res){
                    //         dom.style.display="";
                    //
                    //     }else {
                    //         dom.style.display="none";
                    //         // dom.style.display="";
                    //     }
                    // }
                }
            }
        }

    };
    //手动渲染 需关闭自动渲染
    static openLoop(){
        // console.log("进入手动渲染模式");
        viewer.useDefaultRenderLoop=false;
        this.loop();
    };
    static closeLoop(){
        // console.log("进入自动渲染模式");
        viewer.useDefaultRenderLoop=true;
    };
    static loop () {
        const _this=this;
        viewer.render();
        if(_this.domRender==true){
            // console.log("动态渲染dom中")
            _this.rendererDom();
        }
        requestAnimationFrame(_this.loop.bind(_this));
    };

    static update(popupId,show){
        if(popupId!==undefined&&popupId!==null){
            const popup=document.getElementById(popupId);
            if(popup!==undefined&&popup!==null){
                if(typeof show==="boolean"){
                    if(show===true){
                        popup.style.display="";
                    }else {
                        popup.style.display="none";
                    }
                }
            }
        }


        // if(typeof param=="undefined"||param==null){
        //     this.elementIdList=[];
        //     this.elementId=null;
        // }
        // else if(Object.prototype.toString.call(param)== '[object Array]')   //如果是数组
        // {
        //     this.elementIdList=param;
        //     this.elementId=null;
        // }else {
        //     this.elementId=param;
        //     this.elementIdList=[];
        // }

    }

    static remove (popupId) {
        if (popupId !== undefined && popupId !== null) {
            if (this.dictionary !== undefined && this.dictionary !== null) {
                if (this.dictionary.length > 0) {
                    delete(this.dictionary[popupId]);
                }
            }
        }


    }

}
export {DomRenderer};