import {viewer} from "./Viewer.js";
import {Cesium} from "./Unit.js";
class Loader {
    constructor() {
        let _this=this;
        _this.gltfList=[];
        _this.tilesList=[];
        _this.dataSourceList=[];
        _this.labelList=[];
        _this.viewer=viewer;
    };

    /**
     * gltf加载器，加载完成后返回Entity。
     * @param url string 模型的地址。
     * @param position IGis.Cartographic 模型位置，经纬度。
     * @param options object  设置模型的属性
     * @heading number 0.0 航向分量，模型的朝向角度,弧度值。
     * @pitch  number 0.0 螺距分量，模型的俯仰角度，弧度值。
     * @roll number 0.0 滚动分量，模型的旋转角度，弧度值。
     * @color IGis.Color Color.White 模型的颜色。
     * @scale number 1.0 模型放大倍数。
     * @show boolean true 是否显示模型。
     * @zoomto boolean false 是否将模型在视野中放大居中。
     * @id   string   模型Id。
     * @returns {*} 加载的entity。
     */
    gltfLoader(url,position,options){
        let _this=this;
        let _options = {
            heading: 0.0,
            pitch: 0.0,
            roll: 0.0,
            color: new Cesium.Color(
                1,
                1,
                1,
                1
            ),
            scale: 1
        };
        if(options!=undefined){
            if(typeof options.heading==="number"){
                _options.heading = options.heading;
            }
            if (typeof options.pitch === "number") {
                _options.pitch = options.pitch;
            }
            if (typeof options.roll !== "number") {
                _options.roll = options.roll;
            }
            if(typeof options.color!="undefined"){
                _options.color=options.color;
            }
            if (typeof options.scale === "number") {
                _options.scale = options.scale;
            }
            if (typeof (options.show) === "boolean") {
                _options.show = options.show;
            }
            if (typeof options.enableZoomto === "boolean") {
                _options.enableZoomto = options.enableZoomto;
            }
        }
        const lon=position.lon||position[0];
        const lat=position.lat||position[1];
        const alt=position.alt||position[2]||0;
        let _position = Cesium.Cartesian3.fromDegrees(lon,lat,alt);
        let hpr =new Cesium.HeadingPitchRoll(_options.heading,_options.pitch,_options.roll);
        let orientation = Cesium.Transforms.headingPitchRollQuaternion(_position, hpr);
        let color = _options.color;
        console.log(url,"url");
        let entity= _this.viewer.entities.add({
            // name: "aaa",
            position: _position,
            orientation: orientation,
            model: {
                uri: url,
                scale: 1,
                color: color
                //colorBlendMode:0.5
            }
        });
        if (typeof _options.id !== "undefined") {
            entity.id = _options.id;
        }
        if (typeof _options.show !=="undefined") {
            entity.show = _options.show;
        }
        if (typeof _options.enableZoomto !=="undefined") {
            _this.viewer.zoomTo(entity);
        }
        _this.gltfList.push(entity);
        return entity;

    };

