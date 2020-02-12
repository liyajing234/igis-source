import {Dom} from "./Dom.js";
import {Cesium} from "./Unit.js"
import layer from "../../igisimgs/layer.png"
/**
 * 切换图层
 * @param url 可不填 地图地址 不填则默认谷歌地图
 */
let viewer=null;
class Layer {
    constructor (viewer,url) {
        const map = new Cesium.UrlTemplateImageryProvider({url:url});
        this.viewer=viewer;
        return map;
    }
    static get viewer(){
        return viewer;
    }
    static set viewer(viewer0){
        viewer=viewer0;
    }
    static change(url){
        let _this=this;
        let _url='http://www.google.cn/maps/vt?lyrs=s@800&x={x}&y={y}&z={z}';
        if(typeof url!=="undefined"){
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
    static addButton(url,classOptions){
        let _this=this;
        classOptions.iconUrl=layer;
        let changelayerdom= Dom.create(classOptions)
        changelayerdom.onclick=function (){
            _this.change(url);
        }
    }
}
export {Layer}
