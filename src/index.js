import "../css/index.css";
require("cesium/Widgets/widgets.css");
import {Viewer,viewer} from "./IGisPackages/Viewer.js";
import {Camera} from "./IGisPackages/Camera.js";
import {Layer} from "./IGisPackages/Layer.js";
import {Clock} from "./IGisPackages/Clock.js";
import {Cartographic,Cartesian3,Rectangle,JulianDate,ClockRange,Color,HorizontalOrigin,VerticalOrigin,ScreenSpaceEventType,Math,Ellipsoid,BoundingSphere} from "./IGisPackages/CommonTypes.js";
import {Compass} from "./IGisPackages/Compass.js";
import {CopyRight} from "./IGisPackages/CopyRight.js";
import {CoordTransform} from "./IGisPackages/CoordTransform.js";
import {Dom} from "./IGisPackages/Dom.js";
import {DomRenderer} from "./IGisPackages/DomRenderer.js";
import {Earth} from "./IGisPackages/Earth.js";
import {GeoUtils} from "./IGisPackages/GeoUtils.js";
import {Home} from "./IGisPackages/Home.js";
import {InitialGlobeView} from "./IGisPackages/InitialGlobeView.js";
import {Loader} from "./IGisPackages/Loader.js";
import {Loading} from "./IGisPackages/Loading.js";
// import {LoadLineBus} from "./IGisPackages/LoadLineBus.js";
import {Mark} from "./IGisPackages/Mark.js"
import {Measure} from "./IGisPackages/Measure.js";
import {Morph} from "./IGisPackages/Morph.js";
import {PositionMessage} from "./IGisPackages/PositionMessage.js";
import {Scan} from "./IGisPackages/Scan.js";
import {Search} from "./IGisPackages/Search.js";
import {ScreenShotAndPrint} from "./IGisPackages/ScreenShotAndPrint.js";
// import {ShowMigrate} from "./IGisPackages/ShowMigrate.js";
import {TrendEvolution} from "./IGisPackages/TrendEvolution.js";
import {Weather} from "./IGisPackages/Weather.js";

import {CzmlLine,CZML} from "./IGisPackages/CzmlLine.js";
import {Point,Label,Billboard,Polyline,Circle,Tags} from "./IGisPackages/Tags.js";

import {VideoPlane} from "./IGisPackages/VideoPlane.js";

import {ScreenSpaceEventHandler} from "./IGisPackages/Click.js";

import {DrawGraphicalHelper} from "./IGisPackages/DrawGraphicalHelper.js";

import {WMTSImageProvider,WMSImageProvider} from "./IGisPackages/WebMapServiceImageryProvider.js"
let IGis = {
    Viewer:Viewer,
    viewer:viewer,

    Camera:Camera,

    Cartographic:Cartographic,
    Cartesian3:Cartesian3,
    Rectangle:Rectangle,
    JulianDate:JulianDate,
    ClockRange:ClockRange,
    Color:Color,
    HorizontalOrigin:HorizontalOrigin,
    VerticalOrigin:VerticalOrigin,

    Layer:Layer,

    Clock:Clock,

    Compass:Compass,

    CopyRight:CopyRight,

    CoordTransform:CoordTransform,

    Dom:Dom,

    DomRenderer:DomRenderer,

    Earth:Earth,

    GeoUtils:GeoUtils,

    InitialGlobeView:InitialGlobeView,

    Loader:Loader,

    Loading:Loading,

    // LoadLineBus:LoadLineBus,

    Mark:Mark,

    Measure:Measure,

    Morph:Morph,

    PositionMessage:PositionMessage,



    Scan:Scan,

    ScreenShotAndPrint:ScreenShotAndPrint,

    Search:Search,

    // ShowMigrate:ShowMigrate,

    TrendEvolution:TrendEvolution,

    Weather:Weather,

    Home:Home,

    CzmlLine:CzmlLine,
    CZML:CZML,

    Point:Point,
    Label:Label,
    Billboard:Billboard,
    Polyline:Polyline,
    Circle:Circle,
    Tags:Tags,

    VideoPlane:VideoPlane,

    ScreenSpaceEventHandler:ScreenSpaceEventHandler,
    ScreenSpaceEventType:ScreenSpaceEventType,

    DrawGraphicalHelper:DrawGraphicalHelper,
    WMTSImageProvider:WMTSImageProvider,
    WMSImageProvider:WMSImageProvider,

    Math:Math,
    Ellipsoid:Ellipsoid,
    BoundingSphere:BoundingSphere,
};



export {IGis};
