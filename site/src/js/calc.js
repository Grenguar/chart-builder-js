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

    static calculateTicks(maxTicks, minPoint, maxPoint) {
        let range = this.niceNum(maxPoint - minPoint, false);
        let tickSpacing = this.niceNum(range / (maxTicks - 1), true);
        let niceMin = Math.floor(minPoint / tickSpacing) * tickSpacing;
        let niceMax = Math.ceil(maxPoint / tickSpacing) * tickSpacing;
        let tickCount = range / tickSpacing;
        return [tickCount, niceMin, niceMax];
    }


    static findClosest(arr, target) { 
        let n = arr.length
        if (target <= arr[0]) 
            return arr[0] 
        if (target >= arr[n - 1]) 
            return arr[n - 1]
        let i = 0, j = n, mid = 0
        while (i < j) { 
            mid = (i + j) / 2 
            if (arr[mid] == target) 
                return arr[mid] 
            if (target < arr[mid]) { 
                if (mid > 0 && target > arr[mid - 1]) {
                    return getClosest(arr[mid - 1], arr[mid], target) 
                }
                j = mid               
            } else { 
                if (mid < n-1 && target < arr[mid + 1])   {
                    return getClosest(arr[mid], arr[mid + 1], target)                 
                }
                i = mid + 1
            } 
        } 
        return arr[mid] 
    } 

    static niceNum(range, round) {
        let exponent
        let fraction
        let niceFraction
        exponent = Math.floor(Math.log10(range));
        fraction = range / Math.pow(10, exponent);
        if (round) {
            if (fraction < 1.5)
                niceFraction = 1;
            else if (fraction < 3)
                niceFraction = 2;
            else if (fraction < 7)
                niceFraction = 5;
            else
                niceFraction = 10;
        } else {
            if (fraction <= 1)
                niceFraction = 1;
            else if (fraction <= 2)
                niceFraction = 2;
            else if (fraction <= 5)
                niceFraction = 5;
            else
                niceFraction = 10;
        }
        return niceFraction * Math.pow(10, exponent);
    }
}