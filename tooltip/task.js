const links = document.querySelectorAll('.has-tooltip')

links.forEach((link, index) => {
    link.addEventListener("click", (event) => {
        event.preventDefault()

        const toolTip = event.target.querySelector('.tooltip')
        const oldToolTip = document.querySelector('.tooltip_active')

        function positionToolTip (toolTip) {
            const tooltipRect = toolTip.getBoundingClientRect()
            const targetRect = event.target.getBoundingClientRect()

            let left, top

            left = targetRect.left
            if (left < 5) left = 5

            top = targetRect.top - tooltipRect.height - 2
            if (top < 170) {
                top = targetRect.top + targetRect.height + 2
            }

            toolTip.style.left = left +'px'
            toolTip.style.top = top + 'px'
        }

        if (toolTip && toolTip.classList.contains('tooltip_active')) {

            toolTip.remove("tooltip_active")

        } else if (toolTip && oldToolTip) {

            oldToolTip.classList.remove("tooltip_active")
            toolTip.classList.add('tooltip_active')
            positionToolTip(toolTip)

        } else  {
            if (oldToolTip) {
                oldToolTip.classList.remove("tooltip_active")
            }

            const element = document.createElement('div')
            element.innerHTML = event.target.getAttribute('title')
            element.classList = `tooltip tooltip_active`

            event.target.insertAdjacentElement("afterbegin", element)
            positionToolTip(element)
        }
    })
})
