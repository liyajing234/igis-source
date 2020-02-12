
class Dom {

    constructor(props) {
        this.Footer=null;
    }

    /**
     * 创建dom
     * @param options{id,domType,fatherDom,iconUrl,class,click}
     * @param options.id 所创建dom的Id
     * @param options.domType 所创建dom的类型
     * @param options.fatherDom 所创建dom的父级dom
     * @param options.iconUrl 创建dom所需要的图标地址
     * @param options.class 创建dom的样式类名
     * @param options.click 创建dom所绑定的点击事件
     * @returns {HTMLElement} 返回所创建的dom
     */
    createDom(options){
        let _options = {
            iconUrl: "images/home.png",
            class: "ig-bottom-right",
            domType:"div"
        }

        let myDom;
        if (typeof options !== "undefined") {
            if(typeof options.domType!=="undefined"){
                _options.domType=options.domType;
            }
            if (typeof options.id !== "undefined") {
                let div = document.getElementById(options.id);
                if (typeof div !== "undefined") {
                    myDom = div;
                    myDom.id = id;
                } else {
                    myDom = document.createElement(_options.domType);
                    myDom.id = id;
                    if(typeof options.fatherDom==="undefined")
                    {
                        document.body.appendChild(myDom);
                    }else {
                        options.fatherDom.appendChild(myDom)
                    }

                }
            } else {
                myDom = document.createElement(_options.domType);
                if(typeof options.fatherDom==="undefined")
                {
                    document.body.appendChild(myDom);
                }else {
                    options.fatherDom.appendChild(myDom)
                }
            }
            if (typeof options.iconUrl !== "undefined") {
                _options.iconUrl = options.iconUrl;
            }
            if (typeof options.class != "undefined") {
                _options.class = options.class;
            }
        }

        let img = document.createElement("img");
        img.src = _options.iconUrl;
        myDom.appendChild(img);

        switch (_options.class) {
            case "ig-top-left":
                myDom.classList.add("ig-top-left");
                break;
            case "ig-top-right":
                myDom.classList.add("ig-top-right");
                break;
            case "ig-bottom-left":
                myDom.classList.add("ig-bottom-left");
                break;
            case "ig-bottom-right":
                myDom.classList.add("ig-bottom-right");
                break;
            case "ig-bottom-center":
                myDom.classList.add("ig-bottom-center");
                break;
            default:
                myDom.classList.add("ig-bottom-right");
        };
        return myDom;
    };

    /**
     * 创建echarts图表
     * @param dataOption object 指定图表的配置项和数据
     * @param options
     * @param options.id string 配置图表的Id
     * @param options.class string 配置图表的样式类名
     * @param options.fatherDom {HTMLElement} document.body 图表的父级dom
     * @returns {*} 创建的图表
     */
    createChartBox (dataOption,options) {
        let _this=this;
        let _options={
            class:'ig-echarts',
            fatherDom:document.body
        };
        if(typeof dataOption==="undefined"){
            throw "dataOption数据无定义";
        }
        if(typeof options.id!=="undefined"){
            _options.id=options.id;
        }
        if(typeof options.class!=="undefined"){
            _options.class=options.class;
        }
        if(typeof options.fatherDom!=="undefined"){
            _options.fatherDom=options.fatherDom;
        }
        let chartbox=document.createElement("div");
        chartbox.classList.add(_options.class);
        chartbox.id=id;
        _options.fatherDom.appendChild(chartbox);

        let myChart = echarts.init(chartbox);
        // 指定图表的配置项和数据
        myChart.setOption(dataOption);
        return myChart;
    };

