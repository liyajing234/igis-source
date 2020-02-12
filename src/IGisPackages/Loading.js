// const url="../../igisimgs/circle_red.png";
// import url from "../../igisimgs/loading.gif"
class Loading {
    constructor () {
    }

    /**
     * 设置遮罩层和loading 图标
     * @param containerId 容器ID 必填
     * @param layerOptions{class} 可不填 有默认
     * @class 遮罩层样式 可不填 有默认
     * @param loadingOptions{class,IconUrl,text}
     * @class loading样式 可不填 有默认
     * @IconUrl loading图标地址 可不填 有默认
     * @text loading下显示的文字 可不填 有默认
     * @textclass 文字样式 可不填 有默认
     */
   static create(layerOptions,loadingOptions){
           let _layerOptions={
               class:"ig-masklayer"
           };
           let _loadingOptions={
                class:"ig-loading",
                IconUrl:"../../igisimgs/loading.gif",
                text:"Loading..."
            };

        let container=document.getElementsByClassName("cesium-viewer")[0];
        if(typeof layerOptions!=="undefined"){
            if(typeof layerOptions.class!=="undefined"){
                _layerOptions.class=layerOptions.class;
            }
        }

        if(typeof loadingOptions!=="undefined"){
            if(typeof loadingOptions.class!="undefined"){
                _loadingOptions.class=loadingOptions.class;
            }
            if(typeof loadingOptions.IconUrl!="undefined"){
                _loadingOptions.IconUrl=loadingOptions.IconUrl;
            }
            if(typeof loadingOptions.text!="undefined"){
                _loadingOptions.text=loadingOptions.text;
            }

        }
        //创建遮罩层
        let masklayer=document.createElement("div");
        masklayer.classList.add(_layerOptions.class);
        masklayer.id="masklayer";

        //创建loading图标
        let loading=document.createElement("div");
        loading.classList.add(_loadingOptions.class);
        //loading 图标以及显示文字
        let img=document.createElement("img");
        img.src=_loadingOptions.IconUrl;
        loading.appendChild(img);
        img.style.width="50px";
        img.style.height="50px";
        let p=document.createElement("p");
        p.innerHTML=_loadingOptions.text;
        p.style.color="#ffffff";

        loading.appendChild(p);
        loading.id="loading";

        if(typeof container!=="undefined"&&container!==null){
            container.appendChild(masklayer);
            container.appendChild(loading);
        }else {
            document.body.appendChild(masklayer);
            document.body.appendChild(loading);
        }
    };

    /**
     * 删除遮罩层和loading
     * @param loadingcontainerId 遮罩层和loading的容器ID
     */
  static  dispose(){

        let masklayer = document.getElementById("masklayer");
        let loading = document.getElementById("loading");

        masklayer.parentNode.removeChild(masklayer);
        loading.parentNode.removeChild(loading);

    };

}
export {Loading}