    /**
     * 3Dtiles模型加载
     * @param url string 模型地址
     * @param enableZoomto boolean false 是否使加载的模型在视野内放大居中
     * @returns {*} 加载的3Dtiles模型
     */
    tilesLoader3D(url,enableZoomto){
        let _this=this;
        console.log(url,'url');
        let tileset=_this.viewer.scene.primitives.add(new  Cesium.Cesium3DTileset({
            url:url
        }))
        if (typeof enableZoomto ==="boolean") {
            if (enableZoomto === true) {
                _this.viewer.zoomTo(tileset);
            }
        };
        _this.tilesList.push(tileset);
        const fixGltf = function (gltf) {
            if (!gltf.extensionsUsed) {
                return;
            }

            const v = gltf.extensionsUsed.indexOf('KHR_technique_webgl');
            const t = gltf.extensionsRequired.indexOf('KHR_technique_webgl');
            // 中招了。。
            if (v !== -1) {
                gltf.extensionsRequired.splice(t, 1, 'KHR_techniques_webgl');
                gltf.extensionsUsed.splice(v, 1, 'KHR_techniques_webgl');
                gltf.extensions = gltf.extensions || {};
                gltf.extensions['KHR_techniques_webgl'] = {};
                gltf.extensions['KHR_techniques_webgl'].programs = gltf.programs;
                gltf.extensions['KHR_techniques_webgl'].shaders = gltf.shaders;
                gltf.extensions['KHR_techniques_webgl'].techniques = gltf.techniques;
                const techniques = gltf.extensions['KHR_techniques_webgl'].techniques;

                gltf.materials.forEach(function (mat, index) {
                    gltf.materials[index].extensions['KHR_technique_webgl'].values = gltf.materials[index].values;
                    gltf.materials[index].extensions['KHR_techniques_webgl'] = gltf.materials[index].extensions['KHR_technique_webgl'];

                    const vtxfMaterialExtension = gltf.materials[index].extensions['KHR_techniques_webgl'];

                    for (const value in vtxfMaterialExtension.values) {
                        let us = techniques[vtxfMaterialExtension.technique].uniforms;
                        for (let key in us) {
                            if (us[key] === value) {
                                vtxfMaterialExtension.values[key] = vtxfMaterialExtension.values[value];
                                delete vtxfMaterialExtension.values[value];
                                break;
                            }
                        }
                    };
                });

                techniques.forEach(function (t) {
                    for (let attribute in t.attributes) {
                        let name = t.attributes[attribute];
                        t.attributes[attribute] = t.parameters[name];
                    };

                    for (let uniform in t.uniforms) {
                        let name = t.uniforms[uniform];
                        t.uniforms[uniform] = t.parameters[name];
                    };
                });
            }
        }

        Object.defineProperties(Cesium.Model.prototype, {
            _cachedGltf: {
                set: function (value) {
                    this._vtxf_cachedGltf = value;
                    if (this._vtxf_cachedGltf && this._vtxf_cachedGltf._gltf) {
                        fixGltf(this._vtxf_cachedGltf._gltf);
                    }
                },
                get: function () {
                    return this._vtxf_cachedGltf;
                }
            }
        });
        return tileset;
    };

    czmlLoader(czml,enableTracked){
        this.viewer.dataSources.add(Cesium.CzmlDataSource.load(czml)).then(function(ds) {
            if(enableTracked===true){
                this.viewer.trackedEntity = ds.entities.getById('path');
            }
        });
    }
    tagLoader(options){
        if(typeof options!=="undefined"){
            let tag= this.viewer.entities.add(options);
            return tag;
        }

    }

