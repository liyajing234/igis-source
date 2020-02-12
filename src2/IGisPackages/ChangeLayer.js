import {Dom} from "./Dom.js";

const Cesium=require("cesium/Cesium");
/**
 * 切换图层
 * @param url 可不填 地图地址 不填则默认谷歌地图
 */
class ChangeLayer{
    constructor(viewer,url,classOptions) {
        let dom=new Dom();
        let changelayerdom= dom.createDom(classOptions)
        changelayerdom.onclick=this.changelayer(viewer,url);
    };
    changelayer(viewer,url){
        let _this=this;
        _this.viewer=viewer;
        let _url='http://www.google.cn/maps/vt?lyrs=s@800&x={x}&y={y}&z={z}';
        if(typeof url!="undefined"){
            _url=url;
        }
        _this.viewer.scene.imageryLayers.remove(_this.viewer.scene.imageryLayers._layers[0])
        _this.viewer.scene.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
            url: _url,
            tilingScheme: new Cesium.WebMercatorTilingScheme(),
            minimumLevel: 1,
            maximumLevel: 20
        }));
    }

}
export {ChangeLayer}
