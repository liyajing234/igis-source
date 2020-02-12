import {Cesium} from "./Unit";
import {viewer} from "./Viewer";
// import {Plane,Tags} from "igis-cesium/src/IGisPackages/Tags";
class VideoPlane {
    constructor (videoId,position,options) {
        const _options={
            width:40,
            height:30,
            normal:Cesium.Cartesian3.UNIT_Y,
            distance:0
        }
        if(typeof options!=="undefined"){
            if(typeof options.width==="number"){
                _options.width=options.width;
            }
            if(typeof options.height==="number"){
                _options.height=options.height;
            }
            if(typeof options.normal!=="undefined"){
                _options.normal=options.normal;
            }
            if(typeof options.distance==="number"){
                _options.distance=options.distance;
            }
        }
        const videoElement = document.getElementById(videoId);
        const lon = position.lon||position.x||position[0];
        const lat =  position.lat||position.y||position[1];
        const height= position.alt||position.z||position[2]||position.height;

        var redPlane = viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(lon,lat,height),
            plane : {
                plane : new Cesium.Plane(_options.normal,_options.distance),
                dimensions : new Cesium.Cartesian2(_options.width,_options.height),
                material : videoElement,
                outline : true,
                outlineColor : Cesium.Color.BLACK
            }
        });
        let synchronizer;
        if (Cesium.defined(synchronizer)) {
            synchronizer = synchronizer.destroy();
            videoElement.playbackRate = 1.0;
            return;
        }

        synchronizer = new Cesium.VideoSynchronizer({
            clock : viewer.clock,
            element : videoElement
        });
        return redPlane;

    }

}
export {VideoPlane}