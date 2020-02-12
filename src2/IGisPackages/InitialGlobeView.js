import {IGisOverviewMapControl} from "../IGisTools/IGisOverviewMapControl.js";
const Cesium=require("cesium/Cesium");
class InitialGlobeView{
    constructor(elementId,options) {
        let url =
            "http://www.google.cn/maps/vt?lyrs=s@800&x={x}&y={y}&z={z}";
        let layer = new L.TileLayer(url, {
            zoom: 1,
            // minZoom: 15,
            // maxZoom: 20
        });
        let container = document.getElementById(elementId);
        let _options = {
            container: container,
            toggleDisplay: true,
            width: 200,
            height: 100,
            position: "topright",
            aimingRectOptions: {
                color: "#ff1100",
                weight: 3
            },
            shadowRectOptions: {
                color: "#0000AA",
                weight: 1,
                opacity: 0,
                fillOpacity: 0
            }
        };

        // let layers = viewer.scene.imageryLayers;
        // let blackMarble = layers.addImageryProvider(new Cesium.createTileMapServiceImageryProvider({
        //     url : '//cesiumjs.org/tilesets/imagery/blackmarble',
        //     maximumLevel : 8,
        //     credit : 'Black Marble imagery courtesy NASA Earth Observatory'
        // }));
        let overviewCtr = new IGisOverviewMapControl(viewer, layer, _options);
    }

}
export {InitialGlobeView};