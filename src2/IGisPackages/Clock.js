import {viewer} from "./Viewer.js";
const Cesium=require("cesium/Cesium");
import {IGis} from "../index";

class Clock {
    /**
     * 用于跟踪模拟时间的简单时钟。
     * @param options
     * @startTime JulianDate 时钟的开始时间。
     * @endTime JulianDate 时钟的停止时间。
     * @currentTime JulianData 当前时间。
     * @multiplier number 1.0 确定调用Clock时要提前多少时间，负值允许向后前进。
     * @clockRange ClockRange ClockRange.UNBOUNDED 确定在开始时间或结束时间到达时时钟应如何表现。
     * @canAnimate boolean true 指示是否可以提前时间。例如，如果正在缓冲数据，则可能为false。当canAnimate和shouldAnimate都为true时，时钟才会走。
     * @shouldAnimate boolean true 指示是否可以提前时间。当canAnimate和shouldAnimate都为true时，时钟才会走。
     */
    constructor(options) {
        let _options={
            startTime:Cesium.JulianDate.fromDate(new Date()),
            stopTime:Cesium.JulianDate.fromDate(new Date(Date.parse(new Date()) + 86400000)),
            currentTime:Cesium.JulianDate.fromDate(new Date()),
            multiplier:1,
            clockRange:Cesium.ClockRange.LOOP_STOP,
            canAnimate:true,
            shouldAnimate:true
        }
        if(typeof options!=="undefined"){
            if(typeof options.startTime!=="undefined"){
                _options.startTime=options.startTime;
            }
            if(typeof options.stopTime!=="undefined"){
                _options.stopTime=options.stopTime;
            }
            if(typeof options.currentTime!=="undefined"){
                _options.currentTime=options.currentTime;
            }
            if(typeof options.multiplier!=="undefined"){
                _options.multiplier=options.multiplier;
            }
            if(typeof options.clockRange==="boolean"){
                _options.clockRange=options.clockRange;
            }
            if(typeof options.canAnimate==="boolean"){
                _options.canAnimate=options.canAnimate;
            }
            if(typeof options.shouldAnimate==="boolean"){
                _options.shouldAnimate=options.shouldAnimate;
            }
        }
        let clock=new Cesium.Clock(_options);
    };
}
export {Clock};