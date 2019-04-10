const svgns = "http://www.w3.org/2000/svg"
const svg = document.getElementById('chart')
const chartArea = document.getElementById('chartArea')
const baseLineY = document.getElementById('baseLine').getAttribute('y1')
const upperLineY = document.getElementById('upperLine').getAttribute('y1')
const sampleChartEl = document.getElementById('sampleChart')
const minimapElement = document.getElementById('minimap')
const scalingRectangleElement = document.getElementById('scalingRectangle')
const scalingRectangleBig = document.getElementById('bigRect')
const scalingRectangleSmall = document.getElementById('smallRect')

const XminSvg = parseInt(document.getElementById('baseLine').getAttribute('x1'))
const XmaxSvg = parseInt(document.getElementById('baseLine').getAttribute('x2'))
const YminSvg = parseInt(document.getElementById('upperLine').getAttribute('y1'))
const YmaxSvg = parseInt(document.getElementById('baseLine').getAttribute('y1'))

document.addEventListener("DOMContentLoaded", () => {
    const buttonEl = document.getElementById('button')
    buttonEl.onclick = () => { switchTheme() }
    makeChartAreaScrollable()
    svg.onmousemove = drawVerticalLine
    dragElement(scalingRectangleElement)
    let data = getFullFormattedData(getChartData(chartData))
    // drawBigCharts(data[0], svg, XminSvg, YmaxSvg, XmaxSvg-XminSvg, YmaxSvg-YminSvg)
    drawMinimap(data[0], minimapElement)
    drawBigChartsFromMinimap(data[0])
})

let makeChartAreaScrollable = () => {
    let scrollDistance = 0
    let scrollDistanceX = 0
    const root = chartArea
    const parent = root.parentNode
    root.setAttribute("clip-path", "url(#chartArea-clip-path)")
    const rootBBox = {
        x: parseInt(chartArea.getAttribute("x")),
        y: parseInt(chartArea.getAttribute("y")),
        width: parseInt(chartArea.getAttribute("width")),
        height: parseInt(chartArea.getAttribute("height"))
    }
    const contentItems = chartArea.children
    const content = document.createElementNS(svgns, "g")
    content.setAttributeNS(null, 'id', 'content')
    content.setAttributeNS(null, 'transform', `translate(${rootBBox.x},${rootBBox.y})`)
    Array.from(contentItems).forEach(function (child) {
        content.appendChild(child)
    });
    root.appendChild(content)

    const clipPath = document.createElementNS(svgns, 'clipPath')
    clipPath.setAttributeNS(null, 'id', 'chartArea-clip-path')
    parent.appendChild(clipPath)
    const clipRect = document.createElementNS(svgns, "rect")
    clipRect.setAttributeNS(null, 'x', rootBBox.x)
    clipRect.setAttributeNS(null, 'y', rootBBox.y)
    clipRect.setAttributeNS(null, 'width', rootBBox.width)
    clipRect.setAttributeNS(null, 'height', rootBBox.height)
    clipPath.appendChild(clipRect)
    const invisibleLine = document.createElementNS(svgns, 'g')
    invisibleLine.setAttributeNS(null, 'x', rootBBox.x)
    invisibleLine.setAttributeNS(null, 'y', rootBBox.y)
    invisibleLine.setAttributeNS(null, 'width', rootBBox.width)
    invisibleLine.setAttributeNS(null, 'height', rootBBox.height)
    invisibleLine.setAttributeNS(null, 'opacity', '0')
    root.insertBefore(invisibleLine, content)
    const contentBBox = content.getBBox() 
    const absoluteContentHeight = contentBBox.y + contentBBox.height
    const maxScroll = Math.max(absoluteContentHeight - rootBBox.height, 0)

    const absoluteContentWidth = contentBBox.x + contentBBox.width
    const maxScrollX = Math.max(absoluteContentWidth - rootBBox.width, 0)
  
    let updateScrollPositionY = (diff) => {
        scrollDistance += diff
        scrollDistance = Math.max(0, scrollDistance)
        scrollDistance = Math.min(maxScroll, scrollDistance)
        content.setAttributeNS(null, 'transform', `translate(${rootBBox.x},${rootBBox.y-scrollDistance})`)
    }

    let updateScrollPositionX = (diff) => {
        scrollDistanceX += diff
        scrollDistanceX = Math.max(0, scrollDistanceX)
        scrollDistanceX = Math.min(maxScrollX, scrollDistanceX)
        content.setAttributeNS(null, 'transform', `translate(${rootBBox.x-scrollDistanceX},${rootBBox.y})`)
    } 

    // Set up scroll events
    // root.onwheel = (e) => updateScrollPositionY(e.deltaY)
    observeChanges = (targetNode, callback) => {
        const config = { attributes: true, attributeOldValue: true}
        callback = function(mutationsList) {
            for (let mutation of mutationsList) {
                if (mutation.type == 'attributes') {
                    let newValue = targetNode.getAttribute(mutation.attributeName)
                    let oldValue = mutation.oldValue
                    let difference = newValue - oldValue
                    updateScrollPositionX(difference)
                }
            }
        }
        let observer = new MutationObserver(callback)
        observer.observe(targetNode, config)
    }
    observeChanges(scalingRectangleBig)
}



