import {Cesium} from "./Unit";

class WMTSImageProvider {

    /**
     * @param options.url
     * @param options.format
     * @param options.layer
     * @param options.style
     * @param options.minimumLevel
     * @param options.maximumlevel
     * @returns {Cesium.WebMapTileServiceImageryProvider}
     */
    constructor (options){
        return new Cesium.WebMapTileServiceImageryProvider(options);
    }
}

class WMSImageProvider {


    /**
     * @param options.url
     * @param options.layer
     * @param options.parameters{transparent: true,format: "image/png",srs: "EPSG:4326",styles: ""}
     * @param options.minimumLevel
     * @param options.maximumlevel
     * @returns {Cesium.WebMapServiceImageryProvider}
     */
    constructor (options){
        return new Cesium.WebMapServiceImageryProvider(options);
    }
}

export {WMSImageProvider,WMTSImageProvider}