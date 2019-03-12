const svgns = "http://www.w3.org/2000/svg"
const svg = document.getElementById('chart')
const baseLineY = document.getElementById('baseLine').getAttribute('y1')
const upperLineY = document.getElementById('upperLine').getAttribute('y1')
const sampleChartEl = document.getElementById('sampleChart')
const minimapElement = document.getElementById('minimap')

document.addEventListener("DOMContentLoaded", function() {
    const buttonEl = document.getElementById('button')
    buttonEl.onclick = function() {
        switchTheme()
    }
    svg.addEventListener('mousemove', drawVerticalLine, false);
    const data = getChartData(chartData)
    // console.log(data)
    //Drawing first minimap
    drawchartsForMinimap(data[0], minimapElement)
});

/**
 * Styling and themes
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

let getChartData = function(object) {
    return JSON.parse(object)
}

/**
 * Drawing for First chart
 */
let drawVerticalLine = function(e) {
    let verticalLineEl = document.getElementById('verticalLine')
    if (verticalLineEl !== null) {
        verticalLineEl.parentNode.removeChild(verticalLineEl)
    }
    let pt = svg.createSVGPoint(), svgP, line
    pt.x = e.clientX
    pt.y = e.clientY
    svgP = pt.matrixTransform(svg.getScreenCTM().inverse())
    line = document.createElementNS(svgns,'line')
    line.setAttribute('id', 'verticalLine')
    line.setAttributeNS(null, 'id', 'verticalLine')
    line.setAttributeNS(null, 'x1', svgP.x)
    line.setAttributeNS(null, 'y1', upperLineY)
    line.setAttributeNS(null, 'x2', svgP.x)
    line.setAttributeNS(null, 'y2', baseLineY)
    line.classList.add('grid')
    svg.appendChild(line)    
    if (sampleChartEl != null && intersectRect(line, sampleChartEl)) {
        //There will be code about creating point of intersection
    }
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

// function drawMinimap(data) {
//     
// }

let drawchartsForMinimap = function (chartData, minimapEl) {
    let minimapElXOrigin = parseInt(minimapEl.getAttribute('x'))
    let minimapElYOrigin = parseInt(minimapEl.getAttribute('y')) + parseInt(minimapEl.getAttribute('height'))
    let minimapElMaxX = minimapElXOrigin + parseInt(minimapEl.getAttribute('width')) 
    let minimapElMaxY = parseInt(minimapEl.getAttribute('y'))
    let pointsCount = chartData.columns[0].length - 1
    let maxYDistance = Math.abs(minimapElMaxY - minimapElYOrigin) 
    let maxXDistance = Math.abs(minimapElMaxX - minimapElXOrigin)

    let minimapChart = document.createElementNS(svgns, 'polyline')
    minimapChart.setAttributeNS(null, 'id', 'polyLineMinimap1')
    minimapChart.setAttributeNS(null, 'fill', 'none')
    minimapChart.setAttributeNS(null, 'stroke', chartData.colors.y0)
    minimapChart.setAttributeNS(null, 'stroke-width', '2')

    let minimapChart2 = document.createElementNS(svgns, 'polyline')
    minimapChart2.setAttributeNS(null, 'id', 'polyLineMinimap2')
    minimapChart2.setAttributeNS(null, 'fill', 'none')
    minimapChart2.setAttributeNS(null, 'stroke', chartData.colors.y1)
    minimapChart2.setAttributeNS(null, 'stroke-width', '2')

    let firstChartArray = chartData.columns[1]
    let secondChartArray = chartData.columns[2]
    let maxFirstArray = Math.max.apply(null, firstChartArray.slice(1, firstChartArray.length -1));
    let maxSecondArray = Math.max.apply(null, firstChartArray.slice(1, secondChartArray.length -1));

    for (let i = 1; i < chartData.columns[0].length; i++) {
        let point = svg.createSVGPoint()
        xcoord = minimapElXOrigin + (i * maxXDistance)/pointsCount
        point.x = xcoord;
        point.y = minimapElYOrigin - (maxYDistance*firstChartArray[i])/maxFirstArray;
        minimapChart.points.appendItem(point);

        let point2 = svg.createSVGPoint()
        point2.x = xcoord;
        point2.y = minimapElYOrigin - (maxYDistance*secondChartArray[i])/maxSecondArray;
        minimapChart2.points.appendItem(point2);
    }
    svg.appendChild(minimapChart)
    svg.appendChild(minimapChart2)

}