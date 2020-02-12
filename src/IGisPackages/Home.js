import {Cesium} from "./Unit.js"
import {Dom} from "./Dom.js";
import home from "../../igisimgs/home.png";
let viewer=null;
class Home {
    /**
     * 创建home按钮 并添加方法
     * @param viewer
     * @param options{position{lon,lat,alt},orientation{heading,pitch,roll}}
     * @param classOptions{id,iconUrl,classList,click}
     */
    static get viewer(){
        return viewer;
    }
    static set viewer(viewer0){
        viewer=viewer0;
    }
    static createButton(options,classOptions){
        let _this=this;
        classOptions.iconUrl=home;
        let homedom=Dom.create(classOptions);
        homedom.onclick=function (){
            _this.home(_this.viewer, options)
        }
    }

    static home(options) {
        let _this = this;
        let lon = 116.391134;
        let lat = 39.901334;
        let alt = 800;
        let _options = {
            destination: Cesium.Cartesian3.fromDegrees(lon, lat, alt),
            orientation: {
                heading: 0,
                pitch: Cesium.Math.toRadians(-45),
                roll: 0
            }
        };
        if (typeof options !== "undefined") {
            if (typeof options.position !== "undefined") {
                lon = options.position.lon || options.position[0];
                lat = options.position.lat || options.position[1];
                alt = options.position.alt || options.position[2];
                _options.destination = Cesium.Cartesian3.fromDegrees(lon, lat, alt);
            }
            if (typeof options.orientation !== "undefined") {
                _options.orientation.heading = options.orientation.heading || options.orientation[0];
                _options.orientation.pitch = options.orientation.lat || options.orientation[1];
                _options.orientation.roll = options.orientation.roll || options.orientation[2];
            }
        }
        _this.viewer.camera.flyTo({
            destination: _options.destination,
            orientation: _options.orientation
        })
    }
}

export {Home}