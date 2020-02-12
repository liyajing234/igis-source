import {viewer} from "./Viewer.js";
import {Cesium} from "./Unit.js";
import {GeoUtils} from "./GeoUtils.js";
import {Scan} from "./Scan.js";
import vehicle_normal from "../../igisimgs/vehicle_normal.png";
import vehicle_offline from "../../igisimgs/vehicle_offline.png";
import vehicle_warning from "../../igisimgs/vehicle_warning.png";
import el from "element-ui/src/locale/lang/el";
import fa from "element-ui/src/locale/lang/fa";


class CzmlLine {
    /**
     *
     * @param options
     * @param options.multiplier 时间流逝速度
     * @param options.label  label信息
     * @param options.billboard billboard信息
     * @param options.model 模型信息
     * @param options.pathMaterial 路径材质
     * @param options.pathWidth 路径宽度
     */
    constructor (options,scanOptions) {
        const _this = this;
        _this.viewer = viewer;
        _this.roadline = null;
        _this.lastTime=0;
        _this.scan=null;
        let heightReference="CLAMP_TO_GROUND";
        let _options={
            points:[],  //[{lon,lat,alt}]
            multiplier:1,
            label:{
                "fillColor": [
                    {
                        "interval": "2019-12-01T00:00:00Z/2019-12-06T00:00:00Z",
                        "rgba": [
                            255, 255, 0, 255
                        ]
                    }
                ],
                "font": "bold 10pt Segoe UI Semibold",
                "horizontalOrigin": "CENTER",
                "outlineColor": {
                    "rgba": [
                        0, 0, 0, 255
                    ]
                },
                "pixelOffset": {
                    "cartesian2": [
                        0.0,-60.0
                    ]
                },
                "scale": 1.0,
                "show": [
                    {
                        "interval": "2019-12-01T00:00:00Z/2019-12-06T00:00:00Z",
                        "boolean": true
                    }
                ],
                "style": "FILL",
                "text": "",
                "verticalOrigin": "BOTTOM"
            },
            billboard: {
                "image": vehicle_normal,
                "scale": 1,
                "eyeOffset": {
                    "cartesian": [0.0, 0.0, 0]
                },
                "horizontalOrigin": "CENTER",
                "verticalOrigin": "BOTTOM",
                "heightReference":heightReference,
                "disableDepthTestDistance":50000
            },
            model:{},
            point:undefined,
            pathMaterial: {
                "solidColor": {
                    "color": {
                        "interval": "2019-12-01T00:00:00Z/2019-12-06T00:00:00Z",
                        "rgba": [
                            255, 0, 0, 100
                        ]
                    }
                }
            },
            pathWidth:5,
            ClockRange:Cesium.ClockRange.CLAMPED,
            timeInterval: 1,
            enableScan:false,
            polyline:{
                width : 10,
                material: new Cesium.PolylineOutlineMaterialProperty({
                    color: Cesium.Color.YELLOW,
                    outlineWidth: 2,
                    outlineColor: Cesium.Color.BLACK
                }),
                clampToGround : true,
                zIndex:100
            },
            heightReference:heightReference
        }
        if(typeof options!=="undefined"){
            if(typeof options.multiplier!=="undefined")
            {
                _options.multiplier=options.multiplier;
            }
            if(typeof options.label!=="undefined")
            {
                _options.label=options.label;
            }
            if(typeof options.billboard!=="undefined")
            {
                _options.billboard=options.billboard;
            }
            if(typeof options.model!=="undefined")
            {
                _options.model=options.model;
            }
            if(typeof options.points!=="undefined")
            {
                _options.points=options.points;
            }
            if(typeof options.pathMaterial!=="undefined")
            {
                _options.pathMaterial=options.pathMaterial;
            }
            if(typeof options.pathWidth!=="undefined")
            {
                _options.pathWidth=options.pathWidth;
            }
            if(typeof options.ClockRange!=="undefined")
            {
                _options.ClockRange=options.ClockRange;
            }
            if(typeof options.timeInterval!=="undefined")
            {
                _options.timeInterval=options.timeInterval;
            }
            if(typeof options.enableScan==="boolean")
            {
                _options.enableScan=options.enableScan;
            }
            if(typeof options.heightReference!=="undefined")
            {
                _options.heightReference=options.heightReference;
                _options.billboard.heightReference=options.heightReference;
            }
            if(typeof options.polyline!=="undefined"){
                if(typeof options.polyline.width!=="undefined"){
                    _options.polyline.width=options.polyline.width;
                }
                if(typeof options.polyline.material!=="undefined"){
                    if(typeof options.polyline.material.color!=="undefined"){
                        _options.polyline.material.color=options.polyline.material.color;
                    }
                    if(typeof options.polyline.material.outlineColor!=="undefined"){
                        _options.polyline.material.outlineColor=options.polyline.material.outlineColor;
                    }
                    if(typeof options.polyline.material.outlineWidth!=="undefined"){
                        _options.polyline.material.outlineWidth=options.polyline.material.outlineWidth;
                    }
                }
                if(typeof options.polyline.clampToGround==="boolean"){
                    _options.polyline.clampToGround=options.polyline.clampToGround;
                }
                if(typeof options.polyline.zIndex==="boolean"){
                    _options.polyline.zIndex=options.polyline.zIndex;
                }
            }
        }
        let positions=[];
        if(_options.points.length>0){
            for(let i=0;i<_options.points.length;i++){
                positions.push(_options.timeInterval*i);
                positions.push(_options.points[i].lon||_options.points[i].x||_options.points[i][0]);
                positions.push(_options.points[i].lat||_options.points[i].y||_options.points[i][1]);
                positions.push(_options.points[i].alt||_options.points[i].z||_options.points[i][2]||0);
            }
            _this.lastPoint=_options.points[0];
        }
        _this.multiplier=_options.multiplier;
        _this.viewer.clock.clockRange =_options.ClockRange;
        _this.startTime="2019-12-01T00:00:00Z";
        _this.czml = [
            {
                "id": "document",
                "version": "1.0",
                "clock": {
                    "interval": "2019-12-01T00:00:00Z/2019-12-01T00:00:00Z",
                    "currentTime": "2019-12-01T00:00:00Z",
                    "multiplier": _options.multiplier/100,
                    "range": "CLAMPED"
                }
            },
            {
                "id": "Vehicle",
                "availability": "2019-12-01T00:00:00Z/2019-12-01T00:00:00Z",
                "label": _options.label,
                "model":_options.model,
                "billboard":_options.billboard,
                "orientation": {
                    "velocityReference": "#position"
                },
                "viewFrom": {
                    "cartesian": [0, 0, 1000]
                },
                "properties": {
                    "fuel_remaining": {
                        "epoch": "2019-12-01T00:00:00Z",
                        "number": [
                            0, 0,
                            0, 0
                        ]
                    }
                },
                // "path": {
                //     "material": _options.pathMaterial,
                //     "width": [
                //         {
                //             "interval": "2019-12-01T00:00:00Z/2019-12-06T00:00:00Z",
                //             "number": _options.pathWidth
                //         }
                //     ],
                //     "show": [
                //         {
                //             "interval": "2019-12-01T00:00:00Z/2019-12-06T00:00:00Z",
                //             "boolean": true
                //         }
                //     ],
                //     "leadTime" : 10,
                //     // "trailTime" : 1000,
                //     "resolution" : 5
                // },
                "position": {
                    // "interpolationAlgorithm": "LAGRANGE",
                    // "interpolationDegree": 1,
                    "epoch": "2019-12-01T00:00:00Z",
                    "cartographicDegrees":positions
                }
            }
        ];
        _this.positionProperty=null;
        _this.dataSource = new Cesium.CzmlDataSource();
        _this.roadline = _this.viewer.dataSources.add(_this.dataSource);
        _this.trackedEntity=null;
        _this.dataSource.process(_this.czml).then(function (ds) {
            _this.trackedEntity=ds.entities.getById('Vehicle');
             _this.viewer.trackedEntity = ds.entities.getById('Vehicle');
            _this.positionProperty=_this.trackedEntity.position;
        });


        if(_options.enableScan===true){
            _this._scanOptions={
                radius:100,
                scanColor:new Cesium.Color(0.588,1,1,1),
                duration:30
            }
            if(typeof scanOptions!=="undefined"){
                if(typeof scanOptions.radius==="number"){
                    _this._scanOptions.radius=scanOptions.radius;
                }
                if(typeof scanOptions.scanColor!=="undefined"){
                    _this._scanOptions.scanColor=scanOptions.scanColor;
                }
                if(typeof scanOptions.duration==="number"){
                    _this._scanOptions.duration=scanOptions.duration;
                }
            }
            _this.scan=Scan.add([positions[1],positions[2],positions[3]],_this._scanOptions)

        }

        _this.polylinePositions=[positions[1],positions[2]];
        let cartesianArray=new Array();
        //画一条polyline
        this.viewer.entities.add({
            polyline : {
                positions :new Cesium.CallbackProperty(function () {
                    return cartesianArray;
                },false),
                width : _options.polyline.width,
                material :_options.polyline.material,
                clampToGround :_options.polyline.clampToGround,
                zIndex:_options.polyline.zIndex
            }
        });
        let lasttime=null;
        _this.viewer.scene.preRender.addEventListener(function (clock) {
                if (_this.viewer.clock.currentTime + "" !== lasttime + "") {
                    if (_this.trackedEntity !== null) {
                        let position = _this.trackedEntity.position.getValue(_this.viewer.clock.currentTime);
                        if (position !== undefined) {
                            cartesianArray.push(position)
                            // _this.update(_this.scan, position);
                            // label.position=position;
                        }
                    }
                    lasttime = _this.viewer.clock.currentTime;
                }
            }
        );
    }
    /**
     *
     * @param time 时间间隔
     * @param point []
     * @param type warning/offline/normal
     * @param message 小车显示的信息
     */
    updatePosition (time,position, type, message) {
        const _this = this;
        let tracked=true;
        //计算两个点之间的距离
        if(_this.lastPoint!==undefined){

            let lastCartesian=Cesium.Cartesian3.fromDegrees(_this.lastPoint.x,_this.lastPoint.y,_this.lastPoint.z);
            let positionCartesian=Cesium.Cartesian3.fromDegrees(position.x,position.y,position.z);
            let d = Cesium.Cartesian3.distance(lastCartesian,positionCartesian);
            //计算速度  time为秒  d为米
            let speed=d*3600/time/1000;  //时速 km/h
            if(speed>=500){
                // _this.viewer.trackedEntity=null;
                tracked=false;
            }

        }
        //加一个时间差值移动扫描面
        if(_this.scan!==null){
            let index = 0;
            let interval = setInterval(function () {
                if (_this.trackedEntity !== null) {
                    let position = _this.trackedEntity.position.getValue(_this.viewer.clock.currentTime);
                    if (position !== undefined) {
                        // const ellipsoid = _this.viewer.scene.globe.ellipsoid;
                        // const cartographic = ellipsoid.cartesianToCartographic(position);
                        // const lat = Cesium.Math.toDegrees(cartographic.latitude);
                        // const lng = Cesium.Math.toDegrees(cartographic.longitude);
                        // const alt = cartographic.height;
                        // _this.update(_this.scan, position);
                    }
                }
                index++;
                if (index >= time*10) {

                    clearInterval(interval);
                }
            }, 100)

        }
        const lon = position[0] || position.x || position.lon;
        const lat = position[1] || position.y || position.lat;
        const height = position[2] || position.z || position.alt || 0;

        //设置结束时间
        _this.viewer.cesiumWidget.clock.shouldAnimate=true;
        let second=time+_this.lastTime;   //时间
        if(second>0){
            const hours = parseInt(second / 3600);
            const surplus = second % 3600;
            const minutes = parseInt(surplus / 60);
            const seconds = surplus % 60;
            let array=_this.startTime.split("T");
            let array2=array[1].split(":")
            let endHours = parseInt(array2[0]) + hours;
            if(endHours<10)
            {
                endHours="0"+endHours;
            }
            let endMinutes = parseInt(array2[1])+minutes;
            if(endMinutes<10)
            {
                endMinutes="0"+endMinutes;
            }
            let endSeconds = parseInt(array2[2].split("Z")[0]) + seconds;
            if(endSeconds<10)
            {
                endSeconds="0"+endSeconds;
            }
            //拼接结束时间字符串
            _this.endTime=array[0]+"T"+endHours+":"+endMinutes+":"+endSeconds+"Z";
            _this.czml[0].clock.interval= _this.startTime + "/" + _this.endTime;
            _this.czml[0].clock.currentTime = _this.viewer.clock.currentTime.toString();
            _this.czml[1].availability= _this.startTime + "/" + _this.endTime;
            // _this.czml[1].path.width[0].interval= _this.startTime + "/" + _this.endTime;
        }
        _this.czml[1].position.cartographicDegrees.push(time+_this.lastTime, position[0]||position.x||position.lon||position.longitude, position[1]||position.y||position.lat||position.latitude, position.height||position[2]||position.z||position.alt||0.1);// 赋值当前最新行驶路线
        // _this.czml[0].clock.currentTime = _this.viewer.clock.currentTime.toString(); // 修改当前时间，防止从头重新开始执行
        _this.czml[0].clock.multiplier=_this.multiplier;
        if(message!==undefined&& _this.czml[1].label.text !== message){
            _this.czml[1].label.text = message;
        }
        if(typeof type!=="undefined"){
            if (type == "warning"&&_this.czml[1].billboard.image !== vehicle_warning) {
                _this.czml[1].billboard.image = vehicle_warning;
            }else if (type == "offline"&&_this.czml[1].billboard.image !== vehicle_offline) {
                _this.czml[1].billboard.image = vehicle_offline;
            }else if(type == "normal"&&_this.czml[1].billboard.image !== vehicle_normal){
                _this.czml[1].billboard.image = vehicle_normal;
            }
        }

        _this.dataSource.process(_this.czml).then(function (ds) {
            // _this.viewer.trackedEntity = ds.entities.getById('Vehicle');
            // _this.viewer.camera.roll=0;
            // console.log(_this.currentEntity.position.getValue(_this.viewer.clock.currentTime));
        });
        // _this.rightTime=_this.viewer.clock.currentTime;
        _this.lastTime +=time;
        _this.timeInterval=time;
        _this.lastPoint=position;
        // this.update(_this.scan,[lon,lat,height])
    }

