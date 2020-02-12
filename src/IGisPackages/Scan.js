import {viewer} from "./Viewer.js";
import {Cesium} from "./Unit.js";
import {Point,Label}  from "./Tags.js";
const scanList=[];
const scanTagList=[];
class Scan {
    constructor (){
    }
    static get viewer(){
        return viewer;
    }
    static get scanList(){
        return scanList;
    }
    static set scanList(scan){
        scanList.push(scan);
    }
    /**
     * 添加雷达扫描
     * @param viewer
     * @param cartographicCenter 扫描中心
     * @param radius  扫描半径 米
     * @param scanColor 扫描面颜色
     * @param duration  持续时间 毫秒
     * @constructor
     */
    static AddRadarScanPostStage(viewer, cartographicCenter, radius, scanColor, duration){
        duration=duration*1000;
        const ScanSegmentShader =
            "uniform sampler2D colorTexture;\n" +
            "uniform sampler2D depthTexture;\n" +
            "varying vec2 v_textureCoordinates;\n" +
            "uniform vec4 u_scanCenterEC;\n" +
            "uniform vec3 u_scanPlaneNormalEC;\n" +
            "uniform vec3 u_scanLineNormalEC;\n" +
            "uniform float u_radius;\n" +
            "uniform vec4 u_scanColor;\n" +

            "vec4 toEye(in vec2 uv, in float depth)\n" +
            " {\n" +
            " vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));\n" +
            " vec4 posInCamera =czm_inverseProjection * vec4(xy, depth, 1.0);\n" +
            " posInCamera =posInCamera / posInCamera.w;\n" +
            " return posInCamera;\n" +
            " }\n" +

            "bool isPointOnLineRight(in vec3 ptOnLine, in vec3 lineNormal, in vec3 testPt)\n" +
            "{\n" +
            "vec3 v01 = testPt - ptOnLine;\n" +
            "normalize(v01);\n" +
            "vec3 temp = cross(v01, lineNormal);\n" +
            "float d = dot(temp, u_scanPlaneNormalEC);\n" +
            "return d > 0.5;\n" +
            "}\n" +

            "vec3 pointProjectOnPlane(in vec3 planeNormal, in vec3 planeOrigin, in vec3 point)\n" +
            "{\n" +
            "vec3 v01 = point -planeOrigin;\n" +
            "float d = dot(planeNormal, v01) ;\n" +
            "return (point - planeNormal * d);\n" +
            "}\n" +

            "float distancePointToLine(in vec3 ptOnLine, in vec3 lineNormal, in vec3 testPt)\n" +
            "{\n" +
            "vec3 tempPt = pointProjectOnPlane(lineNormal, ptOnLine, testPt);\n" +
            "return length(tempPt - ptOnLine);\n" +
            "}\n" +

            "float getDepth(in vec4 depth)\n" +
            "{\n" +
            "float z_window = czm_unpackDepth(depth);\n" +
            "z_window = czm_reverseLogDepth(z_window);\n" +
            "float n_range = czm_depthRange.near;\n" +
            "float f_range = czm_depthRange.far;\n" +
            "return (2.0 * z_window - n_range - f_range) / (f_range - n_range);\n" +
            "}\n" +

            "void main()\n" +
            "{\n" +
            "gl_FragColor = texture2D(colorTexture, v_textureCoordinates);\n" +
            "float depth = getDepth( texture2D(depthTexture, v_textureCoordinates));\n" +
            "vec4 viewPos = toEye(v_textureCoordinates, depth);\n" +
            "vec3 prjOnPlane = pointProjectOnPlane(u_scanPlaneNormalEC.xyz, u_scanCenterEC.xyz, viewPos.xyz);\n" +
            "float dis = length(prjOnPlane.xyz - u_scanCenterEC.xyz);\n" +
            "float twou_radius = u_radius * 2.0;\n" +
            "if(dis < u_radius)\n" +
            "{\n" +
            "float f0 = 1.0 -abs(u_radius - dis) / u_radius;\n" +
            "f0 = pow(f0, 64.0);\n" +
            "vec3 lineEndPt = vec3(u_scanCenterEC.xyz) + u_scanLineNormalEC * u_radius;\n" +
            "float f = 0.0;\n" +
            "if(isPointOnLineRight(u_scanCenterEC.xyz, u_scanLineNormalEC.xyz, prjOnPlane.xyz))\n" +
            "{\n" +
            "float dis1= length(prjOnPlane.xyz - lineEndPt);\n" +
            "f = abs(twou_radius -dis1) / twou_radius;\n" +
            "f = pow(f, 3.0);\n" +
            "}\n" +
            "gl_FragColor = mix(gl_FragColor, u_scanColor, f + f0);\n" +
            "}\n" +
            "}\n";

        let _Cartesian3Center = Cesium.Cartographic.toCartesian(cartographicCenter);
        let _Cartesian4Center = new Cesium.Cartesian4(_Cartesian3Center.x, _Cartesian3Center.y, _Cartesian3Center.z, 1);

        let _CartographicCenter1 = new Cesium.Cartographic(cartographicCenter.longitude, cartographicCenter.latitude, cartographicCenter.height + 500);
        let _Cartesian3Center1 = Cesium.Cartographic.toCartesian(_CartographicCenter1);
        let _Cartesian4Center1 = new Cesium.Cartesian4(_Cartesian3Center1.x, _Cartesian3Center1.y, _Cartesian3Center1.z, 1);

        let _CartographicCenter2 = new Cesium.Cartographic(cartographicCenter.longitude + Cesium.Math.toRadians(0.001), cartographicCenter.latitude, cartographicCenter.height);
        let _Cartesian3Center2 = Cesium.Cartographic.toCartesian(_CartographicCenter2);
        let _Cartesian4Center2 = new Cesium.Cartesian4(_Cartesian3Center2.x, _Cartesian3Center2.y, _Cartesian3Center2.z, 1);
        let _RotateQ = new Cesium.Quaternion();
        let _RotateM = new Cesium.Matrix3();

        let _time = (new Date()).getTime();

        let _scratchCartesian4Center = new Cesium.Cartesian4();
        let _scratchCartesian4Center1 = new Cesium.Cartesian4();
        let _scratchCartesian4Center2 = new Cesium.Cartesian4();
        let _scratchCartesian3Normal = new Cesium.Cartesian3();
        let _scratchCartesian3Normal1 = new Cesium.Cartesian3();
        // console.log(Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center));
        let ScanPostStage = new Cesium.PostProcessStage({
            fragmentShader: ScanSegmentShader,
            uniforms: {
                // u_scanCenterEC: function () {
                //     return Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
                // },
                u_scanCenterEC: Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center),
                u_scanPlaneNormalEC: function () {
                    var temp = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
                    var temp1 = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center1, _scratchCartesian4Center1);
                    _scratchCartesian3Normal.x = temp1.x - temp.x;
                    _scratchCartesian3Normal.y = temp1.y - temp.y;
                    _scratchCartesian3Normal.z = temp1.z - temp.z;

                    Cesium.Cartesian3.normalize(_scratchCartesian3Normal, _scratchCartesian3Normal);
                    return _scratchCartesian3Normal;
                },
                u_radius: radius,
                u_scanLineNormalEC: function () {
                    let temp = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
                    let temp1 = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center1, _scratchCartesian4Center1);
                    let temp2 = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center2, _scratchCartesian4Center2);

                    _scratchCartesian3Normal.x = temp1.x - temp.x;
                    _scratchCartesian3Normal.y = temp1.y - temp.y;
                    _scratchCartesian3Normal.z = temp1.z - temp.z;

                    Cesium.Cartesian3.normalize(_scratchCartesian3Normal, _scratchCartesian3Normal);

                    _scratchCartesian3Normal1.x = temp2.x - temp.x;
                    _scratchCartesian3Normal1.y = temp2.y - temp.y;
                    _scratchCartesian3Normal1.z = temp2.z - temp.z;

                    let tempTime = (((new Date()).getTime() - _time) % duration) / duration;
                    Cesium.Quaternion.fromAxisAngle(_scratchCartesian3Normal, tempTime * Cesium.Math.PI * 2, _RotateQ);
                    Cesium.Matrix3.fromQuaternion(_RotateQ, _RotateM);
                    Cesium.Matrix3.multiplyByVector(_RotateM, _scratchCartesian3Normal1, _scratchCartesian3Normal1);
                    Cesium.Cartesian3.normalize(_scratchCartesian3Normal1, _scratchCartesian3Normal1);
                    return _scratchCartesian3Normal1;
                },
                u_scanColor: scanColor
            }
        });

        const a=viewer.scene.postProcessStages.add(ScanPostStage);

        return ScanPostStage;
    }

    static AddCircleScanPostStage(viewer, cartographicCenter, maxRadius, scanColor, duration) {
        duration=duration*1000;
        const ScanSegmentShader =
            "uniform sampler2D colorTexture;\n" +
            "uniform sampler2D depthTexture;\n" +
            "varying vec2 v_textureCoordinates;\n" +
            "uniform vec4 u_scanCenterEC;\n" +
            "uniform vec3 u_scanPlaneNormalEC;\n" +
            "uniform float u_radius;\n" +
            "uniform vec4 u_scanColor;\n" +

            "vec4 toEye(in vec2 uv, in float depth)\n" +
            " {\n" +
            " vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));\n" +
            " vec4 posInCamera =czm_inverseProjection * vec4(xy, depth, 1.0);\n" +
            " posInCamera =posInCamera / posInCamera.w;\n" +
            " return posInCamera;\n" +
            " }\n" +

            "vec3 pointProjectOnPlane(in vec3 planeNormal, in vec3 planeOrigin, in vec3 point)\n" +
            "{\n" +
            "vec3 v01 = point -planeOrigin;\n" +
            "float d = dot(planeNormal, v01) ;\n" +
            "return (point - planeNormal * d);\n" +
            "}\n" +

            "float getDepth(in vec4 depth)\n" +
            "{\n" +
            "float z_window = czm_unpackDepth(depth);\n" +
            "z_window = czm_reverseLogDepth(z_window);\n" +
            "float n_range = czm_depthRange.near;\n" +
            "float f_range = czm_depthRange.far;\n" +
            "return (2.0 * z_window - n_range - f_range) / (f_range - n_range);\n" +
            "}\n" +

            "void main()\n" +
            "{\n" +
            "gl_FragColor = texture2D(colorTexture, v_textureCoordinates);\n" +
            "float depth = getDepth( texture2D(depthTexture, v_textureCoordinates));\n" +
            "vec4 viewPos = toEye(v_textureCoordinates, depth);\n" +
            "vec3 prjOnPlane = pointProjectOnPlane(u_scanPlaneNormalEC.xyz, u_scanCenterEC.xyz, viewPos.xyz);\n" +
            "float dis = length(prjOnPlane.xyz - u_scanCenterEC.xyz);\n" +
            "if(dis < u_radius)\n" +
            "{\n" +
            "float f = 1.0 -abs(u_radius - dis) / u_radius;\n" +
            "f = pow(f, 4.0);\n" +
            "gl_FragColor = mix(gl_FragColor, u_scanColor, f);\n" +
            "}\n" +
            "}\n";

        const _Cartesian3Center = Cesium.Cartographic.toCartesian(cartographicCenter);
        const _Cartesian4Center = new Cesium.Cartesian4(_Cartesian3Center.x, _Cartesian3Center.y, _Cartesian3Center.z, 1);

        const _CartographicCenter1 = new Cesium.Cartographic(cartographicCenter.longitude, cartographicCenter.latitude, cartographicCenter.height + 500);
        const _Cartesian3Center1 = Cesium.Cartographic.toCartesian(_CartographicCenter1);
        const _Cartesian4Center1 = new Cesium.Cartesian4(_Cartesian3Center1.x, _Cartesian3Center1.y, _Cartesian3Center1.z, 1);

        let _time = (new Date()).getTime();

        const _scratchCartesian4Center = new Cesium.Cartesian4();
        const _scratchCartesian4Center1 = new Cesium.Cartesian4();
        const _scratchCartesian3Normal = new Cesium.Cartesian3();

        const ScanPostStage = new Cesium.PostProcessStage({
            fragmentShader: ScanSegmentShader,
            uniforms: {
                u_scanCenterEC: function () {
                    return Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
                },
                u_scanPlaneNormalEC: function () {
                    var temp = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
                    var temp1 = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center1, _scratchCartesian4Center1);
                    _scratchCartesian3Normal.x = temp1.x - temp.x;
                    _scratchCartesian3Normal.y = temp1.y - temp.y;
                    _scratchCartesian3Normal.z = temp1.z - temp.z;

                    Cesium.Cartesian3.normalize(_scratchCartesian3Normal, _scratchCartesian3Normal);
                    return _scratchCartesian3Normal;
                },
                u_radius: function () {
                    return maxRadius * (((new Date()).getTime() - _time) % duration) / duration;
                },
                u_scanColor: scanColor
            }
        });

        viewer.scene.postProcessStages.add(ScanPostStage);
    }
    /**
     * 添加扫描面
     * @param center 必填 扫描面中心点 数组 经纬度
     * @param radius 可不填 扫描面半径 米 默认1500
     * @param scanColor 可不填 扫描面颜色 数组[r,g,b,a] 默认 [1,0,0,1]
     * @param duration 可不填 扫描一圈所用的时间 毫秒
     */
   static add(center,options){
        const _this=this;
        let _options={
            radius:100,
            scanColor:new Cesium.Color(0.588,1,1,1),
            duration:30
        }
        if(typeof options!=="undefined"){
            if(typeof options.radius==="number"){
                _options.radius=options.radius;
            }
            if(typeof options.scanColor!=="undefined"){
                _options.scanColor=options.scanColor;
            }
            if(typeof options.duration==="number"){
                _options.duration=options.duration;
            }
        }
        const lon=center.lon||center[0];
        const lat=center.lat||center[1];
        _this.viewer.scene.globe.depthTestAgainstTerrain = true;
        const CartographicCenter = new Cesium.Cartographic(Cesium.Math.toRadians(lon), Cesium.Math.toRadians(lat), 0);
        const scanColor = _options.scanClor;
        const scan= _this.AddRadarScanPostStage(_this.viewer, CartographicCenter,_options.radius, _options.scanColor,_options.duration);
        _this.scanList=scan;

        return scan;
    }

    /**
     * 清除扫描面 并以标签的形式展示扫描结果
     * @param pointList 数组 键值对 [{name:"",position:[lon,lat]}] 要展示的扫描结果
     * @param scan
     */
   static delete(scan){
        const _this=this;
        if(typeof scan=="undefined"){
            if(_this.scanList.length>0){
                for(let i=0;i<_this.scanList.length;i++){
                    const scan=_this.scanList[i];
                    _this.viewer.scene.postProcessStages.remove(scan);
                }
            }
        }else {
            _this.viewer.scene.postProcessStages.remove(scan);
        }

    }
    //圆形扫描面
    static addCircleScan(center,options){
        const _this=this;
        let _options={
            maxRadius:100,
            scanColor:new Cesium.Color(0.588,1,1,1),
            duration:5
        }
        if(typeof options!=="undefined"){
            if(typeof options.maxRadius==="number"){
                _options.maxRadius=options.maxRadius;
            }
            if(typeof options.scanColor!=="undefined"){
                _options.scanColor=options.scanColor;
            }
            if(typeof options.duration==="number"){
                _options.duration=options.duration;
            }
        }
        const lon=center.lon||center[0];
        const lat=center.lat||center[1];
        const CartographicCenter = new Cesium.Cartographic(Cesium.Math.toRadians(lon), Cesium.Math.toRadians(lat), 0);
        const circleSpan = this.AddCircleScanPostStage(_this.viewer, CartographicCenter, _options.maxRadius, _options.scanColor, _options.duration);
        _this.scanList=circleSpan;
        return circleSpan;
    }
}

export {Scan}