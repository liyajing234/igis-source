import {Viewer} from "./IGisPackages/Viewer.js";
import {Camera} from "./IGisPackages/Camera.js";
import {ChangeLayer} from "./IGisPackages/ChangeLayer.js";
import {Clock} from "./IGisPackages/Clock.js";
import {Cartographic,Rectangle,JulianDate,ClockRange} from "./IGisPackages/CommonTypes.js";
import {Compass} from "./IGisPackages/Compass";
import {CopyRight} from "./IGisPackages/CopyRight.js";
import {Dom} from "./IGisPackages/Dom.js";
import {DomRenderer} from "./IGisPackages/DomRenderer.js";
import {EarthRotate} from "./IGisPackages/EarthRotate.js";
import {Home} from "./IGisPackages/Home.js";
import {InitialGlobeView} from "./IGisPackages/InitialGlobeView.js";
import {Loader} from "./IGisPackages/Loader.js";
import {Loading} from "./IGisPackages/Loading";
import {LoadLineBus} from "./IGisPackages/LoadLineBus.js";
import {Measure,DrawFigure,MilitaryPlotting} from "./IGisPackages/Measure.js";
import {Morph} from "./IGisPackages/Morph.js";
import {PositionMessage} from "./IGisPackages/PositionMessage.js";
import {ScreenShotAndPrint} from "./IGisPackages/ScreenShotAndPrint.js";
import {ShowMigrate} from "./IGisPackages/ShowMigrate.js";
import {TrendEvolution,DangerDetection} from "./IGisPackages/TrendEvolution.js";
import {Weather} from "./IGisPackages/Weather.js";


let IGis = {
    Viewer:Viewer,
    Camera:Camera,
    ChangeLayer:ChangeLayer,
    Clock:Clock,
    Compass:Compass,
    CopyRight:CopyRight,
    CreateDom:Dom,
    DomRenderer:DomRenderer,
    EarthRotate:EarthRotate,
    InitialGlobeView:InitialGlobeView,
    Loader:Loader,
    Loading:Loading,
    LoadLineBus:LoadLineBus,
    Measure:Measure,
    Morph:Morph,
    DrawFigure:DrawFigure,
    MilitaryPlotting:MilitaryPlotting,
    PositionMessage:PositionMessage,
    ScreenShotAndPrint:ScreenShotAndPrint,
    ShowMigrate:ShowMigrate,
    TrendEvolution:TrendEvolution,
    DangerDetection:DangerDetection,
    Weather:Weather,
    Home:Home,
    Cartographic:Cartographic,
    Rectangle:Rectangle,
    JulianDate:JulianDate,
    ClockRange:ClockRange
};



export {IGis};
