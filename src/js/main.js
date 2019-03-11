document.addEventListener("DOMContentLoaded", function(event) {
    const buttonEl = document.getElementById('button')
    buttonEl.onclick = function() {
        toggleButtonText(buttonEl)
    }
    console.log(JSON.stringify(data))
});

let toggleButtonText = function(buttonElement) {
    buttonElement.innerText = buttonElement.innerText.indexOf("Night") === -1 ? "Switch to Night Mode" : "Switch to Day Mode"
}


// if (el.classList) {
//     el.classList.toggle(className);
//   } else {
//     var classes = el.className.split(' ');
//     var existingIndex = classes.indexOf(className);
  
//     if (existingIndex >= 0)
//       classes.splice(existingIndex, 1);
//     else
//       classes.push(className);
  
//     el.className = classes.join(' ');
// }


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