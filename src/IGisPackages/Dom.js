import echarts from 'echarts';
import {DomRenderer} from "./DomRenderer.js";
import {Cartesian3} from "./CommonTypes.js"
let fousDoms=[];
let Dictionary=new Array();
class Dom {

    static get FousDom(){
        return fousDoms;
    }
    static set FousDom(footer0){
        fousDoms.push(footer0);
    }
    /**
     * 创建dom
     * @param options{id,domType,fatherDom,iconUrl,class,click}
     * @param options.id 所创建dom的Id
     * @param options.domType 所创建dom的类型
     * @param options.fatherDom 所创建dom的父级dom
     * @param options.iconUrl 创建dom所需要的图标地址
     * @param options.class 创建dom的样式类名
     * @returns {HTMLElement} 返回所创建的dom
     */
    static create(options){
        let _options = {
            domType:"div",
            fatherDom:document.body,
        }

        let myDom;
        if (typeof options !== "undefined") {
            if(typeof options.domType!=="undefined"){
                _options.domType=options.domType;
            }
            if (typeof options.id !== "undefined") {
                _options.id=options.id

            }
            if (typeof options.fatherDom!=="undefined"){
                _options.fatherDom=options.fatherDom;
            }
            if (typeof options.iconUrl !== "undefined") {
                _options.iconUrl = options.iconUrl;
            }
            if (typeof options.class != "undefined") {
                _options.class = options.class;
            }
            if (typeof options.text != "undefined") {
                _options.text = options.text;
            }
        }


        if(typeof _options.id!=="undefined"){
            let div=document.getElementById(_options.id);
            if(typeof div!=="undefined"&&div!==null){
                myDom=div;
            }else {
                if(typeof _options.domType!=="undefined"){
                    myDom=document.createElement(_options.domType);
                    myDom.id=_options.id;
                }
            }
        }else {
            myDom = document.createElement(_options.domType);
        }
        if(typeof _options.fatherDom!=="undefined"&&_options.fatherDom!==null){
            _options.fatherDom.appendChild(myDom);
        }
        if(typeof _options.class!=="undefined"){
            myDom.classList.add(_options.class)
        }
        if(typeof _options.iconUrl!=="undefined"){
            let img = document.createElement("img");
            img.src = _options.iconUrl;
            myDom.appendChild(img);
        }
        if(typeof _options.text!=="undefined"){
           let span=document.createElement("span");
           span.innerHTML=_options.text;
           myDom.appendChild(span)
        }
        return myDom;
    };

    /**
     * 创建echarts图表
     * @param dataOption object 指定图表的配置项和数据
     * @param options
     * @param options.id string 配置图表的Id
     * @param options.class string 配置图表的样式类名
     * @param options.fatherDom {HTMLElement} document.body 图表的父级dom
     * @returns {*} 创建的图表
     */
    static createChartBox (dataOption,options,position) {
        let _this=this;
        if(DomRenderer.currentState==false){
            DomRenderer.open();
        }

        let viewerContainer=document.getElementsByClassName("cesium-viewer")[0];
        let _options={
            class:'ig-echarts',
            fatherDom:viewerContainer,
            show:true,
            offset:[25,100]
        };
        if(typeof dataOption==="undefined"){
            throw "dataOption数据无定义";
        }
        if(typeof options!=="undefined"){
            if(typeof options.id!=="undefined"){
                _options.id=options.id;
            }
            if(typeof options.class!=="undefined"){
                _options.class=options.class;
            }
            if(typeof options.show==="boolean"){
                _options.show=options.show;
            }
            if(typeof options.fatherDom!=="undefined"||options.fatherDom!==null){
                _options.fatherDom=options.fatherDom;
            }
            if(typeof options.offset!=="undefined"){
                _options.offset=options.offset;
            }
        }

        let chartbox=document.createElement("div");
        chartbox.classList.add(_options.class);
        chartbox.id=_options.id;
        viewerContainer.appendChild(chartbox);

        let myChart = echarts.init(chartbox);
        // 指定图表的配置项和数据
        myChart.setOption(dataOption);
        let lon=position.longitude||position.lon||position[0]||position.x;
        let lat=position.latitude||position.lat||position[1]||position.y;
        let height=position.height||position.alt||position[2]||position.z||0;
        let obj={
            id:chartbox.id,
            position:Cartesian3.fromDegrees(lon,lat,height),
            offset:_options.offset
        }
        DomRenderer.dictionary=obj;

        return myChart;
    };

    /**
     * 创建弹窗
     * @param options 弹窗的一些属性
     * @param position 三维坐标 经纬度
     * @param options.fatherDom {HTMLElement} document.body 弹窗的父级元素，如果不填，则默认为document.body。
     * @param options.title string 弹窗的标题元素
     * @param options.content string 弹窗的内容元素
     * @param options.actions [{ title,id,imageUrl}] 弹窗底部的按钮元素
     * @param title string 底部按钮显示的文字
     * @param id string 底部按钮的ID
     * @param imageUrl string 底部按钮使用的图片
     *
     */

