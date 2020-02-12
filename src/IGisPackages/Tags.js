import {Cesium} from "./Unit.js";
import markpng from "../../igisimgs/circle_red.png";
import {viewer} from "./Viewer.js"

class Point {
    constructor (pointOptions) {
        let _pointOptions = {
            show: true,
            pixelSize: 10,
            color: Cesium.Color.YELLOW,
            outlineColor: Cesium.Color.RED,
            outlineWidth: 1.0,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
        }
        if (typeof pointOptions !== "undefined") {
            if (typeof pointOptions.enable === "boolean") {
                _pointOptions.enable = pointOptions.enable;
            }
            if (typeof pointOptions.pixelSize === "number") {
                _pointOptions.pixelSize = pointOptions.pixelSize;
            }
            if (typeof pointOptions.color !== "undefined") {
                _pointOptions.color = pointOptions.color;
            }
            if (typeof pointOptions.outlineColor !== "undefined") {
                _pointOptions.outlineColor = pointOptions.outlineColor;
            }
            if (typeof pointOptions.outlineWidth === "number") {
                _pointOptions.outlineWidth = pointOptions.outlineWidth;
            }
            if (typeof pointOptions.disableDepthTestDistance !== "undefined") {
                _pointOptions.disableDepthTestDistance = pointOptions.disableDepthTestDistance;
            }
        }
        this.point = {
            show: _pointOptions.show,
            pixelSize: _pointOptions.pixelSize,
            color: _pointOptions.color,
            outlineColor: _pointOptions.outlineColor,
            outlineWidth: _pointOptions.outlineWidth,
            disableDepthTestDistance: _pointOptions.disableDepthTestDistance
        }
        return this.point;
    }
}

class Billboard {
    constructor (billboardOptions) {
        let _billboardOptions = {
            show: true,
            image: markpng,
            scale: 1.0,
            color: Cesium.Color.WHITE,
            disableDepthTestDistance: 0,
            pixelOffset : new Cesium.Cartesian2(0,0), // default: (0, 0)
            eyeOffset : new Cesium.Cartesian3(0.0, 0.0, 0.0), // default
        }
        if (typeof billboardOptions !== "undefined") {
            if (typeof billboardOptions.enable === "boolean") {
                _billboardOptions.enable = billboardOptions.enable;
            }
            if (typeof billboardOptions.image !== "undefined") {
                _billboardOptions.image = billboardOptions.image;
                console.log(_billboardOptions.image,"image")
            }
            if (typeof billboardOptions.scale === "number") {
                _billboardOptions.scale = billboardOptions.scale;
            }
            if (typeof billboardOptions.color !== "undefined") {
                _billboardOptions.color = billboardOptions.color;
            }
            if (typeof billboardOptions.disableDepthTestDistance !== "undefined") {
                _billboardOptions.disableDepthTestDistance = billboardOptions.disableDepthTestDistance;
            }
            if (typeof billboardOptions.width === "number") {
                _billboardOptions.width = billboardOptions.width;
            }
            if (typeof billboardOptions.height === "number") {
                _billboardOptions.height = billboardOptions.height;
            }
        }
        this.billboard = {
            show: _billboardOptions.show,
            image: _billboardOptions.image,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // default
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // default: CENTER
            scale: _billboardOptions.scale,
            color: _billboardOptions.color,
            disableDepthTestDistance: _billboardOptions.disableDepthTestDistance
        }
        if (typeof _billboardOptions.width !== "undefined") {
            this.billboard.width = _billboardOptions.width;
        }
        if (typeof _billboardOptions.height !== "undefined") {
            this.billboard.height = _billboardOptions.height;
        }
        return this.billboard;
    }

}

