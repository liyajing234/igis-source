import {Cesium} from "./Unit.js";
class DrawCanvas {
    constructor (options){
        let _options={
            startColor:new Cesium.Color(0.58,1,1,1),
            endColor:new Cesium.Color(0.58,1,1,0),
            direction:"leftToright",
            trailRatio:0.2
        }
        let offset0=0.8;
        let offset1=1;
        let x1=300;
        let y1=25;
        if(typeof options!=="undefined"){
            if(typeof options.direction!=="undefined"){
                _options.direction=options.direction;
            }
            if(typeof options.trailRatio!=="undefined"){
                _options.trailRatio=options.trailRatio;
            }
            if(typeof options.startColor!=="undefined"){
                _options.startColor=options.startColor;
            }
            if(typeof options.endColor!=="undefined"){
                _options.endColor=options.endColor;
            }
        }
        if(_options.direction==="leftToright"){
            _options.width=300;
            _options.height=25;
            offset0=1;
            offset1=1-_options.trailRatio;
            x1=_options.width;
            y1=0;
        }else if(_options.direction==="rightToleft"){
            _options.width=300;
            _options.height=25;
            offset0=0;
            offset1=_options.trailRatio;
            x1=_options.width;
            y1=0;
        }else if(_options.direction==="topTobottom"){
            _options.width=25;
            _options.height=300;
            offset0=1;
            offset1=1-_options.trailRatio;
            x1=0;
            y1=_options.height;
        }else {
            _options.width=25;
            _options.height=300;
            offset0=0;
            offset1=_options.trailRatio;
            x1=0;
            y1=_options.height;

        }
        let canvas=document.createElement("canvas");
        canvas.width=_options.width;
        canvas.height=_options.height;
        let context=canvas.getContext("2d");
        let grd=context.createLinearGradient(0,0,x1,y1);
        let sr=_options.startColor.red;
        let sg=_options.startColor.green;
        let sb=_options.startColor.blue;
        let sa=_options.startColor.alpha;
        let er=_options.endColor.red;
        let eg=_options.endColor.green;
        let eb=_options.endColor.blue;
        let ea=_options.endColor.alpha;
        let color0="rgba("+sr+","+sg+","+sb+","+sa+")";
        let color1="rgba("+er+","+eg+","+eb+","+ea+")";
        grd.addColorStop(offset0,color0);

        grd.addColorStop(offset1,color1);
        //应用渐变
        context.fillStyle=grd;
        context.fillRect(0,0,canvas.width,canvas.height);
        let image=this.convertCanvasToImage(canvas);
        return image;

    }
    convertCanvasToImage(canvas){
        let image = new Image();
        image.src = canvas.toDataURL("image/png");
        console.log(image);
        return image;
    }
}

export {DrawCanvas}