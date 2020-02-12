import {Cesium} from "./Unit";

class Polyline{
    constructor (options){
        let _options={
            positions:[]
            show:true,
            width:1.0,
            loop:false,
            material: Cesium.Color.GREEN
        }
        if(typeof options!=="undefined"){
            if(typeof options.show==="boolean"){
                _options.show=options.show;
            }
            if(typeof options.width==="number"){
                _options.width=options.width;
            }
            if(typeof options.loop==="boolean"){
                _options.loop=options.loop;
            }
            if(typeof options.material!=="undefined"){
                _options.material=options.material;
            }
            if(typeof options.id!=="undefined"){
                _options.id=options.id;
            }
            if(typeof options.polylineCollection!=="undefined"){
                _options.polylineCollection=options.polylineCollection;
            }
            if(typeof options.positions!=="undefined"){
                _options.positions=Cesium.Cartesian3.fromDegreesArrayHeights(options.positions);
            }
        }
        const polylineProps=_options;
        this.polyline = _this.viewer.entities.add({
            polyline: polylineProps
        });
        return this.polyline;
    }
}
export {Polyline}

