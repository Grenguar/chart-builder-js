import { ChartData } from './chartData'
import { Utils } from './utils'
import { Minimap } from './minimap'
import { Draw } from './draw'


const svg = document.getElementById('chart')
const minimapElement = document.getElementById('minimap')
const scalingRectangleElement = document.getElementById('scalingRectangle')
const bigChartElement = document.getElementById('bigChart')

const chartData = new ChartData()
const utils = new Utils()
let data = chartData.getFullFormattedData()
const draw = new Draw(bigChartElement, minimapElement, scalingRectangleElement, data[0])

const buttonEl = document.getElementById('button')

document.addEventListener("DOMContentLoaded", () => {
    draw.dragElement(scalingRectangleElement)
    draw.makeChartAreaScrollable()
    svg.onmousemove = (e) => {draw.drawVerticalLine(e)}
    buttonEl.onclick = () => {utils.switchTheme()}
    
    new Minimap(data[0], minimapElement)
    draw.drawBigChart()
})