class Label {
    /**
     *创建label。
     * @param labelOptions object label属性 {show,text,font,style,scale,showBackground,backgroundColor,horizontalOrigin
     * verticalOrigin,fillColor,outlineColor,outlineWidth,disableDepthTestDistance}
     * @param labelOptions.show boolean true 是否显示label。
     * @param labelOptions.text string "label" label要显示的文字。
     * @param labelOptions.font string 字体及大小。
     * @param labelOptions.scale number 1.0 label放大倍数。
     * @param labelOptions.showBackground boolean true 是否显示背景颜色。
     * @param labelOptions.backgroundColor Color Clor.AQUA 背景颜色。
     * @param labelOptions.horizontalOrigin    垂直位置。
     * @param labelOptions.verticalOrigin 水平位置。
     * @param labelOptions.fillColor Color Color.WHITE 填充颜色。
     * @param labelOptions.outlineColor Color Color.BLACK 外框颜色。
     * @param labelOptions.outlineWidth number 2 边框宽度。
     * @param labelOptions.disableDepthTestDistance number 0 指定距相机多少米禁用深度测试。
     */
    constructor (labelOptions) {
        let _labelOptions = {
            show: true,
            text: "label",
            font: "14pt Source Han Sans CN",
            scale:1.0,
            showBackground: true, //是否显示背景颜色
            backgroundColor: Cesium.Color.AQUA, //背景颜色
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM, //垂直位置
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER, //水平位置
            fillColor: Cesium.Color.BLACK, //字体颜色
            outlineColor:Cesium.Color.BLACK,
            outlineWidth: 2,
            // pixelOffset: new Cesium.Cartesian2(10, 0) //偏移
            disableDepthTestDistance:0,
            pixelOffset:[0,-60]
        }
        if (typeof labelOptions !== "undefined") {
            if (typeof labelOptions.show === "boolean") {
                _labelOptions.show = labelOptions.show;
            }
            if (typeof labelOptions.text !== "undefined") {
                _labelOptions.text = labelOptions.text;
            }
            if (typeof labelOptions.font !== "undefined") {
                _labelOptions.font = labelOptions.font;
            }
            if (typeof labelOptions.scale === "number") {
                _labelOptions.scale = labelOptions.scale;
            }
            if (typeof labelOptions.showBackground === "boolean") {
                _labelOptions.showBackground = labelOptions.showBackground;
            }
            if (typeof labelOptions.backgroundColor !== "undefined") {
                _labelOptions.backgroundColor = labelOptions.backgroundColor;
            }
            if (typeof labelOptions.verticalOrigin !== "undefined") {
                _labelOptions.verticalOrigin = labelOptions.verticalOrigin;
            }
            if (typeof labelOptions.horizontalOrigin !== "undefined") {
                _labelOptions.horizontalOrigin = labelOptions.horizontalOrigin;
            }
            if (typeof labelOptions.fillColor !== "undefined") {
                _labelOptions.fillColor = labelOptions.fillColor;
            }
            if (typeof labelOptions.outlineColor !== "undefined") {
                _labelOptions.outlineColor = labelOptions.outlineColor;
            }
            if (typeof labelOptions.outlineWidth === "number") {
                _labelOptions.outlineWidth = labelOptions.outlineWidth;
            }
            if (typeof labelOptions.disableDepthTestDistance !== "undefined") {
                _labelOptions.disableDepthTestDistance = labelOptions.disableDepthTestDistance;
            }
            if (typeof labelOptions.pixelOffset !== "undefined") {
                _labelOptions.pixelOffset = labelOptions.pixelOffset;
            }
        }

        this.label={
            show: _labelOptions.show,
            text: _labelOptions.text,
            font: _labelOptions.font,
            scale:_labelOptions.scale,
            showBackground: _labelOptions.showBackground, //是否显示背景颜色
            backgroundColor:_labelOptions.backgroundColor, //背景颜色
            verticalOrigin: _labelOptions.verticalOrigin, //垂直位置
            horizontalOrigin: _labelOptions.horizontalOrigin, //水平位置
            fillColor: _labelOptions.fillColor, //字体颜色
            outlineColor:_labelOptions.outlineColor,
            outlineWidth: _labelOptions.outlineWidth,
            pixelOffset: new Cesium.Cartesian2(_labelOptions.pixelOffset[0],_labelOptions.pixelOffset[1]), //偏移
            disableDepthTestDistance:_labelOptions.disableDepthTestDistance
        };
        return this.label;
    }
}