let dragElement = (elmnt) => {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0
    elmnt.onmousedown = dragMouseDown
    elmnt.ontouchstart = dragMouseDown
  
    function dragMouseDown(e) {
      document.onmouseup = closeDragElement
      document.onmousemove = elementDrag
      document.ontouchend = closeDragElement
      document.ontouchmove = elementDrag
      let svgP = getSvgCoords(e) 
      pos1 = svgP.x
      pos2 = svgP.y
    }
  
    function elementDrag(e) {
      let svgP = getSvgCoords(e)
      pos3 = svgP.x
      pos4 = svgP.y
    }
  
    function closeDragElement() {
      document.onmouseup = null
      document.onmousemove = null
      document.ontouchend = null
      document.ontouchmove = null
      let offset = pos1 - pos3
      let bigRectXNew = parseInt(scalingRectangleBig.getAttribute('x')) - offset
      let bigRectWidth = parseInt(scalingRectangleBig.getAttribute('width'))
      let bigRectMaxXNew = bigRectXNew + bigRectWidth
      let smallRectXNew = parseInt(scalingRectangleSmall.getAttribute('x')) - offset
      let minimapStartXCoord = parseInt(minimapElement.getAttribute('x'))
      let minimapEndXCoord = parseInt(minimapElement.getAttribute('x')) + parseInt(minimapElement.getAttribute('width'))
      if (bigRectXNew <= minimapStartXCoord) {
        scalingRectangleBig.setAttribute('x', String(minimapStartXCoord))
        scalingRectangleSmall.setAttribute('x', String(minimapStartXCoord + 20))
      } else if (bigRectMaxXNew >= minimapEndXCoord) {
        scalingRectangleBig.setAttribute('x', String(minimapEndXCoord - bigRectWidth))
        scalingRectangleSmall.setAttribute('x', String(minimapEndXCoord - bigRectWidth + 20))
      } else {
        scalingRectangleBig.setAttribute('x', String(bigRectXNew))
        scalingRectangleSmall.setAttribute('x', String(smallRectXNew))
      }
    }
}

/**
 * Styling and themes utilities
 */
