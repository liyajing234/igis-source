import {viewer} from "./Viewer.js";
import {Cesium} from "./Unit.js";
import FlowEcharts from "../IGisTools/FlowEcharts.js"

class LoadLineBus{
    constructor() {
        let _this=this;
        _this.layerWork=null;
        _this.initlineBus();
    };
    create() {
        this.path = ''
    };

    activate() {
        this.loadData()
    };

    disable() {
        this.layerWork.dispose()
        this.layerWork = null
    };

    loadData() {
        let that = this;
        $.get('http://' + window.location.host + '/OpticalGIS/data/beijing-lines-bus.json', function (data) {
            let hStep = 300 / (data.length - 1);
            let busLines = [].concat.apply([], data.map(function (busLine, idx) {
                let prevPt;
                let points = [];
                for (let i = 0; i < busLine.length; i += 2) {
                    let pt = [busLine[i], busLine[i + 1]];
                    if (i > 0) {
                        pt = [
                            prevPt[0] + pt[0],
                            prevPt[1] + pt[1]
                        ];
                    }
                    prevPt = pt;
                    points.push([pt[0] / 1e4, pt[1] / 1e4]);
                }
                return {
                    coords: points,
                    lineStyle: {
                        normal: {
                            color: echarts.color.modifyHSL('#5A94DF', Math.round(hStep * idx))
                        }
                    }
                };
            }));
            let option = that.getOption(busLines)
            if (!that.layerWork) {
                that.layerWork = new FlowEcharts(that.viewer, option)
            } else {
                that.layerWork.updateOverlay(option)
            }
        })
    };

    getOption(data) {
        return {
            GLMap: {},
            backgroundColor: 'rgba(0,0,0,0.6)',
            series: [{
                type: 'lines',
                coordinateSystem: 'GLMap',
                polyline: true,
                data: data,
                silent: true,
                lineStyle: {
                    normal: {

                        opacity: 0.2,
                        width: 1
                    }
                },
                progressiveThreshold: 500,
                progressive: 200
            }, {
                type: 'lines',
                coordinateSystem: 'GLMap',
                polyline: true,
                data: data,
                lineStyle: {
                    normal: {
                        width: 0
                    }
                },
                effect: {
                    constantSpeed: 20,
                    show: true,
                    trailLength: 0.1,
                    symbolSize: 1.5,
                    period: 2
                },
                zlevel: 1
            }]
        }
    };


    initlineBus() {
        this.create();
        this.activate();
    }
};

export {LoadLineBus};