    /**
     * 移除gltf模型
     * @param entity object  要移除的gltf模型，如果不填，则移除场景中所有的gltf模型。
     */
    removeGltf(entity){
        let _this=this;
        if(typeof entity!="undefined"){
            _this.viewer.entities.remove(entity);
        }else {
            if(_this.gltfList.length>0){
                for(let i=0;i<_this.gltfList.length;i++){
                    let gltf=_this.gltfList[i];
                    _this.viewer.entities.remove(gltf);
                }
            }
        }
    };
    /**
     * 移除3dtiles模型
     * @param tileset object 要移除的3dtiles模型，如果不填，则移除所有的3dtiles模型。
     */
    remove3dtiles(tileset){
        let _this=this;
        if(typeof tileset!="undefined"){
            _this.viewer.scene.primitives.remove(tileset);
        }else {
            if(_this.tilesList.length>0){
                for(let i=0;i<_this.tilesList.length;i++){
                    let tiles=_this.tilesList[i];
                    _this.viewer.scene.primitives.remove(tiles);
                }
            }
        }
    };
    //调整3dtiles模型高度
    //参数 elementId：toolbar的Id，tileset：要调整的tiles bindvalue：跟toolbar控件绑定的值
    adjustHeight(elementId,tileset,bindValue) {
        let viewModel = {
            height: 0
        };

        Cesium.knockout.track(viewModel);

        let toolbar = document.getElementById(elementId);
        toolbar.style.display="";
        Cesium.knockout.applyBindings(viewModel, toolbar);
        Cesium.knockout.getObservable(viewModel, bindValue).subscribe(function (height) {
            height = Number(height);
            if (isNaN(height)) {
                return;
            }
            let cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
            let surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
            let offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height);
            let translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
            tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
        });
    };
    //移除高度调整工具
    removeAdjustHeight(elementId){
        let toolbar = document.getElementById(elementId);
        toolbar.style.display="none";
    };
    /**
     * geojson加载器。
     * @param url string  geojson的地址。
     * @param options
     * @param options.height number 0 生成区块的高度。
     * @param options.fill boolean true 是否用颜色将区块填充。
     * @param options.color 数组[{name,color}] 对应每个区块的名称和颜色。
     * @param options.outline boolean true 是否绘制轮廓线。
     * @param options.outlineColor IGis.Color Color.WHITE 轮廓线的颜色。
     * @param options.outlineWidth number 1.0 轮廓线宽度。
     * @returns {*} 转换为EntityCollection的通用数据dataSource。
     */
    geojsonLoader(url,options,fn){
        let _this=this;
        _this.viewer.scene.globe.depthTestAgainstTerrain = false;
        let _options={
            height:0,
            fill:true,
            outline:true,
            outlineColor:Cesium.Color.WHITE,
            outlineWidth:200.0,
            extrudedHeight:1000,
            alpha:0.5
        }
        if(typeof options!=="undefined"){
            if(typeof options.height==="number"){
                _options.height=options.height;
            }
            if(typeof options.fill==="boolean"){
                _options.fill=options.fill;
            }
            if(typeof options.color!=="undefined"){
                _options.color=options.color;
            }
            if(typeof options.outline==="boolean"){
                _options.outline=options.outline;
            }
            if(typeof options.outlineColor!=="undefined"){
                _options.outlineColor=options.outlineColor;
            }
            if(typeof options.outlineWidth!=="undefined"){
                _options.outlineWidth=options.outlineWidth;
            }
            if(typeof options.zIndex==="undefined"){
                _options.zIndex=options.zIndex;
            }
            if(typeof options.extrudedHeight==="undefined"){
                _options.extrudedHeight=options.extrudedHeight;
            }
            if(typeof options.alpha!=="undefined"){
                _options.alpha=options.alpha;
            }
        }
        Cesium.GeoJsonDataSource.load(url).then(function (dataSource) {
            _this.viewer.dataSources.add(dataSource);

            let entities=dataSource.entities.values;
            for(let i=0;i<entities.length;i++){
                let entity = entities[i];
                let name=entity.properties.name;
                let color = Cesium.Color.fromRandom({
                    alpha: _options.alpha
                });
                // if(_options.color.length>0){
                //     for(let j=0;j<_options.color.length;j++){
                //         if(_options.color[j].name===name){
                //             // color=_options.color[j].color;
                //             // break;
                //         }
                //     }
                // }

                entity.polygon.material = color;
                // entity.polygon.outline = true;
                entity.polygon.height=_options.height;
                entity.polygon.fill=_options.fill;
                entity.polygon.outline=_options.outline;
                entity.polygon.outlineColor=_options.outlineColor;
                entity.polygon.outlineWidth=_options.outlineWidth;
                entity.polygon.extrudedHeight = _options.extrudedHeight;
                entity.type="geoJsonEntity";
            };
            _this.dataSourceList.push(dataSource);
            fn(dataSource);
        })
        //
        // return dataSource;

    };

    /**
     * 给geojson绘制label标签。
     * @param dataSource 数据源，转换为EntityCollection的通用数据（geojsonLoader的返回值可使用）。
     * @param options object label属性对象。
     * @param options.font string "24px sans-serif" 字体大小样式。
     * @param options.name string "GEOLABLE" label的名称。
     * @param options.scale number 1.0 label的放大倍数。
     * @param options.showBackground boolean false 是否显示背景。
     * @param options.backgroundColor Color    label背景色。
     * @param options.fillColor Color Color.WHITE label填充色。
     * @param options.outlineWidth number 1.0 边框宽度。
     * @param options.outlineColor Color Color.BLACK 边框颜色。
     * @param options.disableDepthTestDistance number Number.POSITIVE_INFINITY 在什么高度关闭深度测试 设置为Number.POSITIVE_INFINITY 则关闭深度测试,设置为0则开启深度测试。
     */
    geoJsonLabels(dataSource,options){
        const _this=this;

        let entities = dataSource.entities.values;
        let _options={
            font:"24px sans-serif",
            name:'GEOLABLE',
            scale:0.6,
            showBackground: true,
            backgroundColor:new Cesium.Color(0.44,0.5,0.56,0.5),
            fillColor:Cesium.Color.WHITE,
            outlineWidth:1.0,
            outlineColor:Cesium.Color.BLACK,
            disableDepthTestDistance:0    //在什么高度关闭深度测试 设置为Number.POSITIVE_INFINITY 则关闭深度测试
        }
        if(typeof options!=="undefined"){
            if(typeof options.font!=="undefined"){
                _options.font=options.font;
            }
            if(typeof options.name!=="undefined"){
                _options.name=options.name;
            }
            if(typeof options.scale==="number"){
                _options.scale=options.scale;
            }
            if(typeof options.showBackground==="boolean"){
                _options.showBackground=options.showBackground;
            }
            if(typeof options.backgroundColor!=="undefined"){
                _options.backgroundColor=options.backgroundColor;
            }
            if(typeof options.fillColor!=="undefined"){
                _options.fillColor=options.fillColor;
            }
            if(typeof options.outlineWidth==="number"){
                _options.outlineWidth=options.outlineWidth;
            }
            if(typeof options.outlineColor!=="undefined"){
                _options.outlineColor=options.outlineColor;
            }
            if(typeof options.disableDepthTestDistance!=="undefined"){
                _options.disableDepthTestDistance=options.disableDepthTestDistance;
            }
        }
        for (let i = 0; i < entities.length; i++) {
            let entity = entities[i];
            let polyPositions = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions;
            let polyCenter = Cesium.BoundingSphere.fromPoints(polyPositions).center;
            let polyCenter1 = Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(polyCenter);
            let center;
            if(entity.properties.cp!==undefined){
                const lon = entity.properties.cp._value[0];
                const lat = entity.properties.cp._value[1];
                center = Cesium.Cartesian3.fromDegrees(lon, lat, 0);
            }else {
                center=polyCenter1;
            }
            let label = _this.viewer.entities.add({
                position: center,
                name: _options.name,
                label: {
                    font: _options.font,
                    name:_options.name,
                    text: entity.properties.name,
                    showBackground: _options.showBackground,
                    backgroundColor:_options.backgroundColor,
                    fillColor:_options.fillColor,
                    scale: _options.scale,
                    outlineWidth:_options.outlineWidth,
                    outlineColor:_options.outlineColor,
                    disableDepthTestDistance:_options.disableDepthTestDistance,
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    verticalOrigin: Cesium.VerticalOrigin.CENTER,
                }
            })
            _this.labelList.push(label);
        }
    };

    removeGeoJsonLabels(label){
        if (this.labelList.length > 0) {
            for (let i = 0; i < this.labelList.length; i++) {
                let label = this.labelList[i];
                this.viewer.entities.remove(label);
            }
        }
    };

    /**
     * 给geojson绘制 echarts图表
     * @param dataSource 数据源，转换为EntityCollection的通用数据（geojsonLoader的返回值可使用）。
     */
    geojsonEcharts(entity) {
        let polyPositions = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions;
        let polyCenter = Cesium.BoundingSphere.fromPoints(polyPositions).center;
        let polyCenter1 = Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(polyCenter);
        //加载图表
        let elementId = entity.id + "_div";
        _this.createChartBox(elementId);
        _this.dictionary[elementId] = polyCenter1;
    };


    /**
     * 移除通过Loader加载的geojson
     * @param dataSource dataSource 数据源，转换为EntityCollection的通用数据（geojsonLoader的返回值）。
     */
    removeGeojson(dataSource) {
        let _this = this;
        if (dataSource != undefined) {
            _this.viewer.dataSources.remove(dataSource);
        } else {
            if (_this.dataSourceList.length > 0) {
                for (let i = 0; i < _this.dataSourceList.length; i++) {
                    let ds = _this.dataSourceList[i];
                    _this.viewer.dataSources.remove(ds);
                }
            }


        }
    };
}

export {Loader};