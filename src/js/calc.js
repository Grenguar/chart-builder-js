export class Calc {
    static calculateXStep(maxXDistance, xPointCount) {
        return maxXDistance/xPointCount
    }

    static isInsideField(Px, Py, Xmin, Xmax, Ymin, Ymax) {
        return Px >= Xmin && Px <= Xmax && Py >= Ymin && Py <= Ymax
    }
}