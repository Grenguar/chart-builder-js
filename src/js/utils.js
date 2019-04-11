export class Utils {

    static makeArray(htmlCollection) {
        if (HTMLCollection.prototype.isPrototypeOf(htmlCollection)) {
            return Array.from(htmlCollection)
        }
        return []
    }

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

    findClosest(arr, target) { 
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
                if (mid > 0 && target > arr[mid - 1]) {
                    return getClosest(arr[mid - 1], arr[mid], target) 
                }
                j = mid               
            } else { 
                if (mid < n-1 && target < arr[mid + 1])   {
                    return getClosest(arr[mid], arr[mid + 1], target)                 
                }
                i = mid + 1
            } 
        } 
        return arr[mid] 
    } 
}