const svgns = "http://www.w3.org/2000/svg"
const svg = document.getElementById('chart')
const baseLineY = document.getElementById('baseLine').getAttribute('y1')
const upperLineY = document.getElementById('upperLine').getAttribute('y1')
const sampleChartEl = document.getElementById('sampleChart')
const minimapElement = document.getElementById('minimap')
const XminSvg = parseInt(document.getElementById('baseLine').getAttribute('x1'))
const XmaxSvg = parseInt(document.getElementById('baseLine').getAttribute('x2'))
const YminSvg = parseInt(document.getElementById('upperLine').getAttribute('y1'))
const YmaxSvg = parseInt(document.getElementById('baseLine').getAttribute('y1'))

document.addEventListener("DOMContentLoaded", function() {
    const buttonEl = document.getElementById('button')
    buttonEl.onclick = function() {
        switchTheme()
    }
    svg.addEventListener('mousemove', drawVerticalLine, false);
    let data = getFullFormattedData(getChartData(chartData))
    //Draw big chart
    drawCharts(data[0], XminSvg, YmaxSvg, XmaxSvg-XminSvg, YmaxSvg-YminSvg)
    //Drawing first minimap
    drawChartsForMinimap(data[0], minimapElement)
});

/**
 * Styling and themes utilities
 */
let switchTheme = function() {
    let theme = "day"
    let buttonElement = document.getElementById('button')
    let bodyElement = document.getElementById('body')
    let minimapElement = document.getElementById('minimap')
    let headerElement = document.getElementById('header')
    if (buttonElement.innerText.indexOf("Night") === -1) {
        buttonElement.innerText = "Switch to Night Mode"
        theme = "night"
        toggleClass(buttonElement, "day")
        toggleClass(bodyElement, "day")
        toggleClass(minimapElement, "day")
        toggleClass(headerElement, "day")
    } else {
        buttonElement.innerText = "Switch to Day Mode"
        theme = "day"
        toggleClass(buttonElement, "night")
        toggleClass(bodyElement, "night")
        toggleClass(minimapElement, "night")
        toggleClass(headerElement, "night")
    }
    toggleClass(buttonElement, theme)
    toggleClass(bodyElement, theme)
    toggleClass(minimapElement, theme)
    toggleClass(headerElement, theme)
}

let toggleClass = function(el, className) {
    if (el.classList) {
        el.classList.toggle(className);
    } else {
        let classes = el.className.split(' ');
        let existingIndex = classes.indexOf(className);
        if (existingIndex >= 0) {
            classes.splice(existingIndex, 1);
        } else {
            classes.push(className);
        }
        el.className = classes.join(' ');
    }
}

/**
 * Parsing data from JSON 
 */
let getChartData = function(object) {
    return JSON.parse(object)
}

let getFullFormattedData = function(data) {
    let fullData = []
    for (let l = 0; l < data.length; l++) {
        fullData.push(getFormattedDataForOneChart(data[l]))
    }
    return fullData
}

let getFormattedDataForOneChart = function(chartData) {
    let counter = 0, yColumns = [], xPointCount = 0, yMaximums = [], names = [], colors = [], xColumns = []
    while (counter < chartData.columns.length) {
        let currentColumn = chartData.columns[counter]
        let currentChartKey = currentColumn[0]
        let currtype = chartData.types[currentChartKey]
        if (currtype === "line") {
            let currYColumn = currentColumn.slice(1, currentColumn.length)
            yColumns.push(currYColumn)
            yMaximums.push(Math.max.apply(null, currYColumn))
            names.push(chartData.names[currentChartKey])
            colors.push(chartData.colors[currentChartKey])
        } else {
            xPointCount = currentColumn.length - 1
            xColumns.push( currentColumn.slice(1, currentColumn.length) )
        }
        counter++
    }
    let yMax = Math.max.apply(null, yMaximums);
    let formattedData = new Object()
    formattedData.yColumns = yColumns
    formattedData.xColumns = xColumns
    formattedData.xPointCount = xPointCount
    formattedData.yMaximums = yMaximums
    formattedData.yMax = yMax
    formattedData.names = names
    formattedData.colors = colors
    return formattedData
}

