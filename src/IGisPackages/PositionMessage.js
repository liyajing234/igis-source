import {Cesium} from "./Unit.js";
let viewer=null;
class PositionMessage {
    /**
     * 在容器内显示经纬高程
     * @param viewer
     * @param options{lon_showId,lat_showId,alt_showId,elevation_showId}
     * @param options.lon_showId 经度的容器ID
     * @param options.lat_showId 纬度的容器ID
     * @param options.alt_showId 海拔的容器ID
     * @param options.elevation_showId 摄像机视角的高度
     */
   
    static get viewer(){
        return viewer;
    }
    static set viewer(_viewer){
        viewer=_viewer;
    }
    static show(options){
        let _this=this;
        let _options={
            lon_show:null,
            lon_showText:"",
            lat_show:null,
            lat_showText:"",
            alt_show:null,
            alt_showText:"",
            elevation_show:null,
            elevation_showText:"",
        };
        if(typeof (options)!=="undefined"){
            if(typeof (options.lon_showId)!=="undefined"){
                _options.lon_show = document.getElementById(options.lon_showId);
                _options.lon_showText=_options.lon_show.innerHTML;
            }
            if(typeof (options.lat_showId)!=="undefined"){
                _options.lat_show = document.getElementById(options.lat_showId);
                _options.lat_showText=_options.lat_show.innerHTML;
            }
            if(typeof (options.alt_showId)!=="undefined"){
                _options.alt_show = document.getElementById(options.alt_showId);
                _options.alt_showText=_options.alt_show.innerHTML;
            }
            if(typeof (options.elevation_showId)!=="undefined"){
                _options.elevation_show = document.getElementById(options.elevation_showId);
                _options.elevation_showText=_options.elevation_show.innerHTML;
            }
        }

        let ellipsoid = _this.viewer.scene.globe.ellipsoid;
        let handler = new Cesium.ScreenSpaceEventHandler(_this.viewer.scene.canvas);
        handler.setInputAction(function (move) {
            //苗卡尔 二维平面坐标 转 苗卡尔椭球体的三维坐标 返回球体表面的点
            let cartesian = _this.viewer.camera.pickEllipsoid(move.endPosition, ellipsoid);
            if (cartesian) {
                // 苗卡尔椭球体的三维坐标 转 地图坐标（弧度）
                let cartographic = _this.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);

                // 地图坐标（弧度） 转 十进制度数 toFixed保留小数点后几位
                let log_String = Cesium.Math.toDegrees(cartographic.longitude).toFixed(8); //经度
                let lat_String = Cesium.Math.toDegrees(cartographic.latitude).toFixed(8); //纬度
                // let alt_String = (_this.viewer.camera.positionCartographic.height / 1000).toFixed(2); //视角高
                let cameraPosition = _this.viewer.camera.position;
                let ellipsoid = _this.viewer.scene.globe.ellipsoid;
                let car = ellipsoid.cartesianToCartographic(cameraPosition);
                let lat = Cesium.Math.toDegrees(car.latitude);
                let lng = Cesium.Math.toDegrees(car.longitude);
                let alt = car.height;
                let alt_String = alt.toFixed(2);

                let elec_String;
                if (_this.viewer.scene.globe.getHeight(cartographic)) {
                    elec_String = _this.viewer.scene.globe.getHeight(cartographic).toFixed(4); //海拔
                }
                if(_options.lon_show!==null){
                    _options.lon_show.innerHTML =_options.lon_showText+log_String;
                }
                if(_options.lat_show!==null){
                    _options.lat_show.innerHTML =  _options.lat_showText+lat_String;
                }
                if(_options.alt_show!==null){
                    _options.alt_show.innerHTML = _options.alt_showText+alt_String;
                }
                if(_options.elevation_show!==null&&typeof elec_String!="undefined"){
                    _options.elevation_show.innerHTML = _options.elevation_showText+elec_String;
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }
}
export {PositionMessage};