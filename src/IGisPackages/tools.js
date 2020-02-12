/*
   * 大地坐标系资料WGS-84 长半径a=6378137 短半径b=6356752.3142 扁率f=1/298.2572236
   */
const a=6378137;
const b=6356752.3142;
const f= 1 / 298.2572236
class tools {
    /**
     * 三维坐标转屏幕坐标
     * @param scene 参数主viewer的scene
     * @param Cartesian3 要转换的三维坐标
     * @returns {*}  返回值为{x，y},屏幕坐标
     */
    worldCoordinateToPosition(scene, Cartesian3){
        var car2=Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, Cartesian3);
        return car2;
    };

    /**
     * 角度转弧度值
     * @param d 要转的角度值
     * @returns {number} 弧度值
     */
    rad(d) {
        return d * Math.PI / 180.0;
    };

    /**
     * 弧度转角度
     * @param x  要转的弧度值
     * @returns {number} 角度值
     */
    deg(x) {
        return x * 180 / Math.PI;
    };
    /**
     *计算新的椭圆的位置
     * @param lon 经度
     * @param lat 纬度
     * @param brng 方位角
     * @param dist 距离
     * @returns {*[]} 返回新的要加载区域的位置
     */
    computerThatLonLat(lon, lat, brng, dist) {
        var _this=this;
        var a=_this.a;
        var b=_this.b;
        var f=_this.f;
        var alpha1 = _this.rad(brng);
        var sinAlpha1 = Math.sin(alpha1);
        var cosAlpha1 = Math.cos(alpha1);

        var tanU1 = (1 - f) * Math.tan(_this.rad(lat));
        var cosU1 = 1 / Math.sqrt((1 + tanU1 * tanU1));
        var sinU1 = tanU1 * cosU1;
        var sigma1 = Math.atan2(tanU1, cosAlpha1);
        var sinAlpha = cosU1 * sinAlpha1;
        var cosSqAlpha = 1 - sinAlpha * sinAlpha;
        var uSq = cosSqAlpha * (a * a - b * b) / (b * b);
        var A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
        var B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));

        var cos2SigmaM = 0;
        var sinSigma = 0;
        var cosSigma = 0;
        var sigma = dist / (b * A),
            sigmaP = 2 * Math.PI;
        while (Math.abs(sigma - sigmaP) > 1e-12) {
            cos2SigmaM = Math.cos(2 * sigma1 + sigma);
            sinSigma = Math.sin(sigma);
            cosSigma = Math.cos(sigma);
            var deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
                B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));
            sigmaP = sigma;
            sigma = dist / (b * A) + deltaSigma;
        }

        var tmp = sinU1 * sinSigma - cosU1 * cosSigma * cosAlpha1;
        var lat2 = Math.atan2(sinU1 * cosSigma + cosU1 * sinSigma * cosAlpha1,
            (1 - f) * Math.sqrt(sinAlpha * sinAlpha + tmp * tmp));
        var lambda = Math.atan2(sinSigma * sinAlpha1, cosU1 * cosSigma - sinU1 * sinSigma * cosAlpha1);
        var C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
        var L = lambda - (1 - C) * f * sinAlpha *
            (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));

        var revAz = Math.atan2(sinAlpha, -tmp); // final bearing
        return [lon + _this.deg(L), +_this.deg(lat2)]
    };

}
export {tools}