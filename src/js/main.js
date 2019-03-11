const svgns = "http://www.w3.org/2000/svg"
const svg = document.getElementById('chart')
const baseLineY = document.getElementById('baseLine').getAttribute('y1')
const upperLineY = document.getElementById('upperLine').getAttribute('y1')
const sampleChartEl = document.getElementById('sampleChart')

document.addEventListener("DOMContentLoaded", function(event) {
    const buttonEl = document.getElementById('button')
    buttonEl.onclick = function() {
        switchTheme()
    }
    const data = getChartData(chartData)
    svg.addEventListener('mousemove', drawVerticalLine, false);
});

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

let drawVerticalLine = function(e) {
    let verticalLineEl = document.getElementById('verticalLine')
    if (verticalLineEl !== null) {
        verticalLineEl.parentNode.removeChild(verticalLineEl)
    }
    let pt = svg.createSVGPoint(), svgP, line
    pt.x = e.clientX;
    pt.y = e.clientY;
    svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    line = document.createElementNS(svgns,'line')
    line.setAttribute('x1', svgP.x)
    line.setAttribute('y1', upperLineY)
    line.setAttribute('x2', svgP.x)
    line.setAttribute('y2', baseLineY)
    line.classList.add('grid')
    line.setAttribute('id', 'verticalLine')
    svg.appendChild(line)    
    if (intersectRect(line, sampleChartEl)) {
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