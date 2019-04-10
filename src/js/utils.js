export class Utils {
    switchTheme() {
        let theme = "day"
        let buttonElement = document.getElementById('button')
        let bodyElement = document.getElementById('body')
        let minimapElement = document.getElementById('minimap')
        let headerElement = document.getElementById('header')
        if (buttonElement.innerText.indexOf("Night") === -1) {
            buttonElement.innerText = "Switch to Night Mode"
            theme = "night"
            this.toggleClass(buttonElement, "day")
            this.toggleClass(bodyElement, "day")
            this.toggleClass(minimapElement, "day")
            this.toggleClass(headerElement, "day")
        } else {
            buttonElement.innerText = "Switch to Day Mode"
            theme = "day"
            this.toggleClass(buttonElement, "night")
            this.toggleClass(bodyElement, "night")
            this.toggleClass(minimapElement, "night")
            this.toggleClass(headerElement, "night")
        }
        this.toggleClass(buttonElement, theme)
        this.toggleClass(bodyElement, theme)
        this.toggleClass(minimapElement, theme)
        this.toggleClass(headerElement, theme)
    }
    
    toggleClass(el, className) {
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
            console.log(classes)
            el.className = classes.join(' ')
        }
    }
}