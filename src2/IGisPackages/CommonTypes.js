const Cesium=require("cesium/Cesium");
class Cartographic {
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
};
class Rectangle {
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

};
class JulianDate {
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

let  ClockRange={
    CLAMPED:Cesium.ClockRange.CLAMPED,
    LOOP_STOP:Cesium.ClockRange.LOOP_STOP,
    UNBOUNDED:Cesium.ClockRange.UNBOUNDED
};
export {Cartographic,Rectangle,JulianDate,ClockRange};