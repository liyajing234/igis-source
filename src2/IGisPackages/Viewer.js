import {Compass} from "./Compass.js";
import {Home} from "./Home.js"
import {Morph} from "./Morph.js";
import {ChangeLayer} from "./ChangeLayer.js";
import {CopyRight} from "./CopyRight.js";
import {PositionMessage} from "./PositionMessage.js";
import {Dom} from "./Dom.js";

const Cesium = require("cesium/Cesium");
require("cesium/Widgets/widgets.css");
Cesium.Ion.defaultAccessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkZjc1OThjZS05ZDVhLTQyNDEtODRjOS04MTc5YjhlZTY0Y2EiLCJpZCI6MTMxMzQsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NjI2NjE3ODd9.6QqvBgaQgtYPFdxVBJqes-nqpxHyfKKHW_YC8s1TEJg";

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
        //初始化viewer的属性
        let _viewerOptions = {
            animation: false,
            baseLayerPicker: false,
            fullscreenButton: false,
            geocoder: true,
            homeButton: false,
            sceneModePicker: false,
            selectionIndicator: false,
            timeline: true,
            vrButton: false,
            navigationHelpButton: false,
            infoBox: false,
            navigationInstructionsInitiallyVisible: false,
            // terrainProvider: Cesium.createWorldTerrain(),
            orderIndependentTranslucency: false,
            contextOptions: {
                id: "cesiumCanvas",
                webgl: {
                    alpha: true,
                    preserveDrawingBuffer: true
                }
            },
            // skyAtmosphere:false, //去掉地球光环
            showRenderLoops: false, //如果设为true，将在一个HTML面板中显示错误信息
        }
        _this.viewer = new Cesium.Viewer(IGisContainer, _viewerOptions);
        //组件开关
        let _options = {
            compass: true,    // 罗盘
            home: true,    // home按钮 重置视角
            morphview: true,    // 2D 3D 切换按钮
            changelayer: true,    // 图层切换按钮
            copyright: true,    // 版权标识
            fps: true,    // 每秒传输帧数
            layerurl: "http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&{x}&y={y}&z={z}&s=Gali",
            positionMessage: true    // 经纬高
        };
        if (typeof options !== "undefined") {
            if (typeof options.compass === "boolean") {
                _options.compass = options.compass;
            }
            if (typeof options.home === "boolean") {
                options.home = options.home;
            }
            if (typeof options.morphview === "boolean") {
                _options.morphview = options.morphview;
            }
            if (typeof options.changelayer === "boolean") {
                _options.changelayer = options.changelayer;
            }
            if (typeof options.copyright === "boolean") {
                _options.copyright = options.copyright;
            }
            if (typeof options.fps === "boolean") {
                _options.fps = options.fps;
            }
            if (typeof options.layerUrl !== "undefined") {
                _options.layerUrl = options.layerUrl;
            }
            if (typeof options.positionMessage === "boolean") {
                _options.positionMessage = options.positionMessage;
            }
        }

        if (_options.compass === true) {
            new Compass(_this.viewer);
        }
        if (_options.home === true) {
            new Home(_this.viewer)
        }
        if (_options.morphview === true) {
            new Morph(_this.viewer)
        }
        if (_options.changelayer === true) {
            new ChangeLayer(_this.viewer);
        }
        if (_options.copyright === true) {
            new CopyRight();
        }
        if (_options.positionMessage === true) {
            let dom = new Dom();
            let divoptions = {
                class: "ig-bottom-center",
                id: "latlon_show"
            }
            let fatherDiv = dom.createDom(divoptions);
            let lonOptions = {
                class: "ig-bottom-center",
                id: "lon_show",
                domType: "span",
                fatherDom: fatherDiv
            }
            let latOptions = {
                class: "ig-bottom-center",
                id: "lat_show",
                domType: "span",
                fatherDom: fatherDiv
            }
            let altOptions = {
                class: "ig-bottom-center",
                id: "alt_show",
                domType: "span",
                fatherDom: fatherDiv
            }
            let elevationOptions = {
                class: "ig-bottom-center",
                id: "elevation_show",
                domType: "span",
                fatherDom: fatherDiv
            }


            let lon_show = dom.createDom(lonOptions)

            let lat_show = dom.createDom(latOptions);
            let alt_show = dom.createDom(altOptions);
            let elevation_show = dom.createDom(elevationOptions);
            let positionOptions = {
                lon_showId: lon_show.id,
                lat_showId: lat_show.id,
                alt_showId: alt_show.id,
                elevation_showId: elevation_show.id
            }
            new PositionMessage(_this.viewer, positionOptions);
        }

        _this.viewer.scene.debugShowFramesPerSecond = _options.fps;
        let imageryProvider = new Cesium.UrlTemplateImageryProvider({url: _options.layerurl});
        _this.viewer.imageProvider = imageryProvider;
    }

}
const viewer = Viewer.prototype.viewer;
export {Viewer,viewer};