/**
 * Drawing for Big chart
 */

let drawBigCharts = function(chartData, svgEl) {

}

let drawVerticalLine = function(e) {
    let verticalLineEl = document.getElementById('verticalLine')
    if (verticalLineEl !== null) {
        verticalLineEl.parentNode.removeChild(verticalLineEl)
    }
    let pt = svg.createSVGPoint(), svgP, line
    pt.x = e.clientX
    pt.y = e.clientY
    svgP = pt.matrixTransform(svg.getScreenCTM().inverse())
    let svgPx = svgP.x
    let svgPy = svgP.y
    if (isInsideSvgField(svgPx, svgPy, XminSvg, XmaxSvg, YminSvg, YmaxSvg)) {
        line = document.createElementNS(svgns,'line')
        line.setAttribute('id', 'verticalLine')
        line.setAttributeNS(null, 'id', 'verticalLine')
        line.setAttributeNS(null, 'x1', svgPx)
        line.setAttributeNS(null, 'y1', upperLineY)
        line.setAttributeNS(null, 'x2', svgPx)
        line.setAttributeNS(null, 'y2', baseLineY)
        line.classList.add('grid')
        svg.appendChild(line)    
        if (sampleChartEl != null && intersectRect(line, sampleChartEl)) {
            //There will be code about creating point of intersection
        }
    }
}

let isInsideSvgField = function(svgPx, svgPy, XminSvg, XmaxSvg, YminSvg, YmaxSvg) {
    return svgPx >= XminSvg && svgPx <= XmaxSvg && svgPy >= YminSvg && svgPy <= YmaxSvg
}

function intersectRect(r1, r2) {
    var r1 = r1.getBoundingClientRect();
    var r2 = r2.getBoundingClientRect();
    return !(r2.left > r1.right || 
           r2.right < r1.left || 
           r2.top > r1.bottom ||
           r2.bottom < r1.top);
}

/**
 * Drawing minimap charts
 */
let drawChartsForMinimap = function (chartData, minimapEl) {
    const offsetX = parseInt(minimapEl.getAttribute('x'))
    const offsetY = parseInt(minimapEl.getAttribute('y')) + parseInt(minimapEl.getAttribute('height'))
    const minimapElMaxX = offsetX + parseInt(minimapEl.getAttribute('width')) 
    const minimapElMaxY = parseInt(minimapEl.getAttribute('y'))
    const maxYDistance = Math.abs(minimapElMaxY - offsetY) 
    const maxXDistance = Math.abs(minimapElMaxX - offsetX)
    for (let s = 0; s < chartData.names.length; s++) {
        chartData.names[s] = "mini-" + chartData.names[s]
    }
    drawCharts(chartData, offsetX, offsetY, maxXDistance, maxYDistance)
}

let drawCharts = function(chartData, offsetX, offsetY, maxXDistance, maxYDistance) {
    for (let i = 0; i < chartData.yColumns.length; i++) {
        let currentColumn = chartData.yColumns[i]
        let currPolyline = createBasicPolyLine(chartData.names[i], chartData.colors[i]);
        for (let j = 0; j < currentColumn.length; j++) {
            let point = svg.createSVGPoint()
            point.x = offsetX + (j * maxXDistance)/chartData.xPointCount
            point.y = offsetY - (maxYDistance*currentColumn[j])/chartData.yMax
            currPolyline.points.appendItem(point)
        }
        svg.appendChild(currPolyline)
    }
}

let createBasicPolyLine = function(id, color) {
    let minimapChart = document.createElementNS(svgns, 'polyline')
    minimapChart.setAttributeNS(null, 'id', id)
    minimapChart.setAttributeNS(null, 'fill', 'none')
    minimapChart.setAttributeNS(null, 'stroke', color)
    minimapChart.setAttributeNS(null, 'stroke-width', '1')
    return minimapChart
}