export class Calc {
    static calculateXStep(maxXDistance, xPointCount) {
        return maxXDistance/xPointCount
    }

    static isInsideField(Px, Py, Xmin, Xmax, Ymin, Ymax) {
        return Px >= Xmin && Px <= Xmax && Py >= Ymin && Py <= Ymax
    }

    static roundBy(num, decimals) {
        var sign = num >= 0 ? 1 : -1;
        return (Math.round((num*Math.pow(10,decimals)) + (sign*0.001)) / Math.pow(10,decimals)).toFixed(decimals);
    }
}