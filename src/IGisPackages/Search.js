import {Cesium} from "./Unit.js";
import {viewer} from "./Viewer.js"
import fixposition from "../../igisimgs/fixposition.png"
class Search {
    constructor (){
       // this.viewer=viewer;
    }
    static get viewer(){
        return viewer;
    }
    /**
     * 搜索经纬度
     * @param longitude 经度
     * @param latitude 纬度
     */
    static byCartographic(longitude, latitude){
        this.viewer.camera.flyTo({
            destination : Cesium.Cartesian3.fromDegrees(longitude, latitude, 500),
            // orientation : {
            //     heading : Cesium.Math.toRadians(175.0),
            //     pitch : Cesium.Math.toRadians(-35.0),
            //     roll : 0.0
            // }
        });
        this.viewer.entities.add({
            position : Cesium.Cartesian3.fromDegrees(longitude, latitude),
            point : {
                pixelSize : 10,
                color : Cesium.Color.YELLOW
            }
        });
        this.viewer.entities.add({
            position : Cesium.Cartesian3.fromDegrees(longitude, latitude),
            billboard : {
                image : fixposition, // default: undefined
                show : true, // default
                // pixelOffset : new Cesium.Cartesian2(0, -50), // default: (0, 0)
                eyeOffset : new Cesium.Cartesian3(0.0, 0.0, 0.0), // default
                horizontalOrigin : Cesium.HorizontalOrigin.CENTER, // default
                verticalOrigin : Cesium.VerticalOrigin.BOTTOM, // default: CENTER
                scale : 2.0, // default: 1.0
                color : Cesium.Color.LIME, // default: WHITE
                // rotation : Cesium.Math.PI_OVER_FOUR, // default: 0.0
                alignedAxis : Cesium.Cartesian3.ZERO, // default
                // width : 100, // default: undefined
                // height : 25 // default: undefined
            }
        });
    }
}

export {Search}