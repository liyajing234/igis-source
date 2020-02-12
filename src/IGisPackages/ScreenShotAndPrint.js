import {IGisPrint} from "../IGisTools/IGis-print.js";
import {viewer} from "./Viewer.js";
import {Cesium} from "./Unit.js";
class ScreenShotAndPrint{
    constructor(props) {
        viewer.scene.canvas.id = "cesiumCanvas";
    }

//弹出弹框
    closeScreenBox() {
        $('#screen-content').css({
            "display": "none"
        })
    };
// 选定区域
    selectArea() {
        let _this=this;
        let options={
            penColor: "yellow", //画笔颜色
            strokeWidth: 1 //单位 px
        }
        IGisPrint.drawArea("cesiumCanvas", {
            penColor: "yellow", //画笔颜色
            strokeWidth: 1 //单位 px
        })
            .then(base64url => {
                _this.createRealityPic(base64url)
                _this.showSelectArea(base64url, options)
            })
            .catch(error => {
                console.error(error);
            });
    };
// 展示截取的图
    showSelectArea (base64url, options) {
        $('#screen-content').css({
            "display": "block"
        })
        $('#screen-img')
            .attr('src', base64url)
    };
// 生成实际截图
    createRealityPic (url) {
        let _this=this;
        // let img = $('<img/>')
        //     .attr('src', url)
        // $('#screenPic').append(img)

        $('#screenPic').html(`
    <div id="screen-content">
        <div id="screen-content-head">
            <div id="screen-content-title">截图</div>
            <div id="screen-content-cbtn"><i class="layui-icon" id="screen-content-i">&#x1006;</i></div>
        </div>
        <div id="screen-content-body">
            <div id="screen-img-box">
                <img id="screen-img" src=${url}/>
            </div>              
        </div>
        <div id="screen-content-foot">
            <div class="layui-input-block" style="display:inline-block">
              <input type="text" name="title" lay-verify="title" autocomplete="off" placeholder="请输入标题" class="layui-input screen-img-title" >
            </div>
            <button type="button" class="layui-btn  layui-btn-sm" id="screenShot">确认</button>
            <button type="button" class="layui-btn  layui-btn-sm layui-btn-normal" id="cancelScreenBox" >取消</button>
        </div>
    </div>
    `)
        // 截图
        $('#screen-content-i').on('click', function () {
            _this.closeScreenBox();
        })
        $('#screenShot').on('click', function () {
            _this.screenshot();
        })
        $('#cancelScreenBox').on('click', function () {
            _this.closeScreenBox();
        })


    };
// 截取图片
    screenshot() {
        let _this=this;
        html2canvas(document.querySelector('#screen-img'), {
            scale: 1,
            allowTaint: true,
            logging: true,
            useCORS: true,
        }).then(canvas => {
            let ctx = canvas.getContext("2d");
            ctx.font = "20px Georgia";
            ctx.fillText($('.screen-img-title').val(), 480, 250);
            let img = canvas.toDataURL("image/jpeg")
            _this.dataURIToBlob(img, function (blob) {
                let a = document.createElement('a');
                a.download = Date.parse(new Date()) + '.png';
                a.innerHTML = 'download';
                a.href = URL.createObjectURL(blob);
                let event = document.createEvent('MouseEvents');
                event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                a.dispatchEvent(event);
            })
        });
    };
// 解决base64文件过大时 图片下载失败问题
    dataURIToBlob(dataURI, callback) {
        let _this=this;
        let binStr = atob(dataURI.split(',')[1]),
            len = binStr.length,
            arr = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            arr[i] = binStr.charCodeAt(i);
        }
        callback(new Blob([arr]));
    };

//打印
    print(){
        let options={
            penColor: "yellow", //画笔颜色
            strokeWidth: 1 //单位 px
        };
        IGisPrint.drawArea("cesiumCanvas", options)
            .then(base64url => {
                IGisPrint.print(base64url, options);
            })
            .catch(error => {
                console.error(error);
            });
    };
}
export {ScreenShotAndPrint};
