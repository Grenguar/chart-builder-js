import firstData from "../files/contest/1/overview.json"
import secondData from "../files/contest/2/overview.json"
import thirdData from "../files/contest/3/overview.json"
import fourthData from "../files/contest/4/overview.json"
import fifthData from "../files/contest/5/overview.json"

export class ChartData {
    getFirstData() {
        return this.getFormattedDataForOneChart(firstData)
    }
    
    getFormattedDataForOneChart(chartData) {
        let counter = 0, yColumns = [], xPointCount = 0, yMaximums = [], yMinimums = [], names = [], colors = [], xColumns = []
        while (counter < chartData.columns.length) {
            let currentColumn = chartData.columns[counter]
            let currentChartKey = currentColumn[0]
            let currtype = chartData.types[currentChartKey]
            if (currtype === "line") {
                let currYColumn = currentColumn.slice(1, currentColumn.length)
                yColumns.push(currYColumn)
                yMaximums.push(Math.max.apply(null, currYColumn))
                yMinimums.push(Math.min.apply(null, currYColumn))
                names.push(chartData.names[currentChartKey])
                colors.push(chartData.colors[currentChartKey])
            } else {
                xPointCount = currentColumn.length - 1
                xColumns.push( currentColumn.slice(1, currentColumn.length) )
            }
            counter++
        }
        let yMax = Math.max.apply(null, yMaximums);
        let yMin = Math.max.apply(null, yMinimums)
        let formattedData = new Object()
        formattedData.yColumns = yColumns
        formattedData.xColumns = xColumns
        formattedData.xPointCount = xPointCount
        formattedData.yMaximums = yMaximums
        formattedData.yMinimums = yMinimums
        formattedData.yMax = yMax
        formattedData.yMin = yMin
        formattedData.names = names
        formattedData.colors = colors
        console.log(formattedData)
        return formattedData
    }

    getSecondData() {
        return secondData
    }

    getThirdData() {
        return thirdData
    }

    getFourthData() {
        return fourthData
    }

    getFifthData() {
        return fifthData
    }
}