    static createMapPopup(options,position){
        if(DomRenderer.currentState==false){
            DomRenderer.open();
        }
        let viewerContainer=document.getElementsByClassName("cesium-viewer")[0];
        let _options={
            fatherDom:viewerContainer,
            show:true,
            title:"",
            content:"",
            actions:[{
                title: "",
                type:"",
                imageUrl:""
            }]
        };
        if(typeof options!=="undefined"){
            if(typeof options.fatherDom!=="undefined"){
                _options.fatherDom=options.fatherDom;
            }
            if(typeof options.title!=="undefined"){
                _options.title=options.title;
            }
            if(typeof options.content!=="undefined"){
                _options.content=options.content;
            }
            if(typeof options.show==="boolean"){
                _options.show=options.show;
            }
            if(typeof options.id!=="undefined"){
                let popup=document.getElementById(options.id);
                if(popup!==undefined&&popup!==null){
                    return ;
                }
                _options.id=options.id;
            }else {
                _options.id=this.genID(6);   //生成随机唯一ID
            }
            if(typeof options.actions!=="undefined"){
                _options.actions=options.actions;
            }
            if(typeof options.offset!=="undefined"){
                _options.offset=options.offset;
            }
            if(typeof options.classname!=="undefined"){
                _options.classname=options.classname;
            }
        }

        let popup=document.createElement("div");
        popup.classList.add("ig-popup");
        popup.innerHTML=
            '            <div class="ig-popup-header">\n' +
            '            <div class="ig-popup-header-title"></div>\n' +
            '            <div class="ig-popup-header-close"></div>\n' +
            '            </div>\n' +
            '            <div  class="ig-popup-body">\n' +
            '\n' +
            '            </div>\n' +
            '            <div class="ig-popup-footer">\n' +
            '\n' +
            '            </div>\n' +
            '            <div class="ig-popup-inner"> \n' +
            '\n' +
            '            </div>'
        let _this=this;
        if(typeof _options.id!=="undefined"){
            popup.id=_options.id;
        }
        if(_options.show==true){
            popup.style.display="";
        }else {
            popup.style.display="none"
        }
        if(_options.classname!==undefined){
            popup.classList.add(_options.classname);
        }


        let titleDoms=popup.getElementsByClassName("ig-popup-header-title");
        let titleDom=titleDoms[0];
        let bodyDoms=popup.getElementsByClassName("ig-popup-body");
        let bodyDom=bodyDoms[0];
        let footerDoms=popup.getElementsByClassName("ig-popup-footer");
        let footerDom=footerDoms[0];
        titleDom.innerHTML=_options.title;
        bodyDom.innerHTML=_options.content;

        if(_options.actions.length>0){
            for(let i=0;i<_options.actions.length;i++){
                let action=_options.actions[i];
                const footdiv=document.createElement("div");
                if(typeof action.image!=="undefined"){
                    let img=document.createElement("img");
                    img.src=action.imageUrl;
                    footdiv.appendChild(img);
                    img.setAttribute('type',action.type);
                }
                if(typeof action.title!=="undefined"){
                    let span=document.createElement("span");
                    span.classList.add("ig-popup-footer-span");
                    span.innerHTML=action.title;
                    footdiv.appendChild(span);
                    span.setAttribute('type',action.type)
                }
                if(typeof action.type!=="undefined"){
                    footdiv.setAttribute('type',action.type)
                }
                footdiv.classList.add("ig-popup-footer-div");
                _this.FousDom=footdiv;
              footerDom.appendChild(footdiv);
            }
        }

        popup.setAttribute('domtype','popup');

        _options.fatherDom.appendChild(popup);
        let lon=position.longitude||position.lon||position[0]||position.x;
        let lat=position.latitude||position.lat||position[1]||position.y;
        let height=position.height||position.alt||position[2]||position.z||0;
        let obj={
            id:popup.id,
            position:Cartesian3.fromDegrees(lon,lat,height)
        }
        if(_options.offset!==undefined){
            obj.offset=_options.offset;
        }
        DomRenderer.dictionary=obj;

        let closes=document.getElementsByClassName("ig-popup-header-close");
        let close=closes[closes.length-1];
        close.addEventListener("click",function () {
            _this.removeDom(popup.id);
        })
        return popup;
    };
    /**
     * 监听鼠标点击事件方法，可监听弹窗的底部点击，返回点击按钮的ID。
     * @param actiontype 鼠标操作类型，有"click"，"mouseover"。
     * @param fn  回调函数，返回值是dom元素的Id。
     */

    static on(actiontype, fn){
        const fousOns=this.FousDom;
        if(fousOns!=null&&fousOns.length>0){
            for(let i=0;i<fousOns.length;i++){
                const fousOn=fousOns[i]
                fousOn.addEventListener(actiontype, function (event) {
                    let type=event.target.getAttribute("type");
                    if(type!==null){
                        const obj={
                            type:type,
                            target:event.target
                        }

                        fn(obj);
                    }

                })
            }

        }

    }

    static removeDom(popupID){
        if(popupID!==undefined&&popupID!==null){
            const popup=document.getElementById(popupID);
            if(popup!==null&&typeof popup!=="undefined"){
                popup.parentNode.removeChild(popup);
                DomRenderer.remove(popupID);
            }
        }
    }
    static genID(length){
        return Number(Math.random().toString().substr(3,length) + Date.now()).toString(36);
    }
}
export {Dom};