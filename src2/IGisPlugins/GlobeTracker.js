import {GlobeBufferLineDrawer} from "./GlobeBufferLineDrawer.js";
import {GlobeCircleDrawer} from "./GlobeCircleDrawer.js";
import {GlobePointDrawer} from "./GlobePointDrawer.js";
import {GlobeTooltip} from "./GlobeTooltip.js";
import {GlobeRectangleDrawer} from "./GlobeRectangleDrawer.js";
import {GlobePolylineStickMeasure} from "./GlobePolylineStickMeasure.js";
import {GlobePolylineSpaceMeasure} from "./GlobePolylineSpaceMeasure.js";
import {GlobePolylineMeasure} from "./GlobePolylineMeasure.js";
import {GlobePolylineDrawer} from "./GlobePolylineDrawer.js";
import {GlobePolygonMeasure} from "./GlobePolygonMeasure.js";
import {GlobePolygonDrawer} from "./GlobePolygonDrawer.js";;
import {GlobePointMeasure} from "./GlobePointMeasure.js";
import {PlotStraightArrowDrawer} from "./PlotStraightArrowDrawer.js";
import {PlotPincerArrowDrawer} from "./PlotPincerArrowDrawer.js";
import {PlotAttackArrowDrawer} from "./PlotAttackArrowDrawer.js";

