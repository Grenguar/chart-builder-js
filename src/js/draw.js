import { Calc } from "./calc";
import { svgns } from './const'
import { Utils } from "./utils";

export class Draw {

    constructor(bigChartEl, minimapEl, scalingRectangleEl) {
        this.bigChartEl = bigChartEl
        this.minimapEl = minimapEl
        this.scalingRectangleEl = scalingRectangleEl
        this.__svg = this.bigChartEl.parentNode
        //private methods
        getMinicharts.bind(this)
        //private fields
        this.__scalingRectangleBig = this.scalingRectangleEl.getElementsByClassName('bigRect')[0]
        this.__scalingRectangleSmall = this.scalingRectangleEl.getElementsByClassName('smallRect')[0]
        this.__chartArea = this.bigChartEl.getElementsByClassName('chartArea')[0]
        this.__gridX = this.bigChartEl.getElementsByClassName('x-grid')[0]
    }

    static createBasicPolyLine(id, color) {
        let line = document.createElementNS(svgns, 'polyline')
        line.setAttributeNS(null, 'id', id)
        line.setAttributeNS(null, 'fill', 'none')
        line.setAttributeNS(null, 'stroke', color)
        line.setAttributeNS(null, 'stroke-width', '1')
        return line
    }

    static getSvgCoords(e, svg) {
        let pt = svg.createSVGPoint(), svgP
        pt.x = e.clientX || e.targetTouches[0].clientX
        pt.y = e.clientY || e.targetTouches[0].clientY
        svgP = pt.matrixTransform(svg.getScreenCTM().inverse())
        return svgP
    }

    drawVerticalLine(e, callback) {
        const baseLineEl = document.getElementById('baseLine')
        const XminSvg = parseFloat(baseLineEl.getAttribute('x1'))
        const XmaxSvg = parseFloat(baseLineEl.getAttribute('x2'))
        const YminSvg = parseFloat(document.getElementById('upperLine').getAttribute('y1'))
        const YmaxSvg = parseFloat(baseLineEl.getAttribute('y1'))
        const baseLineY = document.getElementById('baseLine').getAttribute('y1')
        const upperLineY = document.getElementById('upperLine').getAttribute('y1')
        let verticalLineEl = document.getElementById('verticalLine')
        if (verticalLineEl !== null) {
            verticalLineEl.parentNode.removeChild(verticalLineEl)
        }
        let line
        let svgPoint = Draw.getSvgCoords(e, this.__svg)
        let svgPx = svgPoint.x
        let svgPy = svgPoint.y
        if (Calc.isInsideField(svgPx, svgPy, XminSvg, XmaxSvg, YminSvg, YmaxSvg)) {
            line = document.createElementNS(svgns,'line')
            line.setAttribute('id', 'verticalLine')
            line.setAttributeNS(null, 'id', 'verticalLine')
            line.setAttributeNS(null, 'x1', svgPx)
            line.setAttributeNS(null, 'y1', upperLineY)
            line.setAttributeNS(null, 'x2', svgPx)
            line.setAttributeNS(null, 'y2', baseLineY)
            line.classList.add('grid')
            this.__chartArea.appendChild(line)    
            if (typeof callback === "function" && this.__chartArea != null && this.intersectRect(line, this.__chartArea)) {
                //callback will happen
            }   
        }
    }

    intersectRect(r1, r2) {
        r1 = r1.getBoundingClientRect(), 
        r2 = r2.getBoundingClientRect()
        return !(r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top)
    }

    makeChartAreaScrollable() {
        let scrollDistance = 0
        let scrollDistanceX = 0
        const root = this.bigChartEl.getElementsByClassName('chartArea')[0]
        const parent = root.parentNode
        root.setAttribute("clip-path", "url(#chartArea-clip-path)")
        const rootBBox = {
            x: parseFloat(chartArea.getAttribute("x")),
            y: parseFloat(chartArea.getAttribute("y")),
            width: parseFloat(chartArea.getAttribute("width")),
            height: parseFloat(chartArea.getAttribute("height"))
        }
        const contentItems = chartArea.children
        const content = document.createElementNS(svgns, "g")
        content.setAttributeNS(null, 'id', 'content')
        content.setAttributeNS(null, 'class', 'content')
        content.setAttributeNS(null, 'transform', `translate(${rootBBox.x},${rootBBox.y})`)
        Utils.makeArray(contentItems).forEach((child) => {
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
        let observeChanges = (targetNode, callback) => {
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
        observeChanges(this.__scalingRectangleBig)
    }
    

    dragElement(elmnt, callback) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0
        elmnt.onmousedown = dragMouseDown
        elmnt.ontouchstart = dragMouseDown
        const scalingRectangleBig = this.__scalingRectangleBig
        const scalingRectangleSmall = this.__scalingRectangleSmall
        const minimap = this.minimapEl
        const svg = this.__svg
      
        function dragMouseDown(e) {
          document.onmouseup = closeDragElement
          document.onmousemove = elementDrag
          document.ontouchend = closeDragElement
          document.ontouchmove = elementDrag
          let svgP = Draw.getSvgCoords(e, svg) 
          pos1 = svgP.x
          pos2 = svgP.y
        }
      
        function elementDrag(e) {
          let svgP = Draw.getSvgCoords(e, svg)
          pos3 = svgP.x
          pos4 = svgP.y
        }
      
        function closeDragElement() {
          document.onmouseup = null
          document.onmousemove = null
          document.ontouchend = null
          document.ontouchmove = null
          let offset = pos1 - pos3
          if (typeof callback === 'function') {
            callback()
          } else {
            let bigRectXNew = parseFloat(scalingRectangleBig.getAttribute('x')) - offset
            let bigRectWidth = parseFloat(scalingRectangleBig.getAttribute('width'))
            let bigRectMaxXNew = bigRectXNew + bigRectWidth
            let smallRectXNew = parseFloat(scalingRectangleSmall.getAttribute('x')) - offset
            let minimapStartXCoord = parseFloat(minimap.getAttribute('x'))
            let minimapEndXCoord = parseFloat(minimap.getAttribute('x')) + parseFloat(minimap.getAttribute('width'))
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
    }

    drawBigChart() {
        const polylines = getMinicharts(this.__svg)
        const baseLineEl = this.__gridX.getElementsByClassName('baseLine')[0]
        let baseLineElY = parseFloat(baseLineEl.getAttribute('y1'))
        let baseLineElX = parseFloat(baseLineEl.getAttribute('x1'))
        let minimapElY = parseFloat(this.minimapEl.getAttribute('y')) + parseFloat(this.minimapEl.getAttribute('height'))
        let polyLineOffset = baseLineElY - minimapElY
        console.log("baseLine: " + baseLineElY + " minimap: " + minimapElY)
        let content = this.__chartArea.getElementsByClassName('content')[0]
        console.log("OFFSET: " + polyLineOffset)

        for (let i = 0; i < polylines.length; i++) {
            let newPolyline = polylines[i].cloneNode(true)
            newPolyline.setAttributeNS(null, 'class', 'bigChart')
            newPolyline.setAttributeNS(null, 'id', newPolyline.getAttribute('id').replace('mini', 'big'))
            //TODO: Get proper translating and scaling, add sliding
            newPolyline.setAttributeNS(null, 'transform', `translate(${-baseLineElX},${polyLineOffset}) scale(2, 1)`)
            content.appendChild(newPolyline)
        }

    }
}

function getMinicharts(parent) {
    let polylines = []
    Utils.makeArray(parent.children).forEach((child) => {
        if (child.getAttribute('class') === 'minichart') {
            polylines.push(child)
        }
    })
    return polylines
}