document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const links = document.querySelector('.links');
    const cartIcon = document.querySelector('.carrinho');
    const cartModal = document.querySelector('.cart-modal');
    const closeModal = document.querySelector('.close-modal');
    const cartCount = document.querySelector('.cart-count');
    const cartItemsList = document.querySelector('.cart-items');
    const cartTotalPrice = document.querySelector('.cart-total-price');
    const cardsContainer = document.querySelector('.cards');

    let cart = [];
    let totalItems = 0;
    let totalPrice = 0;

    // Adicionar rolagem suave
    document.querySelectorAll('.links a').forEach(link => {
        link.addEventListener('click', () => {
            links.classList.remove('active');
        });
    });

    // Carregar produtos do JSON
    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            products.forEach(product => {
                if (product.available) {
                    const card = document.createElement('div');
                    card.className = 'card';
                    card.innerHTML = `
                        <img src="${product.image}" alt="${product.name}">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-price">R$ ${product.price.toFixed(2)}</p>
                        <button class="add-to-cart" data-name="${product.name}" data-price="${product.price}">Adicionar ao Carrinho</button>
                    `;
                    cardsContainer.appendChild(card);
                }
            });

            document.querySelectorAll('.add-to-cart').forEach(button => {
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

                    Toastify({
                        text: `${productName} adicionado ao carrinho`,
                        duration: 3000,
                        close: true,
                        gravity: "top",
                        position: "right",
                        backgroundColor: "#ff69b4",
                        stopOnFocus: true,
                    }).showToast();
                });
            });
        });

    // Alternar menu
    menuToggle.addEventListener('click', () => {
        links.classList.toggle('active');
    });

    // Abrir modal
    cartIcon.addEventListener('click', () => {
        cartModal.style.display = 'flex';
    });

    // Fechar modal
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
                    totalItems -= 1;
                    totalPrice -= product.price;
                    product.quantity -= 1;

                    if (product.quantity === 0) {
                        cart = cart.filter(item => item.name !== productName);
                    }

                    cartCount.textContent = totalItems;
                    updateCart();

                    Toastify({
                        text: `${productName} removido do carrinho`,
                        duration: 3000,
                        close: true,
                        gravity: "top",
                        position: "right",
                        backgroundColor: "#ff69b4",
                        stopOnFocus: true,
                    }).showToast();
                }
            });
        });
    }

    // Fechar modal ao clicar fora
    window.addEventListener('click', (event) => {
        if (event.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
});
