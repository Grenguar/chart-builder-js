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
        this.drawMinimapCharts(minimapEl, chartData, offsetX, offsetY, maxXDistance, maxYDistance)
    }
    
    drawMinimapCharts (minimapEl, chartData, offsetX, offsetY, maxXDistance, maxYDistance) {
        for (let i = 0; i < chartData.yColumns.length; i++) {
            let currentColumn = chartData.yColumns[i]
            let currPolyline = draw.createBasicPolyLine("mini-" +chartData.names[i], chartData.colors[i]);
            let xStep = calc.calculateXStep(maxXDistance, chartData.xPointCount)
            let yStep = maxYDistance/chartData.yMax
            let svg = minimapEl.parentNode
            for (let j = 0; j < currentColumn.length; j++) {
                let point = svg.createSVGPoint()
                point.x = offsetX + j * xStep
                point.y = offsetY - currentColumn[j] * yStep
                currPolyline.points.appendItem(point)
            }
            currPolyline.setAttributeNS(null, 'class', 'minichart')
            svg.appendChild(currPolyline)
        }
    }
}