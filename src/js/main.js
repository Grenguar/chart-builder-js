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
    drawBigCharts(data[0], svg, XminSvg, YmaxSvg, XmaxSvg-XminSvg, YmaxSvg-YminSvg)
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
    return formattedData
}

/**
 * Drawing for Big chart
 */
let drawBigCharts = function(chartData, svg, XminSvg, YmaxSvg, maxXDistance, maxYDistance) {
    drawCharts(chartData, XminSvg, YmaxSvg, maxXDistance, maxYDistance)
    let yMin = 0
    let yMax = chartData.yMax

    let textNodes = document.getElementById('ylabels').querySelectorAll('text')
    let textNodesLength = textNodes.length
    let xStep = Math.floor((yMax - yMin) / (textNodesLength-1) )
    let valueForXaxis = 0
    for (let i = 0; i < textNodesLength; i++) {
        document.getElementById('ylabels').querySelectorAll('text')[textNodesLength - 1 - i].innerHTML = valueForXaxis
        valueForXaxis += xStep
    }
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
    let defaultWidth = 10*calculateXStep(maxXDistance, chartData.xPointCount);
    let rectangle = drawScalingRectangle(minimapElMaxX, minimapElMaxY, defaultWidth)
    svg.appendChild(rectangle)
}

//<rect id ="minimap" class="day" x="30" y="520" width="500" height="80" style="stroke-width:3;" />

let drawScalingRectangle = function(minimapElMaxX, minimapElMaxY, defaultWidth) {
    let scalingRectangle = document.createElementNS(svgns, 'rect')
    scalingRectangle.setAttributeNS(null, 'id', 'scalingRectangle')
    //x, y should be vars
    scalingRectangle.setAttributeNS(null, 'x', 330)
    scalingRectangle.setAttributeNS(null, 'y', 522)
    //width, heigth should be vars
    scalingRectangle.setAttributeNS(null, 'width', 200)
    scalingRectangle.setAttributeNS(null, 'height', 75)
    scalingRectangle.setAttributeNS(null, 'rx', 10)
    scalingRectangle.setAttributeNS(null, 'ry', 10)
    scalingRectangle.setAttributeNS(null, 'stroke', '#CAD7E8')
    scalingRectangle.setAttributeNS(null, 'style', 'stroke-width:3;')
    return scalingRectangle
}

let drawCharts = function(chartData, offsetX, offsetY, maxXDistance, maxYDistance) {
    for (let i = 0; i < chartData.yColumns.length; i++) {
        let currentColumn = chartData.yColumns[i]
        let currPolyline = createBasicPolyLine(chartData.names[i], chartData.colors[i]);
        let xStep = calculateXStep(maxXDistance, chartData.xPointCount)
        let yStep = maxYDistance/chartData.yMax
        for (let j = 0; j < currentColumn.length; j++) {
            let point = svg.createSVGPoint()
            point.x = offsetX + j * xStep
            point.y = offsetY - currentColumn[j] * yStep
            currPolyline.points.appendItem(point)
        }
        svg.appendChild(currPolyline)
    }
}

let calculateXStep = function(maxXDistance, xPointCount) {
    return maxXDistance/xPointCount
}

let createBasicPolyLine = function(id, color) {
    let minimapChart = document.createElementNS(svgns, 'polyline')
    minimapChart.setAttributeNS(null, 'id', id)
    minimapChart.setAttributeNS(null, 'fill', 'none')
    minimapChart.setAttributeNS(null, 'stroke', color)
    minimapChart.setAttributeNS(null, 'stroke-width', '1')
    return minimapChart
}