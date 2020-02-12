import {Cesium} from "./Unit.js";
import {viewer} from "./Viewer.js";
class Cartographic extends Cesium.Cartographic{
    /**
     * 通过经度、纬度、高度来定义的位置信息。
     * @param longitude number 0.0 经度，弧度值。
     * @param latitude number 0.0 纬度，弧度值。
     * @param height number 0.0 高度，米。
     * @returns {Cesium.Cartographic}
     */
    constructor(longitude, latitude, height){
        let cartographic=new Cesium.Cartographic(longitude,latitude,height);
        return cartographic;
    }
    static fromCartesian3(cartesian){
        const ellipsoid=viewer.scene.globe.ellipsoid;
        // var cartesian3=new Cesium.cartesian3(x,y,z);
        const cartographic = ellipsoid.cartesianToCartographic(cartesian);
        const lat = Cesium.Math.toDegrees(cartographic.latitude);
        const lng = Cesium.Math.toDegrees(cartographic.longitude);
        const alt = cartographic.height;
        return new Cesium.Cartographic(lng,lat,alt);
    }
};
class Cartesian3 extends Cesium.Cartesian3{
    /**
     * 3D 笛卡尔坐标
     * @param x X组件。
     * @param y Y组件。
     * @param z Z组件。
     */
    constructor (x, y, z){
        let cartesian3=new Cesium.Cartesian3(x, y, z);
        return cartesian3;
    }

    // static fromDegrees (longitude, latitude, height, ellipsoid){
    //     const cartesian=Cesium.Cartesian3.fromDegrees(longitude, latitude, height, ellipsoid);
    //     return cartesian;
    // }
}
class Rectangle extends Cesium.Rectangle{
    /**
     *指定为经度和纬度坐标的二维区域
     * @param west number 0 以弧度为单位的最西经度，范围为[-Pi,Pi]。
     * @param south number 0 以弧度为单位的最南端的纬度，范围为[-Pi/2,Pi/2]。
     * @param east number 0 以弧度为单位的最东经度，范围为[-Pi,Pi]。
     * @param north number 0 以弧度为单位的最北端经度，范围为[-Pi/2,Pi/2]。
     */
    constructor(west, south, east, north) {
        let rectangle=new Cesium.Rectangle(west, south, east, north);
        return rectangle;
    }
    // static center(rectangle){
    //     const center=Cesium.Rectangle.center(rectangle);
    //     return center;
    // }

};
class JulianDate extends Cesium.JulianDate{
    /**
     * 代表天文朱利安日期，它是自4712年1月1日（公元前4713年）正午以來的天数。为了提高精度，此类將日期的整数部分和日期的秒数部分存储在单独的组件中。为了安全进行算数运算并表示seconds秒，日期始终存储在国际原子时间标准中 TimeStandard.TAI。
     * @param julianDayNumber number 0.0 儒略日数，代表整天数，小数日也将得到正确的处理。
     * @param secondsOfDay number 0.0 当前朱利安天数的秒数，小数秒，负秒和大于一天的秒数将被正确处理。
     * @param timeStandard       TimeStandard.UTC      定义前两个参数的时间标准
     * @returns {Cesium.JulianDate}
     */
    constructor(julianDayNumber, secondsOfDay, timeStandard) {
      let JulianDate=new Cesium.JulianDate(julianDayNumber, secondsOfDay, timeStandard);
      return JulianDate;
    }

};
class Color extends Cesium.Color{
    /**
     * 一种颜色，使用红、绿、蓝和alphy值指定，范围从0（无强度）到1.0（全强度）。
     * @param red 红色组件
     * @param green 绿色组件
     * @param blue 蓝色组件
     * @param alpha alphy组件
     * @returns {Cesium.Color}
     */
    constructor (red, green, blue, alpha){
        let color=new Cesium.Color(red, green, blue, alpha);
        return color;
    }
}
class BoundingSphere extends Cesium.BoundingSphere{
    constructor(center,radius){
        let boundingSphere=new Cesium.BoundingSphere(center,radius);
        return boundingSphere;
    }
}
class Ellipsoid extends Cesium.Ellipsoid{
    constructor(x,y,z){
        let ellipsoid=new Cesium.Ellipsoid(x,y,z);
        return ellipsoid;
    }
}
class Math {
    static toDegrees(radians){
        return Cesium.Math.toDegrees(radians);
    }
}

let  ClockRange={
    CLAMPED:Cesium.ClockRange.CLAMPED,
    LOOP_STOP:Cesium.ClockRange.LOOP_STOP,
    UNBOUNDED:Cesium.ClockRange.UNBOUNDED
};
let HorizontalOrigin={
    CENTER:Cesium.HorizontalOrigin.CENTER,
    LEFT:Cesium.HorizontalOrigin.LEFT,
    RIGHT:Cesium.HorizontalOrigin.RIGHT
}
let VerticalOrigin={
    BASELINE:Cesium.VerticalOrigin.BASELINE,
    BOTTOM:Cesium.VerticalOrigin.BOTTOM,
    CENTER:Cesium.VerticalOrigin.CENTER,
    TOP:Cesium.VerticalOrigin.TOP
}
let ScreenSpaceEventType={
    LEFT_CLICK:Cesium.ScreenSpaceEventType.LEFT_CLICK,
    LEFT_DOUBLE_CLICK:Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
    RIGHT_CLICK:Cesium.ScreenSpaceEventType.RIGHT_CLICK,
    MOUSE_MOVE:Cesium.ScreenSpaceEventType.MOUSE_MOVE,
    MIDDLE_CLICK: Cesium.ScreenSpaceEventType.MIDDLE_CLICK,
    MIDDLE_DOWN:Cesium.ScreenSpaceEventType.MIDDLE_DOWN,
    MIDDLE_UP:Cesium.ScreenSpaceEventType.MIDDLE_UP,
    WHEEL:Cesium.ScreenSpaceEventType.WHEEL
}

export {Cartographic,Rectangle,JulianDate,ClockRange,Color,Cartesian3,HorizontalOrigin,VerticalOrigin,ScreenSpaceEventType,Math,Ellipsoid,BoundingSphere};