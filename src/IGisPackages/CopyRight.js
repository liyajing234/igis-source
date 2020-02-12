import {Dom} from "./Dom.js"
class CopyRight {
    constructor(options) {
        let _options = {
            fatherDom:document.body,
            text:"Copyright @2019 IGIS",
            class:"ig-copyright"
        }
        if(typeof options!=="undefined"){
            if(typeof options.fatherDom!=="undefined"&&options.fatherDom!==null){
                _options.fatherDom=options.fatherDom;
            }
            if(typeof options.id!=="undefined"){
                _options.id=options.id;
            }
            if(typeof options.text!=="undefined"){
                _options.text=options.text;
            }
            if(typeof options.class!=="undefined"){
                _options.class=options.class;
            }
        }

        let copyRight= Dom.create(_options);
        // copyRight.classList.add("ig-component");
    }
}
export {CopyRight}