import {Cesium} from "./Unit.js";
import trailpng from "../../igisimgs/trailpng.png"
class PolylineTrailLinkMaterialProperty {
    constructor (color, duration) {
        this._definitionChanged = new Cesium.Event();
        this._color = undefined;
        this._colorSubscription = undefined;
        this.color = color;
        this.duration = duration;
        this._time = (new Date()).getTime();
    }
}

Cesium.defineProperties(PolylineTrailLinkMaterialProperty.prototype, {
    isConstant: {
        get: function () {
            return false;
        }
    },
    definitionChanged: {
        get: function () {
            return this._definitionChanged;
        }
    },
    color: Cesium.createPropertyDescriptor('color')
});
PolylineTrailLinkMaterialProperty.prototype.getType = function (time) {
    return 'PolylineTrailLink';
}
PolylineTrailLinkMaterialProperty.prototype.getValue = function (time, result) {
    if (!Cesium.defined(result)) {
        result = {};
    }
    result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
    result.image = Cesium.Material.PolylineTrailLinkImage;
    result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration;
    return result;
}
PolylineTrailLinkMaterialProperty.prototype.equals = function (other) {
    return this === other ||
        (other instanceof PolylineTrailLinkMaterialProperty &&
            Property.equals(this._color, other._color))
}
Cesium.PolylineTrailLinkMaterialProperty = PolylineTrailLinkMaterialProperty;
Cesium.Material.PolylineTrailLinkType = 'PolylineTrailLink';
// Cesium.Material.PolylineTrailLinkImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAAZCAYAAACLvRPfAAAB2UlEQVR4Xu3dgW6CMBQFUPDHhz8+F4ZMlgHWRtf38Cwx2TCEZ0vvTitiPwzdpfMTpwXm3vi8ljT+PT/GTY9sr91veZxHjrdVnzpufdioP4ePoev6/vYY++p0mk6y5fb5963nn7W98ji9wIqTVT+VbJ3UwmNqorkdWrZHshAezuf/Dae1MHxC2AmsaHlFWOuibBlOBwhJwoo20I9UD2H9llTE9iCsv2JbCoqwjpRIO6+FsAjrBWuBhPUm+dHkZUYURZRpUZQ6CIuwmoRDtIMSFmER1jQqV6aVFt2jBdZYD2FZw9o7D5bnR6H0vEsYcaAfoSbCIizCIqxUWUZYhEVYq6FlShgtyQiLsAiLsKLl0m49hEVYhEVYKUKLsAiLsAgrRVjNRRIWYREWYaUILcIiLMIirBRhRViP3Uqn5QeiC69/+u7SAGJ2HVaqBEhULGERFmERVqLICvEfOYoMwtZBWNOQ2ropoLs1pIqc+mIJi7AIi7DqE6TBngHWPMLKZjmYrWEVr/lZw2owjt/ikIRFWIRFWKnCjrCm7ronqHvPl3zhQ+1aVO1+jYRIWKkSIFGxhEVYhEVYiSLLu4SloU1Y1rBSDewjFls6WF853Wk0bbHQf73IlLA2hfUFiEJJy0vBOeAAAAAASUVORK5CYII=";
Cesium.Material.PolylineTrailLinkImage = trailpng;
Cesium.Material.PolylineTrailLinkSource = "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
                                                      {\n\
                                                           czm_material material = czm_getDefaultMaterial(materialInput);\n\
                                                           vec2 st = materialInput.st;\n\
                                                           vec4 colorImage = texture2D(image, vec2(fract(st.s-time),st.t));\n\
                                                           material.alpha = colorImage.a * color.a;\n\
                                                           material.diffuse = (colorImage);\n\
                                                           return material;\n\
                                                       }";


Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineTrailLinkType, {
    fabric: {
        type: Cesium.Material.PolylineTrailLinkType,
        uniforms: {
            color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
            image: Cesium.Material.PolylineTrailLinkImage,
            time: 0
        },
        source: Cesium.Material.PolylineTrailLinkSource
    },
    translucent: function (material) {
        return true;
    }
});

export {PolylineTrailLinkMaterialProperty}
