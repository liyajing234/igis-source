import {Cesium} from "./Unit.js"
import CesiumNavigation from "cesium-navigation-es6"
// require("../IGisTools/navigation.js")
class Compass {
    /**
     *
     * @param viewer
     * @param options{defaultResetView,enableCompass,enableZoomControls,enableDistanceLegend,enableCompassOurerRing}
     * @defaultResetView 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和 Cesium.Rectangle.
     * @enableCompass 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
     * @enableZoomControls 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
     * @enableDistanceLegend 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
     * @enableCompassOuterRing 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
     * @class 罗盘样式
     */
    constructor(viewer,options) {
        let _this=this;
        _this.viewer=viewer;
        let _options={};
        _options.enableCompass = true;
        _options.enableZoomControls = true;
        _options.enableDistanceLegend = true;
        _options.enableCompassOuterRing = true;
        if(typeof options!=="undefined"){
            if(typeof options.defaultResetView!="undefined"){
                if(options.defaultResetView.length==3){
                    let lon=options.defaultResetView.lon||options.defaultResetView[0];
                    let lat=options.defaultResetView.lat||options.defaultResetView[1];
                    let alt=options.defaultResetView.alt||options.defaultResetView[2];
                    _options.defaultResetView=new Cesium.Cartographic(lon,lat,alt);
                }
                if(options.defaultResetView.length==4){
                    let west=options.defaultResetView.west||options.defaultResetView[0];
                    let south=options.defaultResetView.south||options.defaultResetView[1];
                    let east=options.defaultResetView.east||options.defaultResetView[2];
                    let north=options.defaultResetView.north||options.defaultResetView[3];

                    _options.defaultResetView=new Cesium.Rectangle(west,south,east,north);
                }
            }
            if(typeof (options.enableCompass)==="boolean"){
                _options.enableCompass=options.enableCompass;
            }
            if(typeof (options.enableZoomControls)==="boolean"){
                _options.enableZoomControls=options.enableZoomControls;
            }
            if(typeof (options.enableDistanceLegend)==="boolean"){
                _options.enableDistanceLegend=options.enableDistanceLegend
            }
            if(typeof (options.enableCompassOuterRing)==="boolean"){
                _options.enableCompassOuterRing=options.enableCompassOuterRing
            }
            if(typeof options.class!="undefined"){
                //修改罗盘样式
            }
        }

        // _this.viewer.extend(Cesium.viewerCesiumNavigationMixin, _options);
        CesiumNavigation(viewer,_options);
    }
};
export {Compass};