class GlobeTracker {
    constructor() {
      
        this.ctrArr = [];
        this.pointDrawer = null;
        this.polylineDrawer = null;
        this.polygonDrawer = null;
        this.circleDrawer = null;
        this.rectDrawer = null;
        this.bufferLineDrawer = null;
        this.straightArrowDrawer = null;
        this.attackArrowDrawer = null;
        this.pincerArrowDrawer = null;
        this.posMeasure = null;
        this.spaceDisMeasure = null;
        this.stickDisMeasure = null;
        this.areaMeasure = null;

        

        this.pointDrawer = new GlobePointDrawer();
        this.ctrArr.push(this.pointDrawer);

        this.polylineDrawer = new GlobePolylineDrawer();
        this.ctrArr.push(this.polylineDrawer);

        this.polygonDrawer = new GlobePolygonDrawer();
        this.ctrArr.push(this.polygonDrawer);

        this.circleDrawer = new GlobeCircleDrawer();
        this.ctrArr.push(this.circleDrawer);

        this.rectDrawer = new GlobeRectangleDrawer();
        this.ctrArr.push(this.rectDrawer);

        this.bufferLineDrawer = new GlobeBufferLineDrawer();
        this.ctrArr.push(this.bufferLineDrawer);

        this.straightArrowDrawer = new PlotStraightArrowDrawer();
        this.ctrArr.push(this.straightArrowDrawer);

        this.attackArrowDrawer = new PlotAttackArrowDrawer();
        this.ctrArr.push(this.attackArrowDrawer);

        this.pincerArrowDrawer = new PlotPincerArrowDrawer();
        this.ctrArr.push(this.pincerArrowDrawer);

        this.posMeasure = new GlobePointMeasure();
        this.ctrArr.push(this.posMeasure);

        this.spaceDisMeasure = new GlobePolylineSpaceMeasure();
        this.ctrArr.push(this.spaceDisMeasure);

        this.stickDisMeasure = new GlobePolylineStickMeasure();
        this.ctrArr.push(this.stickDisMeasure);

        this.areaMeasure = new GlobePolygonMeasure();
        this.ctrArr.push(this.areaMeasure);
    }
    clear(){
        let _this = this;
        for (let i = 0; i < _this.ctrArr.length; i++) {
            try {
                let ctr = _this.ctrArr[i];
                if (ctr.clear) {
                    ctr.clear();
                }
            } catch (err) {
                console.log("发生未知出错：GlobeTracker.clear");
            }
        }
    };
    trackPoint(okHandler, cancelHandler) {
        let _this = this;
        _this.clear();
        if (_this.pointDrawer == null) {
            _this.pointDrawer = new GlobePointDrawer();
            _this.ctrArr.push(_this.pointDrawer);
        }
        _this.pointDrawer.startDrawPoint(okHandler, cancelHandler);
    };
    trackPolyline(okHandler, cancelHandler) {
        let _this = this;
        _this.clear();
        if (_this.polylineDrawer == null) {
            _this.polylineDrawer = new GlobePolylineDrawer();
            _this.ctrArr.push(_this.polylineDrawer);
        }
        _this.polylineDrawer.startDrawPolyline(okHandler, cancelHandler);
    };
    trackPolygon(okHandler, cancelHandler) {
        let _this = this;
        _this.clear();
        if (_this.polygonDrawer == null) {
            _this.polygonDrawer = new GlobePolygonDrawer();
            _this.ctrArr.push(_this.polygonDrawer);
        }
        _this.polygonDrawer.startDrawPolygon(okHandler, cancelHandler);
    };
    trackCircle(okHandler, cancelHandler) {
        let _this = this;
        _this.clear();
        if (_this.circleDrawer == null) {
            _this.circleDrawer = new GlobeCircleDrawer();
            _this.ctrArr.push(_this.circleDrawer);
        }
        _this.circleDrawer.startDrawCircle(okHandler, cancelHandler);
    };
    trackRectangle(okHandler, cancelHandler) {
        let _this = this;
        if (_this.rectDrawer == null) {
            _this.rectDrawer = new GlobeRectangleDrawer();
            _this.ctrArr.push(_this.rectDrawer);
        }
        _this.clear();
        _this.rectDrawer.startDrawRectangle(okHandler, cancelHandler);
    };
    trackBufferLine(okHandler, cancelHandler) {
        let _this = this;
        if (_this.bufferLineDrawer == null) {
            _this.bufferLineDrawer = new GlobeBufferLineDrawer();
            _this.ctrArr.push(_this.bufferLineDrawer);
        }
        _this.clear();
        _this.bufferLineDrawer.startDrawBufferLine(okHandler, cancelHandler);
    };
    trackStraightArrow(okHandler, cancelHandler) {
        let _this = this;
        _this.clear();
        if (_this.straightArrowDrawer == null) {
            _this.straightArrowDrawer = new PlotStraightArrowDrawer();
            _this.ctrArr.push(_this.straightArrowDrawer);
        }
        _this.straightArrowDrawer.startDrawStraightArrow(okHandler, cancelHandler);
    };
    trackAttackArrow(okHandler, cancelHandler) {
        let _this = this;
        _this.clear();
        if (_this.attackArrowDrawer == null) {
            _this.attackArrowDrawer = new PlotAttackArrowDrawer();
            _this.ctrArr.push(_this.attackArrowDrawer);
        }
        _this.attackArrowDrawer.startDrawAttackArrow(okHandler, cancelHandler);
    };
    trackPincerArrow(okHandler, cancelHandler) {
        let _this = this;
        _this.clear();
        if (_this.pincerArrowDrawer == null) {
            _this.pincerArrowDrawer = new PlotPincerArrowDrawer();
            _this.ctrArr.push(_this.pincerArrowDrawer);
        }
        _this.pincerArrowDrawer.startDrawPincerArrow(okHandler, cancelHandler);
    };
    pickPosition(okHandler, cancelHandler) {
        let _this = this;
        _this.clear();
        if (_this.posMeasure == null) {
            _this.posMeasure = new GlobePointMeasure();
            _this.ctrArr.push(_this.posMeasure);
        }
        _this.posMeasure.startDrawPoint(okHandler, cancelHandler);
    };
    pickSpaceDistance(okHandler, cancelHandler) {
        let _this = this;
        _this.clear();
        if (_this.spaceDisMeasure == null) {
            _this.spaceDisMeasure = new GlobePolylineSpaceMeasure();
            _this.ctrArr.push(_this.spaceDisMeasure);
        }
        _this.spaceDisMeasure.startDrawPolyline(okHandler, cancelHandler);
    };
    pickStickDistance(okHandler, cancelHandler) {
        let _this = this;
        _this.clear();
        if (_this.stickDisMeasure == null) {
            _this.stickDisMeasure = new GlobePolylineSpaceMeasure();
            _this.ctrArr.push(_this.stickDisMeasure);
        }
        _this.stickDisMeasure.startDrawPolyline(okHandler, cancelHandler);
    };
    pickArea(okHandler, cancelHandler) {
        let _this = this;
        _this.clear();
        if (_this.areaMeasure == null) {
            _this.areaMeasure = new GlobePolygonMeasure();
            _this.ctrArr.push(_this.areaMeasure);
        }
        _this.areaMeasure.startDrawPolygon(okHandler, cancelHandler);
    };
}
export {GlobeTracker};