class Polyline{
    constructor (options){
        let _options={
            positions:[],
            show:true,
            width:1.0,
            clampToGround:true,
            material: Cesium.Color.GREEN
        }
        if(typeof options!=="undefined"){
            if(typeof options.show==="boolean"){
                _options.show=options.show;
            }
            if(typeof options.width==="number"){
                _options.width=options.width;
            }
            if(typeof options.clampToGround==="boolean"){
                _options.clampToGround=options.clampToGround;
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
        return polylineProps;
    }
}

class Plane{
    /**
     *
     * @param planeOptions
     * @param planeOptions.show 是否显示
     * @param planeOptions.plane object {normal [] 平面的法向量 [],distance原点到平面的最短距离}
     * @param planeOptions.dimensions [] 平面宽高
     * @param planeOptions.fill  是否用材质将模型填满
     * @param planeOptions.material 平面材质
     * @param planeOptions.outline  平面是否有outline
     * @param planeOptions.outlineColor
     * @param planeOptions.outlineWidth
     * @param planeOptions.distanceDisplayCondition 距离多远不显示平面
     */
    constructor (planeOptions) {
        let _planeOptions={
            show:true,
            dimensions:new Cesium.Cartesian2(40,30),
            material:Cesium.Color.WHITE,
            plane:new Cesium.Plane(Cesium.Cartesian3.UNIT_X, 0.0)
        }
        if(typeof planeOptions!=="undefined"){
            if(typeof planeOptions.show==="boolean"){
                _planeOptions.show=planeOptions.show;
            }
            if(typeof planeOptions.plane!=="undefined"){
                const normal=planeOptions.plane.normal||planeOptions.plane[0];
                const distance=planeOptions.plane.distance||planeOptions.plane[1];
                _planeOptions.plane=new Cesium.Plane(normal,distance);
            }

            if(typeof planeOptions.dimensions!=="undefined"){
                const width=planeOptions.dimensions.width||planeOptions.dimensions.x||planeOptions.dimensions[0];
                const height=planeOptions.dimensions.height||planeOptions.dimensions.y||planeOptions.dimensions[1];
                _planeOptions.dimensions=new Cesium.Cartesian2(width,height);
            }

            if(typeof planeOptions.fill!=="undefined"){
                _planeOptions.fill=planeOptions.fill;
            }
            if(typeof planeOptions.material!=="undefined"){
                _planeOptions.material=planeOptions.material;
            }
            if(typeof planeOptions.outline!=="undefined"){
                _planeOptions.outline=planeOptions.outline;
            }
            if(typeof planeOptions.outlineColor!=="undefined"){
                _planeOptions.outlineColor=outlineColor.height;
            }
            if(typeof planeOptions.outlineWidth!=="undefined"){
                _planeOptions.outlineWidth=planeOptions.outlineWidth;
            }
            if(typeof planeOptions.distanceDisplayCondition!=="undefined"){
                _planeOptions.distanceDisplayCondition=planeOptions.distanceDisplayCondition;
            }

        }
        const plane=_planeOptions;
        return plane;
    }

}

class Point2 extends Cesium.PointGraphics{

}

class Billboard2 extends Cesium.BillboardGraphics{

}

class Label2 extends Cesium.LabelGraphics{

}

class Polyline2 extends Cesium.PolylineGraphics{

}

class Plane2 extends Cesium.PlaneGraphics{

}

class Ellipse extends Cesium.EllipseGraphics{

}

class Circle{
    constructor (circleOptions) {
        let _circleOptions={
            show:true,
            semiMajorAxis:10,
            semiMinorAxis:10,
            material:Cesium.Color.WHITE,
            zIndex:0
        }
        if(typeof circleOptions!=="undefined"){
            if(typeof circleOptions.show==="boolean"){
                _circleOptions.show=circleOptions.show;
            }
            if(typeof circleOptions.radius!=="undefined"){
                _circleOptions.semiMajorAxis=circleOptions.radius;
                _circleOptions.semiMinorAxis=circleOptions.radius;
            }
            if(typeof circleOptions.color!=="undefined"){
                _circleOptions.material=circleOptions.color;
            }

            if(typeof circleOptions.zIndex!=="undefined"){
                _circleOptions.zIndex=circleOptions.zIndex;
            }
        }
        const circle=_circleOptions;
        return circle;
    }
}
let tagList=[];
class Tags {
    static get viewer(){
        return viewer;
    }
    static get tagList(){
        return tagList
    }
    static set tagList(tag){
        tagList.push(tag);
    }
    static add(options){
        let _options={
            position:null,
            label:undefined,
            point:undefined,
            billboard:undefined,
            circle:undefined
        }
        if(typeof options!="undefined"){
            if(typeof options.position!=="undefined"){
                _options.position = options.position;
            }
            if(typeof options.label!=="undefined"){
                _options.label = options.label;
            }
            if(typeof options.point!=="undefined"){
                _options.point = options.point;
            }
            if(typeof options.billboard!=="undefined"){
                _options.billboard = options.billboard;
            }
            if(typeof options.polyline!=="undefined"){
                _options.polyline = options.polyline;
            }
            if(typeof options.id!=="undefined"){
                _options.id = options.id;
            }
            if(typeof options.name==="string"){
                _options.name = options.name;
            }
            if(typeof options.mark!=="undefined"){
                _options.mark = options.mark;
            }
            if(typeof options.circle!=="undefined"){
                _options.circle=options.circle;
            }
        }
        let entity={};
        if(_options.position==null){
            entity={
                label:_options.label,
                billboard:_options.billboard,
                point:_options.point,
                polyline:_options.polyline
            }
            if(typeof _options.id!=="undefined"){
                entity.id=_options.id;
            }
        }else{
            const lon=_options.position.longitude||_options.position.lon||_options.position.x||_options.position[0];
            const lat=_options.position.latitude||_options.position.lat||_options.position.y||_options.position[1];
            const height=_options.position.alt||_options.position.height||_options.position.z||_options.position[2]||0;
            entity={
                position:Cesium.Cartesian3.fromDegrees(lon,lat,height),
                label:_options.label,
                billboard:_options.billboard,
                point:_options.point,
                ellipse:_options.circle
            }
            if(typeof _options.id!=="undefined"){
                entity.id=_options.id;
            }
            if(typeof _options.name!=="undefined"){
                console.log("tag");
                entity.name=_options.name;
            }
            if(typeof _options.mark!=="undefined"){
                entity.mark=_options.mark;
            }
        }

        const en=this.viewer.entities.add(entity);
        this.tagList=en;
        return en
    }
    static addList(optionList){
        if(optionList.length>0){
            for(let i=0;i<optionList.length;i++){
                let options=optionList[i];
                let _options={
                    position:null,
                    label:{},
                    point:{},
                    billboard:{},
                }
                if(typeof options!="undefined"){
                    if(typeof options.position!=="undefined"){
                        _options.position = options.position;
                    }
                    if(typeof options.label!=="undefined"){
                        _options.label = options.label;
                    }
                    if(typeof options.point!=="undefined"){
                        _options.point = options.point;
                    }
                    if(typeof options.billboard!=="undefined"){
                        _options.billboard = options.billboard;
                    }
                    if(typeof options.polyline!=="undefined"){
                        _options.polyline = options.polyline;
                    }
                    if(typeof options.id!=="undefined"){
                        _options.id = options.id;
                    }
                    if(typeof options.name==="string"){
                        _options.name = options.name;
                    }
                    if(typeof options.mark!=="undefined"){
                        _options.mark = options.mark;
                    }
                }
                let entity={};
                if(_options.position==null){
                    entity={
                        label:_options.label,
                        billboard:_options.billboard,
                        point:_options.point
                    }
                }else{
                    const lon=_options.lon||_options.x||_options[0];
                    const lat=_options.lat||_options.y||_options[1];
                    const height=_options.alt||_options.height||_options.z||_options[2]||0;
                    entity={
                        position:Cesium.Cartesian3.fromDegrees(lon,lat,height),
                        label:_options.label,
                        billboard:_options.billboard,
                        point:_options.point
                    }
                }
                if(typeof _options.id!=="undefined"){
                    entity.id=_options.id;
                }
                if(typeof _options.name!=="undefined"){
                    entity.name=_options.name;
                }
                if(typeof _options.mark!=="undefined"){
                    entity.mark=_options.mark;
                }
                this.viewer.entities.add(entity);
                this.tagList=entity;
            }
        }
    }
    /**
     * 清楚扫描面标签
     * @param tag 可不填 若填写 则清除特定的标签 若不填写 则清除所有标签
     */
    static remove(tag){
        const _this=this;

        if(typeof tag!="undefined"){
            _this.viewer.entities.remove(tag);
        }else {
            if(_this.tagList.length>0){
                for(let i=0;i<_this.tagList.length;i++){
                    const gltf=_this.tagList[i];
                    _this.viewer.entities.remove(gltf);
                }
            }
        }
    }
}

export {Point,Billboard,Label,Polyline,Circle,Plane,Tags}