document.addEventListener("DOMContentLoaded", function(event) {
    const buttonEl = document.getElementById('button')
    buttonEl.onclick = function() {
        switchTheme()
    }
    const data = getChartData(chartData)
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




// Example of dynamic creation of svg
// // create svg
// var svgURI = 'http://www.w3.org/2000/svg';
// var svg = document.createElementNS( svgURI, 'svg' );
// // SVG attributes, like viewBox, are camelCased. That threw me for a loop
// svg.setAttribute( 'viewBox', '0 0 100 100' );
// // create arrow
// var path = document.createElementNS( svgURI, 'path' );
// path.setAttribute( 'd', 'M 50,0 L 60,10 L 20,50 L 60,90 L 50,100 L 0,50 Z' );
// // add class so it can be styled with CSS
// path.setAttribute( 'class', 'arrow' );
// svg.appendChild( path );
// // add svg to page
// element.appendChild( svg );