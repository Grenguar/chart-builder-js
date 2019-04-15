import { ChartData } from './chartData'
import { Utils } from './utils'
import { Minimap } from './minimap'
import { Draw } from './draw'


const svg = document.getElementById('chart'),
minimapElement = document.getElementById('minimap'),
scalingRectangleElement = document.getElementById('scalingRectangle'),
bigChartElement = document.getElementById('bigChart'),
chartData = new ChartData(),
utils = new Utils(),
firstData = chartData.getFirstData(),
draw = new Draw(bigChartElement, minimapElement, scalingRectangleElement, firstData),
buttonEl = document.getElementById('button')

document.addEventListener("DOMContentLoaded", () => {
    draw.dragElement(scalingRectangleElement)
    document.onmousemove = (e) => {draw.drawVerticalLine(e)}
    draw.makeChartAreaScrollable()
    buttonEl.onclick = () => {utils.switchTheme()}
    new Minimap(firstData, minimapElement)
    draw.drawBigCharts()
})
