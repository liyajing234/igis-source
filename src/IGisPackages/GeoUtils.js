class GeoUtils {
    constructor (props) {
    }

    /**
     * 判断点是否在圆内
     * @param point
     * @param circle
     * @param r
     * @returns {boolean}
     */
    static pointInsideCircle (point, circle, r) {
        if (r === 0) {
            return false
        }
        var dx = circle[0] - point[0]
        var dy = circle[1] - point[1]
        return dx * dx + dy * dy <= r * r
    }

    /**
     * 判断点是否在多边形内
     * @param point 要判断的点坐标
     * @param polygonPoints 多边形顶点坐标
     * @returns {boolean} 如果点在多边形内，则返回true，否则返回false
     */
    static pointInsidePolygon(point,polygonPoints){
        let nCross=0;
        for(let i=0;i<polygonPoints.length;i++){
            const polygonPoint1=polygonPoints[i]; //当前节点
            const polygonPoint2=polygonPoints[(i+1)%polygonPoints.length]; //下一个节点
            //求解y=p.y与p1 p2的交点
            const x=point[0]||point.x||point.longitude;
            const y=point[1]||point.y||point.latitude;
            const x1=polygonPoint1[0]||polygonPoint1.x||polygonPoint1.longitude;
            const y1=polygonPoint1[1]||polygonPoint1.y||polygonPoint1.longitude;
            const x2=polygonPoint2[0]||polygonPoint2.x||polygonPoint2.longitude;
            const y2=polygonPoint2[1]||polygonPoint2.y||polygonPoint2.longitude;
            if(y1==y2)
                continue;
            if(y<Math.min(y1,y2))
                continue;
            if(y>Math.max(y1,y2))
                continue;
            const x0=(y-y1)*(x2-x1)/(y2-y1)+x1;
            if(x0>x){
                nCross++
            }
        }
        if(nCross%2==1){
            return true;
        }else {
            return false;
        }
    }

    /**
     *  通过两点，得到直线上的若干个点(三维点)
     * @param point1
     * @param point2
     * @param count
     * @returns {[]}
     */
   static pointToLine (point1, point2, count) {
        let x1 = point1[0];
        let y1 = point1[1];
        let z1 = point1[2]||0;
        let x2 = point2[0];
        let y2 = point2[1];
        let z2 = point2[2]||0;
        let points = [];
        for (let i = 0; i < count; i++) {
            let x = (x2 - x1) / count * i + x1;
            let y = (y2 - y1) / count * i + y1;
            let z = (z2 - z1) / count * i + z1;
            let point = {
                x: x,
                y: y,
                z: z
            };
            points.push(point);
        }
        return points;
    }

    /**
     *通过两点，得到抛物线上的若干个点(三维点)
     * @param options
     * @param options.pt1 {lon,lat}
     * @param options.pt2
     * @param options.height
     * @param options.num
     * @param resultOut
     * @returns {[]}
     */
   static pointToAcr (options,resultOut) {
        //方程 y=-(4h/L^2)*x^2+h h:顶点高度 L：横纵间距较大者
        const h = options.height && options.height > 5000 ? options.height : 5000;
        const L = Math.abs(options.pt1.lon - options.pt2.lon) > Math.abs(options.pt1.lat - options.pt2.lat) ? Math.abs(options.pt1.lon - options.pt2.lon) : Math.abs(options.pt1.lat - options.pt2.lat);
        const num = options.num && options.num > 50 ? options.num : 50;
        const result = [];
        let dlt = L / num;
        if (Math.abs(options.pt1.lon - options.pt2.lon) > Math.abs(options.pt1.lat - options.pt2.lat)) {//以lon为基准
            const delLat = (options.pt2.lat - options.pt1.lat) / num;
            if (options.pt1.lon - options.pt2.lon > 0) {
                dlt = -dlt;
            }
            for (let i = 0; i < num; i++) {
                const tempH = h - Math.pow((-0.5 * L + Math.abs(dlt) * i), 2) * 4 * h / Math.pow(L, 2);
                const lon = options.pt1.lon + dlt * i;
                const lat = options.pt1.lat + delLat * i;
                result.push([lon, lat, tempH]);
            }
        } else {//以lat为基准
            const delLon = (options.pt2.lon - options.pt1.lon) / num;
            if (options.pt1.lat - options.pt2.lat > 0) {
                dlt = -dlt;
            }
            for (let i = 0; i < num; i++) {
                const tempH = h - Math.pow((-0.5 * L + Math.abs(dlt) * i), 2) * 4 * h / Math.pow(L, 2);
                const lon = options.pt1.lon + delLon * i;
                const lat = options.pt1.lat + dlt * i;
                result.push([lon, lat, tempH]);
            }
        }
        if (resultOut != undefined) {
            // eslint-disable-next-line no-param-reassign
            resultOut = result;
        }
        return result;
    }

   static distanceP2P(point1,point2){
        const x1 = point1.x||point1.lon||point1[0];
        const y1 = point1.y||point1.lat||point1[1];
        const z1 = point1.z||point1.height||point1[2]||0;
        const x2 = point2.x||point2.lon||point2[0];
        const y2 = point2.y||point2.lat||point2[1];
        const z2 = point2.z||point2.height||point2[2]||0;
        const disx=(x2-x1)*(x2-x1);
        const disy=(y2-y1)*(y2-y1);
        const disz=(z2-z1)*(z2-z1);
        const distance = Math.sqrt(disx+disy+disz);
        return distance;
    }
}

export {GeoUtils}