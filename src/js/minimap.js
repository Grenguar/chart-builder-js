import {Calc as calc} from './calc'
import {Draw as draw} from './draw'

export class Minimap {
    constructor(chartData, minimapEl) {
        this.drawMinimap(chartData, minimapEl)
    }

    drawMinimap (chartData, minimapEl) {
        const offsetX = parseInt(minimapEl.getAttribute('x'))
        const offsetY = parseInt(minimapEl.getAttribute('y')) + parseInt(minimapEl.getAttribute('height'))
        const minimapElMaxX = offsetX + parseInt(minimapEl.getAttribute('width')) 
        const minimapElMaxY = parseInt(minimapEl.getAttribute('y'))
        const maxYDistance = Math.abs(minimapElMaxY - offsetY) 
        const maxXDistance = Math.abs(minimapElMaxX - offsetX)
        this.drawCharts(minimapEl.parentNode, chartData, offsetX, offsetY, maxXDistance, maxYDistance, "mini-", "miniChart")
    }
    
    drawCharts (parentElement, chartData, offsetX, offsetY, maxXDistance, maxYDistance, linePrefix, className, svg) {
        for (let i = 0; i < chartData.yColumns.length; i++) {
            let currentColumn = chartData.yColumns[i]
            let currPolyline = draw.createBasicPolyLine(linePrefix + chartData.names[i], chartData.colors[i]);
            let xStep = calc.calculateXStep(maxXDistance, chartData.xPointCount)
            let yStep = maxYDistance/chartData.yMax
            for (let j = 0; j < currentColumn.length; j++) {
                let point = parentElement.createSVGPoint()
                point.x = offsetX + j * xStep
                point.y = offsetY - currentColumn[j] * yStep
                currPolyline.points.appendItem(point)
            }
            currPolyline.setAttributeNS(null, 'class', className)
            parentElement.appendChild(currPolyline)
        }
    }
}