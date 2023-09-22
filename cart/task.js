function saveCart() {
    let products
    const cartForSave = Array.from(document.querySelectorAll('.cart__product')).map(productElement => {
        products = {
            id: productElement.getAttribute('data-id'),
            image: productElement.querySelector('img').src,
            quantity: productElement.querySelector('.cart__product-count').textContent
        }
        return products
    })
    localStorage.setItem("cartForSave", JSON.stringify(cartForSave))
}

function loadCart() {
    const storage = localStorage.getItem("cartForSave")
    if (storage) {
        const loadCart = JSON.parse(storage)
        loadCart.forEach( product => {
            createNewProduct(product.id, product.image, product.quantity)
        })
        document.querySelector('.cart').classList.remove('cart__hidden')
    }
}

function addConfirmPopup(title) {
    return new Promise((resolve, reject) => {
        const confirmPopup = document.querySelector('#confirm')
        function clickButtons(event) {
            let result = false
            const action = event.target.getAttribute('id')
            event.target.closest("#confirm").classList.add("hidden")
            if (action === 'btn-yes') {
                resolve(true)
            } else {
                resolve(false)
            }
            buttons.forEach((button) => {
                button.removeEventListener("click", clickButtons)
            })
        }

        if (!confirmPopup) {
            const newElement = document.createElement('div')
            newElement.id = "confirm"
            newElement.classList.add('confirm')
            newElement.innerHTML =
                `<div class="confirm-content">
            <p>Вы хотите удалить товар "${title}" из корзины?</p>
            <div class="confirm-buttons">
                <button class="button" id="btn-yes"> Да </button>
                <button class="button" id="btn-no">Нет </button>
            </div>
        </div>`
            document.body.insertAdjacentElement("afterbegin", newElement)
        } else {
            confirmPopup.classList.remove('hidden')
            confirmPopup.querySelector('p').textContent = `Вы хотите удалить товар ${title} из корзины?`
        }

        const buttons = document.querySelectorAll("button")

        buttons.forEach( button => {
        button.removeEventListener("click", clickButtons)
        button.addEventListener("click", clickButtons)
        })
    })
}
function createNewProduct (id, image, quantity) {
    const cartProducts = document.querySelector('.cart__products')
    const productElement = document.createElement(`div`)

    productElement.classList.add("cart__product")
    productElement.setAttribute('data-id', id)
    productElement.innerHTML =
            `<img class="cart__product-image" src="${image}">
             <div class="cart__product-count">${quantity}</div>`

    cartProducts.appendChild(productElement)
    return productElement
}

function addToCart (event)  {
    if (event.target.classList.contains('product__add')) {

        const product = event.target.closest('.product')
        const id = product.getAttribute('data-id')
        const quantity = Number(product.querySelector('.product__quantity-value').textContent)
        product.querySelector('.product__quantity-value').textContent = '1'
        const image = product.querySelector('img').getAttribute('src')

        const cartProducts = document.querySelectorAll('.cart__product')
        const idArray = Array.from(cartProducts).map(productInCart =>
            productInCart.getAttribute('data-id'))

        if (idArray.length && idArray.includes(id)) {
            const currentProduct = document.querySelector(`.cart__product[data-id="${id}"]`)

            const quantityInCart = Number(currentProduct.querySelector('.cart__product-count')
                .textContent)
            currentProduct.querySelector('.cart__product-count')
                .textContent = (quantityInCart + quantity).toString()
            animationImage(currentProduct, product)

        } else {

            document.querySelector('.cart').classList.remove('cart__hidden')
            const currentProduct = createNewProduct(id, image, quantity)
            animationImage(currentProduct, product)
        }
    }

    removeFromCart()
    saveCart()
}

function removeFromCart() {
    const cart = document.querySelector('.cart')

    function cartClicker(event) {
        const productInCart = event.target.closest('.cart__product')

        if (productInCart) {
            const dataID = productInCart.getAttribute('data-id')
            const title = document.querySelector(`[class="product"][data-id="${dataID}"]`)
                .querySelector('.product__title').textContent.trim()
            cart.removeEventListener('click', cartClicker)

            addConfirmPopup(title).then((answer) => {
                if (answer) {
                    productInCart.remove()
                    saveCart()
                    if (document.querySelectorAll('.cart__product').length === 0) {
                        document.querySelector('.cart').classList.add('cart__hidden')
                    }
                }
            })

            cart.addEventListener('click', cartClicker)
        }
    }

    cart.addEventListener('click', cartClicker)
}

function animationImage(cartProduct, product) {
    const cartProductImage = cartProduct.querySelector('img')
    const productImage = product.querySelector('img')
    const cartProductRect = cartProductImage.getBoundingClientRect()
    const productRect = productImage.getBoundingClientRect()

    const productImageClone = productImage.cloneNode(true)

    productImageClone.style.position = 'absolute'
    productImageClone.style.opacity = '0.5'

    productImageClone.style.left = productRect.left + "px"
    productImageClone.style.top = productRect.top + "px"
    productImageClone.style.width = productRect.width + "px"
    productImageClone.style.height = productRect.height + "px"

    productImage.insertAdjacentElement("beforebegin", productImageClone)

    let productCloneRect = productImageClone.getBoundingClientRect()

    const deltaX = cartProductRect.left - productRect.left
    const deltaY = cartProductRect.top - productRect.top
    const deltaWidth =  cartProductRect.width - productRect.width

    const timeAnimation = 300
    let currentTime = 0

    const countAnimation = 20
    const duration = timeAnimation / countAnimation

    const animation = setInterval(() => {
        if (currentTime >= timeAnimation) {
            productImageClone.style.transform = 'none'
            productImageClone.remove()
            clearInterval(animation)
        }

        const progress = currentTime / timeAnimation

        const newX = deltaX * progress
        const newY = deltaY * progress
        const newWidth = productRect.width + deltaWidth * progress

        productImageClone.style.transform =
            `translate(${newX}px, ${newY}px)`
        productImageClone.style.width = `${newWidth}px`;
        productImageClone.style.height = `${newWidth}px`;

        currentTime += duration
    }, duration)
}


window.addEventListener('load', loadCart)
removeFromCart()

const products = document.querySelector('.products')

document.querySelectorAll('.product__quantity-control_dec').forEach( dec => {
    dec.addEventListener('click', () => {
        const quantity = dec.parentElement.querySelector('.product__quantity-value')
        if (quantity.textContent > 1) {
            quantity.textContent--
        }
    })
})

document.querySelectorAll('.product__quantity-control_inc').forEach( inc => {
    inc.addEventListener('click', () => {
        const quantity = inc.parentElement.querySelector('.product__quantity-value')
        quantity.textContent++
    })
})

products.addEventListener('click', addToCart)