let switchTheme = () => {
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

let toggleClass = (el, className) => {
    if (el.classList) {
        el.classList.toggle(className)
    } else {
        let classes = el.className.split(' ')
        let existingIndex = classes.indexOf(className)
        if (existingIndex >= 0) {
            classes.splice(existingIndex, 1)
        } else {
            classes.push(className)
        }
        el.className = classes.join(' ')
    }
}

function animateCSS(element, animationName, callback) {
    const node = document.querySelector(element)
    node.classList.add('animated', animationName)

    function handleAnimationEnd() {
        // node.classList.remove('animated', animationName)
        node.removeEventListener('animationend', handleAnimationEnd)

        if (typeof callback === 'function') callback()
    }

    node.addEventListener('animationend', handleAnimationEnd)
}

/**
 * Parsing data from JSON 
 */
let getChartData = (object) => {
    return JSON.parse(object)
}

let getFullFormattedData = (data) => {
    let fullData = []
    for (let l = 0; l < data.length; l++) {
        fullData.push(getFormattedDataForOneChart(data[l]))
    }
    return fullData
}

let getFormattedDataForOneChart = (chartData) => {
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
let drawBigCharts = (chartData, svg, XminSvg, YmaxSvg, maxXDistance, maxYDistance) => {
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

let drawVerticalLine = (e) => {
    let verticalLineEl = document.getElementById('verticalLine')
    if (verticalLineEl !== null) {
        verticalLineEl.parentNode.removeChild(verticalLineEl)
    }
    let line
    let svgPoint = getSvgCoords(e)
    let svgPx = svgPoint.x
    let svgPy = svgPoint.y
    // console.log(svgPoint)
    if (isInsideSvgField(svgPx, svgPy, XminSvg, XmaxSvg, YminSvg, YmaxSvg)) {
        line = document.createElementNS(svgns,'line')
        line.setAttribute('id', 'verticalLine')
        line.setAttributeNS(null, 'id', 'verticalLine')
        line.setAttributeNS(null, 'x1', svgPx)
        line.setAttributeNS(null, 'y1', upperLineY)
        line.setAttributeNS(null, 'x2', svgPx)
        line.setAttributeNS(null, 'y2', baseLineY)
        line.classList.add('grid')
        chartArea.appendChild(line)    
        if (sampleChartEl != null && intersectRect(line, sampleChartEl)) {
            //There will be code about creating point of intersection
        }
    }
}

let getSvgCoords = (e) => {
    let pt = svg.createSVGPoint(), svgP
    pt.x = e.clientX || e.targetTouches[0].clientX
    pt.y = e.clientY || e.targetTouches[0].clientY
    svgP = pt.matrixTransform(svg.getScreenCTM().inverse())
    return svgP
}

let isInsideSvgField = (svgPx, svgPy, XminSvg, XmaxSvg, YminSvg, YmaxSvg) => {
    return svgPx >= XminSvg && svgPx <= XmaxSvg && svgPy >= YminSvg && svgPy <= YmaxSvg
}

let intersectRect = (r1, r2) => {
    var r1 = r1.getBoundingClientRect()
    var r2 = r2.getBoundingClientRect()
    return !(r2.left > r1.right || 
           r2.right < r1.left || 
           r2.top > r1.bottom ||
           r2.bottom < r1.top)
}

/**
 * Drawing minimap charts
 */
let drawMinimap = (chartData, minimapEl) => {
    const offsetX = parseInt(minimapEl.getAttribute('x'))
    const offsetY = parseInt(minimapEl.getAttribute('y')) + parseInt(minimapEl.getAttribute('height'))
    const minimapElMaxX = offsetX + parseInt(minimapEl.getAttribute('width')) 
    const minimapElMaxY = parseInt(minimapEl.getAttribute('y'))
    const maxYDistance = Math.abs(minimapElMaxY - offsetY) 
    const maxXDistance = Math.abs(minimapElMaxX - offsetX)
    drawMinimapCharts(chartData, offsetX, offsetY, maxXDistance, maxYDistance)
}

let drawMinimapCharts = (chartData, offsetX, offsetY, maxXDistance, maxYDistance) => {
    for (let i = 0; i < chartData.yColumns.length; i++) {
        let currentColumn = chartData.yColumns[i]
        let currPolyline = createBasicPolyLine("mini-" +chartData.names[i], chartData.colors[i]);
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

let drawBigChartsFromMinimap = (chartData) => {
    let scalingRectXmin = parseInt(scalingRectangleBig.getAttribute('x'))
    let scalingRectXmax = scalingRectXmin + parseInt(scalingRectangleBig.getAttribute('width'))
    //temporary here
    const XminSvg = parseInt(document.getElementById('baseLine').getAttribute('x1'))
    const XmaxSvg = parseInt(document.getElementById('baseLine').getAttribute('x2'))
    const YminSvg = parseInt(document.getElementById('upperLine').getAttribute('y1'))
    const YmaxSvg = parseInt(document.getElementById('baseLine').getAttribute('y1'))
}

let findClosest = (arr, target) => { 
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
            if (mid > 0 && target > arr[mid - 1])  
                return getClosest(arr[mid - 1],  
                              arr[mid], target) 
            j = mid               
        } 
        else { 
            if (mid < n-1 && target < arr[mid + 1])  
                return getClosest(arr[mid],  
                      arr[mid + 1], target)                 
            i = mid + 1 // update i 
        } 
    } 
    return arr[mid] 
} 


let calculateXStep = (maxXDistance, xPointCount) => {
    return maxXDistance/xPointCount
}

let createBasicPolyLine = (id, color) => {
    let minimapChart = document.createElementNS(svgns, 'polyline')
    minimapChart.setAttributeNS(null, 'id', id)
    minimapChart.setAttributeNS(null, 'fill', 'none')
    minimapChart.setAttributeNS(null, 'stroke', color)
    minimapChart.setAttributeNS(null, 'stroke-width', '1')
    return minimapChart
}