// ================ TOGGLE MENU =======================
const menuToggle = document.querySelector('.menu-toggle');
const links = document.querySelector('.links');

menuToggle.addEventListener('click', function () {
    links.classList.toggle('active');
});

// ==================== CART ==========================
const cartIcon = document.querySelector('.carrinho');
const cartModal = document.querySelector('.cart-modal');
const closeModal = document.querySelector('.close-modal');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartCount = document.querySelector('.cart-count');
const cartItemsList = document.querySelector('.cart-items');
const cartTotalPrice = document.querySelector('.cart-total-price');

let cart = [];
let totalItems = 0;
let totalPrice = 0;

// adicionar itens ao carrinho
addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const productName = button.getAttribute('data-name');
        const productPrice = parseFloat(button.getAttribute('data-price'));

        const product = cart.find(item => item.name === productName);
        if (product) {
            product.quantity++;
        } else {
            cart.push({ name: productName, price: productPrice, quantity: 1 });
        }

        totalItems++;
        totalPrice += productPrice;

        cartCount.textContent = totalItems;
        updateCart();
    });
});


// Abrir modal
cartIcon.addEventListener('click', () => {
    cartModal.style.display = 'flex';
});

// fechar o modal
closeModal.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

// Atualizar carrinho
function updateCart() {
    cartItemsList.innerHTML = '';
    cart.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${item.name} (R$ ${item.price.toFixed(2)}) x ${item.quantity}
            <ion-icon name="trash-outline" data-name="${item.name}"></ion-icon>
        `;
        cartItemsList.appendChild(li);
    });

    // Evitar total negativo
    if (totalPrice < 0) {
        totalPrice = 0;
    }

    cartTotalPrice.textContent = `R$ ${totalPrice.toFixed(2)}`;

    const removeIcons = cartItemsList.querySelectorAll('ion-icon');
    removeIcons.forEach(icon => {
        icon.addEventListener('click', (event) => {
            const productName = event.target.getAttribute('data-name');
            const product = cart.find(item => item.name === productName);

            if (product && product.quantity > 0) {
                // Decrementar a quantidade do item
                totalItems -= 1;
                totalPrice -= product.price;
                product.quantity -= 1;

                if (product.quantity === 0) {
                    // Remover item do carrinho se a quantidade for 0
                    cart = cart.filter(item => item.name !== productName);
                }

                // Atualizar contagem de itens
                cartCount.textContent = totalItems;
                updateCart();
            }
        });
    });
}

// Fechar modal ao clicar fora - Modificação
window.addEventListener('click', (event) => {
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// Fechar menu ao clicar em um link - Modificação
document.querySelectorAll('.links a').forEach(link => {
    link.addEventListener('click', () => {
        links.classList.remove('active');
    });
});

// ====================================================