    /**
     * 创建弹窗
     * @param options 弹窗的一些属性
     * @param options.fatherDom {HTMLElement} document.body 弹窗的父级元素，如果不填，则默认为document.body。
     * @param options.title string 弹窗的标题元素
     * @param options.content string 弹窗的内容元素
     * @param options.actions [{ title,id,imageUrl}] 弹窗底部的按钮元素
     * @param title string 底部按钮显示的文字
     * @param id string 底部按钮的ID
     * @param imageUrl string 底部按钮使用的图片
     */
     createMapPopup(options){
        let dom=' <div class="esri-popup__main-container esri-widget esri-popup--is-collapsible" tabindex="-1" role="dialog"\n' +
            '         aria-labelledby="16e96ff917d-widget-0-popup-title" aria-describedby="16e96ff917d-widget-0-popup-content">\n' +
            '        <header class="esri-popup__header">\n' +
            '            <div class="esri-popup__header-container esri-popup__header-container--button" id="16e96ff917d-widget-0-popup-title" role="button" aria-label="最小化" title="最小化" tabindex="0">\n' +
            '                <h2 class="esri-popup__header-title">\n' +
            '                \n' +
            '                </h2>\n' +
            '            </div>\n' +
            '            <div class="esri-popup__header-buttons">\n' +
            '                <div role="button" aria-label="固定" title="固定" tabindex="0"\n' +
            '                     class="esri-popup__button esri-popup__button--dock"><span aria-hidden="true"\n' +
            '                                                                               class="esri-popup__icon--dock-icon esri-icon-dock-right esri-popup__icon"></span>\n' +
            '                </div>\n' +
            '                <div role="button" tabindex="0" class="esri-popup__button" aria-label="关闭" title="关闭">\n' +
            '                    <span aria-hidden="true" class="esri-popup__icon esri-icon-close">\n' +
            '                    </span>\n' +
            '                </div>\n' +
            '            </div>\n' +
            '        </header>\n' +
            '        <article id="16e96ff917d-widget-0-popup-content" class="esri-popup__content">\n' +
            '            <div>\n' +
            '                <div class="esri-feature esri-widget">\n' +
            '                    <div class="esri-feature__size-container">\n' +
            '                        <div class="esri-feature__main-container">\n' +
            '                        </div>\n' +
            '                    </div>\n' +
            '                </div>\n' +
            '            </div>\n' +
            '        </article>\n' +
            '        <div class="esri-popup__footer esri-popup__footer--has-actions">\n' +
            '        </div>\n' +
            '    </div>';
        let _this=this;
        let _options={
            fatherDom:document.body,
            title:"",
            content:"",
            actions:[{
                title: "",
                id:"",
                imageUrl:""
            }]
        };
        if(typeof options.fatherDom!=="undefined"){
            _options.fatherDom=options.fatherDom;
        }
        if(typeof options.title!=="undefined"){
            _options.title=options.title;
        }
        if(typeof options.content!=="undefined"){
            _options.content=options.content;
        }
        if(typeof options.actions!=="undefined"){
            _options.actions=options.actions;
        }

        _options.fatherDom.innerHTML=dom;

        let titleDoms=document.getElementsByClassName("esri-popup__header-title");
        let titleDom=titleDoms[titleDoms.length-1];
        titleDom.innerHTML=_options.title;
        let contents=document.getElementsByClassName("esri-feature__main-container");
        let content=contents[contents.length-1];
        content.innerHTML=_options.content;

        //添加底部按钮
        let footers=document.getElementsByClassName("esri-popup__footer--has-actions");
        let footer=footers[footers.length-1];
        if(_options.actions.length>0){
            for(let i=0;i<_options.actions.length;i++){
                let action=_options.actions[i];
                let div=document.createElement("div");
                if(typeof action.image!=="undefined"){
                    let span=document.createElement("span");
                    let img=document.createElement("img");
                    img.src=action.imageUrl;
                    span.appendChild(img);
                    div.appendChild(span);
                }
                if(typeof action.title!=="undefined"){
                    let span=document.createElement("span");
                    span.innerHTML=action.title;
                    div.appendChild(span);
                }
                if(typeof action.id!=="undefined"){
                    div.id=action.id;
                }
                footer.appendChild(div);
            }
        }


        _this.Footer=footer;
    };

    /**
     * 监听鼠标点击事件方法，可监听弹窗的底部点击，返回点击按钮的ID。
     * @param actiontype 鼠标操作类型，有"click"，"mouseover"。
     * @param fn  回调函数，返回值是dom元素的Id。
     */

    on(actiontype, fn){
        var footer=this.Footer;
        if(footer!=null){
            footer.addEventListener(actiontype, function (event) {
                fn(event.target.id);
            })
        }

    }

}
export {Dom};