    cancel () {
        const _this = this;
        if (typeof _this.roadline !== "undefined") {
            _this.viewer.dataSources.remove(_this.dataSource,true);
            if(_this.scan!==null&&_this.scan!==undefined){
                Scan.delete(_this.scan);
            }
        }
    }
    //取消跟随
    cancelTracked(){
        this.viewer.trackedEntity=null;
    }
    //跟随
    tracked(){
        this.viewer.trackedEntity=this.trackedEntity;
    }
    update(scan,center){
        const _this = this;
        // const lon = center[0];
        // const lat = center[1];
        // const cartographicCenter = new Cesium.Cartographic(Cesium.Math.toRadians(lon), Cesium.Math.toRadians(lat), 0);
        // const _Cartesian3Center = Cesium.Cartographic.toCartesian(cartographicCenter);
        const _Cartesian4Center = new Cesium.Cartesian4(center.x, center.y, center.z, 1);
        let _scratchCartesian4Center=new Cesium.Matrix4();
        Cesium.Matrix4.multiplyByVector(_this.viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
        // console.log(Cesium.Matrix4.multiplyByVector(_this.viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center));
        // Cartesian4 {x: -0.6641702325234775, y: 0.25737079593454837, z: -999.9986829012632, w: 1}
        // debugger
        scan._uniforms.u_scanCenterEC = _scratchCartesian4Center;
    }

    on(fn){
        const _this=this;
        let lasttime=null;
        let lastposition=null;

        _this.viewer.scene.preRender.addEventListener(function (clock) {
                if (_this.viewer.clock.currentTime + "" !== lasttime + "") {
                    if (_this.trackedEntity !== null) {
                        let position = _this.trackedEntity.position.getValue(_this.viewer.clock.currentTime);
                        if (position !== undefined) {
                            const ellipsoid = _this.viewer.scene.globe.ellipsoid;
                            const cartographic = ellipsoid.cartesianToCartographic(position);
                            const lat = Cesium.Math.toDegrees(cartographic.latitude);
                            const lng = Cesium.Math.toDegrees(cartographic.longitude);
                            const alt = cartographic.height;
                            const po = {
                                longitude: lng,
                                latitude: lat,
                                height: alt
                            }
                            lastposition = position
                            fn(po);
                        }
                    }
                    lasttime = _this.viewer.clock.currentTime;
                }
            }
        );
    }

    //更改实时车辆状态
    changeType(option){

        if(option!==undefined){
            if(option.type!==undefined){
                if (type == "warning"&&_this.czml[1].billboard.image !== vehicle_warning) {
                    _this.czml[1].billboard.image = vehicle_warning;
                }else if (type == "offline"&&_this.czml[1].billboard.image !== vehicle_offline) {
                    _this.czml[1].billboard.image = vehicle_offline;
                }else if(type == "normal"&&_this.czml[1].billboard.image !== vehicle_normal){
                    _this.czml[1].billboard.image = vehicle_normal;
                }
            }
            if(option.message!==undefined&& _this.czml[1].label.text !== message){
                _this.czml[1].label.text = message;
            }
        }
    }

}

class CZML {
    constructor (positions, options) {
        const _this = this;
        _this.viewer=viewer;
        _this.roadline = null;
        const _options = {
            model: {},
            billboard: {
                "image":vehicle_normal,
                "scale": 1,
                "eyeOffset": {
                    "cartesian": [0.0, 0.0, -10.0]
                },
            },
            point: {},
            pathMaterial: {
                "polylineOutline": {
                    "color": {
                        "rgba": [255, 0, 255, 255]
                    },
                    "outlineColor": {
                        "rgba": [0, 255, 255, 255]
                    },
                    "outlineWidth": 5
                }
            },
            startTime: "2012-08-04T10:00:00Z",
            endTime:null,
            currentTime: "2012-08-04T10:00:00Z",
            multiplier: 10,
            // entityId: "",
            pointInterval: 1,
            startInterval:0,
            timecount:1000
        }
        if(typeof options!=="undefined"){
            if(typeof options.model!=="undefined")
            {
                _options.model=options.model;
            }
            if(typeof options.billboard!=="undefined")
            {
                _options.billboard=options.billboard;
            }
            if(typeof options.point!=="undefined")
            {
                _options.point=options.point;
            }
            if(typeof options.pathMaterial!=="undefined")
            {
                _options.pathMaterial=options.pathMaterial;
            }
            if(typeof options.startTime!=="undefined")
            {
                _options.startTime=options.startTime;
            }
            if(typeof options.endTime!=="undefined")
            {
                _options.endTime=options.endTime;
            }
            if(typeof options.currentTime!=="undefined")
            {
                _options.currentTime=options.currentTime;
            }
            if(typeof options.multiplier!=="undefined")
            {
                _options.multiplier=options.multiplier;
            }
            if(typeof options.pointInterval!=="undefined")
            {
                _options.pointInterval=options.pointInterval;
            }
            if(typeof options.startInterval!=="undefined")
            {
                _options.startInterval=options.startInterval;
            }
            if(typeof options.timecount!=="undefined")
            {
                _options.timecount=options.timecount;
            }
        }
        if(_options.endTime==null){
            const timelength = _options.timecount * _options.pointInterval+100;  //计算时间轴长度 秒数
            const days=parseInt(timelength /86400);
            let surplus =timelength % 3600;
            const hours = parseInt(surplus / 3600);
            surplus = timelength % 3600;
            const minutes = parseInt(surplus / 60);
            const seconds = surplus % 60;
            let array=_options.startTime.split("T");
            let array2=array[1].split(":")
            let endHours = parseInt(array2[0]) + hours;
            if(endHours<10)
            {
                endHours="0"+endHours;
            }
            let endMinutes = parseInt(array2[1])+minutes;
            if(endMinutes<10)
            {
                endMinutes="0"+endMinutes;
            }
            let endSeconds = parseInt(array2[2].split("Z")[0]) + seconds;
            if(endSeconds<10)
            {
                endSeconds="0"+endSeconds;
            }
            //拼接结束时间字符串
            _options.endTime=array[0]+"T"+endHours+":"+endMinutes+":"+endSeconds+"Z";
            // console.log(_options.endTime,"6666666666666")
        }
        const cartographicDegrees = [];
        let tagString = "";
        if (positions.length > 0) {
            for (let i = 0; i < positions.length; i++) {
                const point = positions[i];
                const interval = _options.pointInterval * i+_options.startInterval;
                const lon = point.lon || point[0]||point.x;
                const lat = point.lat || point[1]||point.y;
                const height = point.height || point[2] || 0||point.z;
                cartographicDegrees.push(interval);
                cartographicDegrees.push(lon);
                cartographicDegrees.push(lat);
                cartographicDegrees.push(height);
            }
        }
        _this.czml = [
            {
                "id" : "document",
                "name" : "CZML Path",
                "version": "1.0",
                "clock": {
                    "interval": _options.startTime + "/" + _options.endTime,
                    "currentTime": _options.currentTime,
                    "multiplier": _options.multiplier
                }
            }, {
                "id": "entityId",
                "availability": _options.startTime + "/" + _options.endTime,
                "path": {
                    "material": _options.pathMaterial,
                    "width": 8,
                    "leadTime": 10,
                    "trailTime": 1000,
                    "resolution": 5
                },
                "billboard": _options.billboard,
                "point": _options.point,
                "label": _options.label,
                "model": _options.model,
                "position": {
                    "epoch": _options.startTime,
                    "cartographicDegrees": cartographicDegrees
                }
            }
        ];
       return _this.czml;
    }
}

export {CzmlLine, CZML};


