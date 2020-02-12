import {viewer} from "./Viewer.js";
const Cesium=require("cesium/Cesium");
//天气
class Weather{
    snowSharder(){
        return "uniform sampler2D colorTexture;\n\
            varying vec2 v_textureCoordinates;\n\
            \n\
            float snow(vec2 uv,float scale)\n\
            {\n\
                float time = czm_frameNumber / 60.0;\n\
                float w=smoothstep(1.,0.,-uv.y*(scale/10.));if(w<.1)return 0.;\n\
                uv+=time/scale;uv.y+=time*2./scale;uv.x+=sin(uv.y+time*.5)/scale;\n\
                uv*=scale;vec2 s=floor(uv),f=fract(uv),p;float k=3.,d;\n\
                p=.5+.35*sin(11.*fract(sin((s+p+scale)*mat2(7,3,6,5))*5.))-f;d=length(p);k=min(d,k);\n\
                k=smoothstep(0.,k,sin(f.x+f.y)*0.01);\n\
                return k*w;\n\
            }\n\
            \n\
            void main(void){\n\
                vec2 resolution = czm_viewport.zw;\n\
                vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\n\
                vec3 finalColor=vec3(0);\n\
                float c = 0.0;\n\
                c+=snow(uv,30.)*.0;\n\
                c+=snow(uv,20.)*.0;\n\
                c+=snow(uv,15.)*.0;\n\
                c+=snow(uv,10.);\n\
                c+=snow(uv,8.);\n\
                c+=snow(uv,6.);\n\
                c+=snow(uv,5.);\n\
                finalColor=(vec3(c)); \n\
                gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(finalColor,1), 0.3); \n\
            \n\
            }\n\
        ";
    };
    rainSharder(){
        return "uniform sampler2D colorTexture;\n\
           varying vec2 v_textureCoordinates;\n\
           \n\
           float hash(float x){\n\
                 return fract(sin(x*23.3)*13.13);\n\
           }\n\
           \n\
           void main(void){\n\
           \n\
               float time = czm_frameNumber / 60.0;\n\
               vec2 resolution = czm_viewport.zw;\n\
               \n\
               vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\n\
               vec3 c=vec3(.6,.7,.8);\n\
               \n\
               float a=-.4;\n\
               float si=sin(a),co=cos(a);\n\
               uv*=mat2(co,-si,si,co);\n\
               uv*=length(uv+vec2(0,4.9))*.3+1.;\n\
               \n\
               float v=1.-sin(hash(floor(uv.x*100.))*2.);\n\
               float b=clamp(abs(sin(20.*time*v+uv.y*(5./(2.+v))))-.95,0.,1.)*20.;\n\
               c*=v*b; \n\
               \n\
               gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(c,1), 0.5);  \n\
           }\n\
    ";
    };
    fogSharder(){
        return "  uniform sampler2D colorTexture;\n" +
            "  uniform sampler2D depthTexture;\n" +
            "  varying vec2 v_textureCoordinates;\n" +
            "  void main(void)\n" +
            "  {\n" +
            "      vec4 origcolor=texture2D(colorTexture, v_textureCoordinates);\n" +
            "      vec4 fogcolor=vec4(0.5,0.5,0.5,0.8);\n" +
            "\n" +
            "      float depth = czm_readDepth(depthTexture, v_textureCoordinates);\n" +
            "      vec4 depthcolor=texture2D(depthTexture, v_textureCoordinates);\n" +
            "\n" +
            "      float f=(depthcolor.r-0.22)/0.2;\n" +
            "      if(f<0.3) f=0.3;\n" +
            "      else if(f>0.7) f=0.7;\n" +
            "      gl_FragColor = mix(origcolor,fogcolor,f);\n" +
            "   }"
    };
//需确认参数含义
    createSnow(options) {
        let _this = this;
        _this.snowSharder();
        let snow = new Cesium.PostProcessStage({
            name: 'czm_snow',
            fragmentShader: _this.snowSharder()
        });
        let skyBrightness = -0.33;
        let fogBrightness = 0.8;
        if(options!=undefined){
            if (typeof options.skyBrightness != "undefined") {
                skyBrightness = options.skyBrightness;
            }
            if (typeof options.fogBrightness != "undefined") {
                fogBrightness = options.fogBrightness;
            }
        }

        viewer.scene.postProcessStages.add(snow);
        viewer.scene.skyAtmosphere.brightnessShift = skyBrightness; //大气圈亮度
        viewer.scene.fog.minimumBrightness = fogBrightness; //0.8
    };
    createRain(options) {
        let _this = this;
        _this.rainSharder();
        let rain = new Cesium.PostProcessStage({
            name: 'czm_rain',
            fragmentShader: _this.rainSharder()
        });
        viewer.scene.postProcessStages.add(rain);
        let hueShift = -0.8;
        let saturationShift = -0.7;
        let brightnessShift = -0.33;
        let density = 0.001;
        let minimumBrightness = 0.8;
        if(typeof options!="undefined"){
            if (typeof options.hueShift != "undefined") {
                hueShift = options.hueShift;
            }
            if (typeof options.saturationShift != "undefined") {
                saturationShift = options.saturationShift;
            }
            if (typeof options.brightnessShift != "undefined") {
                brightnessShift = options.brightnessShift;
            }
            if (typeof options.density != "undefined") {
                density = options.density;
            }
            if (typeof options.minimumBrightness != "undefined") {
                minimumBrightness = options.minimumBrightness;
            }
        }

        viewer.scene.skyAtmosphere.hueShift = hueShift;
        viewer.scene.skyAtmosphere.saturationShift = saturationShift;
        viewer.scene.skyAtmosphere.brightnessShift = brightnessShift;
        viewer.scene.fog.density = density;
        viewer.scene.fog.minimumBrightness = minimumBrightness;
    };
    createFog(options) {
        let _this = this;
        _this.fogSharder();
        let fog = new Cesium.PostProcessStage({
            name: 'czm_fog',
            fragmentShader: _this.fogSharder()
        });
        let hueShift = -0.8;
        let saturationShift = -0.7;
        let brightnessShift = -0.8;
        let density = 0.001;
        let minimumBrightness = 0.8;
        if(typeof options!="undefined"){
            if (typeof options.hueShift != "undefined") {
                hueShift = options.hueShift;
            }
            if (typeof options.saturationShift != "undefined") {
                saturationShift = options.saturationShift;
            }
            if (typeof options.brightnessShift != "undefined") {
                brightnessShift = options.brightnessShift;
            }
            if (typeof options.density != "undefined") {
                density = options.density;
            }
            if (typeof options.minimumBrightness != "undefined") {
                minimumBrightness = options.minimumBrightness;
            }
        }

        viewer.scene.postProcessStages.add(fog);
        viewer.scene.skyAtmosphere.hueShift = hueShift;
        viewer.scene.skyAtmosphere.saturationShift = saturationShift;
        viewer.scene.skyAtmosphere.brightnessShift = brightnessShift;
        viewer.scene.fog.density = density;
        viewer.scene.fog.minimumBrightness = minimumBrightness;
    };
    stopWeather(){
        viewer.scene.postProcessStages._stages = [];
    };
}
export {Weather};

