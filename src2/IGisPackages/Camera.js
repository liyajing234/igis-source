import {viewer} from "./Viewer.js";
const Cesium=require("cesium/Cesium");
class Camera {
    /**
     *
     * @param options {position{lon,lat,alt},orientation{heading,pitch,roll}}
     */
    flyTo(options){
        let lon=116.391134;
        let lat= 39.901334;
        let alt=800;
        let _options={
            destination:Cesium.Cartesian3.fromDegrees(lon,lat,alt),
            orientation:{
                heading:0,
                pitch:Cesium.Math.toRadians(-25),
                roll:0
            }
        };
        if(typeof options!=="undefined"){
            if(typeof options.orientation!=="undefined"){
                lon=options.position.lon||options.position[0];
                lat=options.position.lat||options.position[1];
                alt=options.position.alt||options.position[2];
                _options.destination=Cesium.Cartesian3.fromDegrees(lon,lat,alt);
            }
            if(typeof options.orientation!=="undefined"){
                _options.orientation.heading=options.orientation.heading||options.orientation[0];
                _options.orientation.pitch=options.orientation.lat||options.orientation[1];
                _options.orientation.roll=options.orientation.roll||options.orientation[2];
            }
        }
        viewer.camera.flyTo({
            destination: _options.destination,
            orientation: _options.orientation
        })

    };
    setView(options){
        let lon=116.391134;
        let lat= 39.901334;
        let alt=800;
        let _options={
            destination:Cesium.Cartesian3.fromDegrees(lon,lat,alt),
            orientation:{
                heading:0,
                pitch:Cesium.Math.toRadians(-25),
                roll:0
            }
        };
        if(typeof options!=="undefined"){
            if(typeof options.orientation!=="undefined"){
                lon=options.position.lon||options.position[0];
                lat=options.position.lat||options.position[1];
                alt=options.position.alt||options.position[2];
                _options.destination=Cesium.Cartesian3.fromDegrees(lon,lat,alt);
            }
            if(typeof options.orientation!=="undefined"){
                _options.orientation.heading=options.orientation.heading||options.orientation[0];
                _options.orientation.pitch=options.orientation.lat||options.orientation[1];
                _options.orientation.roll=options.orientation.roll||options.orientation[2];
            }
        }
        viewer.camera.setView({
            destination: _options.destination,
            orientation: _options.orientation
        })

    };

    //切换视角 第一视角
    /**
     * 设置一个贴地视角 禁用缩放 鼠标左键拖动为绕中心点旋转
     * @param target 对象/数组 经纬度 可不填 有默认
     * @param offset 对象/数组 HeadingPitchRange 可不填 有默认
     */
    changeVisualangle(target,offset){
        let _this=this;
        let _target=new Cesium.Cartesian3(-2177476.834841603,4388246.192718154,4070732.69623296);
        let _offset=new Cesium.HeadingPitchRange(0,0,7.6552472593339305);
        if(typeof target!="undefined"){
            let lon=target.lon||target[0];
            let lat=target.lat||target[1];
            let alt=target.alt||target[2];
            _target=new Cesium.Cartesian3.fromDegrees(lon,lat,alt);
        }
        if(typeof offset!="undefined"){
            let heading=offset.heading||offset[0];
            let pitch=offset.pitch||offset[1];
            let range=offset.range||offset[2];
            _offset=new Cesium.HeadingPitchRange(heading,pitch,roll);
        }
        viewer.scene.camera.lookAt(_target,_offset);
        viewer.scene.screenSpaceCameraController.enableZoom = false;
    };

    /**
     * 清除贴地视角锁定 鼠标左键拖动为平移 打开缩放功能
     */
    clearVisualangle(){
        let _this=this;
        viewer.scene.screenSpaceCameraController.enableZoom = true;
        viewer.scene.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
    };
}
export {Camera};