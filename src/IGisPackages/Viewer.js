import {Compass} from "./Compass.js";
import {Home} from "./Home.js"
import {Morph} from "./Morph.js";
import {Layer} from "./Layer.js";
import {CopyRight} from "./CopyRight.js";
import {PositionMessage} from "./PositionMessage.js";
import {Dom} from "./Dom.js";
import {Cesium} from "./Unit.js"
//引入天空盒图片
import posX from "../../igisimgs/Sky_Day Sun High HorizonRich_Cam_1_Right+X.png";
import negX from "../../igisimgs/Sky_Day Sun High HorizonRich_Cam_3_Left-X.png";
import negY from "../../igisimgs/Sky_Day Sun High HorizonRich_Cam_4_Top+Y.png";
import posY from "../../igisimgs/Sky_Day Sun High HorizonRich_Cam_5_Down-Y.png";
import posZ from "../../igisimgs/Sky_Day Sun High HorizonRich_Cam_0_Front+Z.png";
import negZ from "../../igisimgs/Sky_Day Sun High HorizonRich_Cam_2_Back-Z.png";
//引入组件图片
import homepng from "../../igisimgs/home.png"
import { _ } from "core-js";
let viewer={};

//region
class Viewer {
    /**
     * 初始化地球，配置组件
     * @param IGisContainer 地球容器
     * @param options{compass,home,morphview,changelayer,copyright,fps,layerurl,positionMessage}
     * @param options.compass 是否开启罗盘 默认为ture
     * @param options.home 是否创建home按钮 默认为true
     * @param options.morphview 是否创建2D/3D转换按钮 默认为true
     * @param options.changelayer 是否创建切换图层按钮 默认为true
     * @param options.copyright  是否显示版权信息 默认为true
     * @param options.fps 是否显示每秒传输帧数 默认为true
     * @param options.layerurl 底图地址 默认为谷歌地图
     * @param options.positionMessage 是否显示经纬高 默认为true
     */
    constructor(IGisContainer, options) {

        let _this = this;
        _this.sceneMode=Cesium.SceneMode.SCENE3D;
        _this.compass=true;
        _this.home=true;
        _this.morphview=true;
        _this.changelayer=true;
        _this.copyright=true;
        _this.fps=true;
        _this.positionMessage=true;
        _this.layerurl= "http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&{x}&y={y}&z={z}&s=Gali";
        _this.terrainUrl="";
        _this.enableSkyBox=true;
        _this.fullscreenButton=false;
        _this.skyBoxSources={
            positiveX: posX,
            negativeX: negX,
            positiveY: posY,
            negativeY: negY,
            positiveZ: posZ,
            negativeZ: negZ
        }
        if(typeof options!="undefined"){
            if(typeof options.layerurl!=="undefined"){
                _this.layerurl=options.layerurl;
            }
            if(typeof options.terrainUrl!=="undefined"){
                _this.terrainUrl=options.terrainUrl;
            }
            if(typeof options.enableSkyBox==="boolean"){
                _this.enableSkyBox=options.enableSkyBox;
            }
            if(typeof options.skyBoxSources!=="undefined"){
                _this.skyBoxSources=options.skyBoxSources;
            }
            if(typeof options.sceneMode!=="undefined"){
                if(options.sceneMode=="2D"){
                    _this.sceneMode=Cesium.SceneMode.SCENE2D;
                }
            }
            if(typeof options.fullscreenButton==="boolean"){
                _this.fullscreenButton=options.fullscreenButton;
            }
            if(typeof options.wmtsImageryProvider!=="undefined"){
                _this.wmtsImageryProvider=options.wmtsImageryProvider;
            }
            if(typeof options.wmsImageryProvider!=="undefined"){
                _this.wmsImageryProvider=options.wmsImageryProvider;
            }
        }
        // const mapUrl="http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&{x}&y={y}&z={z}&s=Gali";
        let map=new Cesium.UrlTemplateImageryProvider({url:_this.layerurl});
        if(_this.wmtsImageryProvider!==undefined){
            map=_this.wmtsImageryProvider;
            
        }
        else if(_this.wmsImageryProvider!==undefined){
            map=_this.wmsImageryProvider;
        }
        //初始化viewer的属性
        let _viewerOptions = {
            animation: false,
            baseLayerPicker: false,
            fullscreenButton: _this.fullscreenButton,
            geocoder: false,
            homeButton: false,
            sceneModePicker: false,
            selectionIndicator: false,
            vrButton: false,
            navigationHelpButton: false,
            infoBox: false,
            navigationInstructionsInitiallyVisible: false,
            // terrainProvider: Cesium.createWorldTerrain(),
            orderIndependentTranslucency: false,
            imageryProvider:map,
            contextOptions: {
                id: "cesiumCanvas",
                webgl: {
                    alpha: true,
                    preserveDrawingBuffer: true
                }
            },
            sceneMode:_this.sceneMode,
            shouldAnimate:true,
            // skyAtmosphere:false, //去掉地球光环
            timeline:false,
            showRenderLoops: false, //如果设为true，将在一个HTML面板中显示错误信息
        }
        if(_this.terrainUrl!==""){
            const terrain=new Cesium.CesiumTerrainProvider({url:_this.terrainUrl})
            _viewerOptions.terrainProvider=terrain;
        }
        Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(90, -20, 110, 90);
        _this.viewer = new Cesium.Viewer(IGisContainer, _viewerOptions);
        _this.viewer.cesiumWidget.creditContainer.style.display = "none";
        _this.viewer.scene.globe.depthTestAgainstTerrain = false;
        if(_this.enableSkyBox===true){
            _this.viewer.scene.skyBox = new Cesium.SkyBox({
                sources: _this.skyBoxSources
            });
        }
        _this.viewer.scene.fxaa = true;
        _this.viewer.scene.postProcessStages.fxaa.enabled = true;
        //取消双击事件
        _this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        // _this.viewer.scene.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN);
        //组件开关 组件设置了特定的类名，搜索类名如果有，则先移除后添加。
        let components=document.getElementsByClassName("ig-component");
        if(typeof components.length!=="undefined"){
            for(let i=0;i<components.length;i++){
                let component = components[i];
                var parentNode = component.parentNode;
                parentNode.removeChild(component);
            }
        }
        if (typeof options !== "undefined") {
            if (typeof options.compass === "boolean") {
                _this.compass = options.compass;
            }

            if (typeof options.home === "boolean") {
                _this.home = options.home;
            }
            if (typeof options.morphview === "boolean") {
                _this.morphview = options.morphview;
            }
            if (typeof options.changelayer === "boolean") {
                _this.changelayer = options.changelayer;
            }
            if (typeof options.copyright === "boolean") {
                _this.copyright = options.copyright;
            }
            if (typeof options.fps === "boolean") {
                _this.fps = options.fps;
            }
            if (typeof options.layerUrl !== "undefined") {
                _this.layerUrl = options.layerUrl;
            }
            if (typeof options.positionMessage === "boolean") {
                _this.positionMessage = options.positionMessage;
            }
        }
        //获取viewer容器
        let viewerContainer=document.getElementsByClassName("cesium-viewer")[0];
        const iconOptions={
            class:"ig-component",
            id:"iconContainer",
            fatherDom:viewerContainer
        }
        let iconContainer=Dom.create(iconOptions);
        if (_this.compass === true) {
            new Compass(_this.viewer);
        }
        if (_this.home === true) {
             Home.viewer=_this.viewer;
             Home.createButton({},{fatherDom:iconContainer,class:"ig-home"});
            // 使用ViewportQuad创建一个显示图片的区域
        }
        if (_this.morphview === true) {
           Morph.viewer=_this.viewer;
           Morph.createButton({fatherDom:iconContainer,class:"ig-2D"},{fatherDom:iconContainer,class:"ig-3D"});
        }
        if (_this.changelayer === true) {
            let url;
            Layer.viewer=_this.viewer;
            Layer.addButton(url,{fatherDom:iconContainer,class:"ig-changelayer"});
        }
        if (_this.copyright === true) {
            new CopyRight({fatherDom:viewerContainer});
        }
        if (_this.positionMessage === true) {

            let divoptions={
                class:"ig-latlon",
                id:"latlon_show",
                fatherDom:viewerContainer
            }
            let fatherDiv = Dom.create(divoptions);
            let lonOptions={
                // class:"ig-bottom-center",
                id:"lon_show",
                domType:"span",
                text:"经度:",
                class:"ig-lon",
                fatherDom:fatherDiv
            }
            let latOptions={
                // class:"ig-bottom-center",
                id:"lat_show",
                domType:"span",
                text:"纬度:",
                class:"ig-lat",
                fatherDom:fatherDiv
            }
            let altOptions={
                // class:"ig-bottom-center",
                id:"alt_show",
                domType:"span",
                text:"摄像机高度:",
                class:"ig-alt",
                fatherDom:fatherDiv
            }
            let elevationOptions={
                // class:"ig-bottom-center",
                id:"elevation_show",
                domType:"span",
                text:"海拔:",
                class:"ig-elevation",
                fatherDom:fatherDiv
            }


            let lon_show=Dom.create(lonOptions)

            let lat_show=Dom.create(latOptions);
            let alt_show=Dom.create(altOptions);
            let elevation_show=Dom.create(elevationOptions);
            let positionOptions={
                lon_showId:lon_show.id,
                lat_showId:lat_show.id,
                alt_showId:alt_show.id,
                elevation_showId:elevation_show.id
            }
            PositionMessage.viewer=_this.viewer;
            PositionMessage.show(positionOptions);
        }

        _this.viewer.scene.debugShowFramesPerSecond = _this.fps;
        let imageryProvider = new Cesium.UrlTemplateImageryProvider({url: _this.layerurl});
        _this.viewer.imageProvider = imageryProvider;
        viewer=_this.viewer
        return _this.viewer;
    }
}
//endregion



export {Viewer,viewer};
