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
    const checkoutButton = document.querySelector('.checkout-button');
    const customerNameInput = document.getElementById('customer-name');
    const whatsappNumberInput = document.getElementById('whatsapp-number');

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

                    checkCheckoutButton();
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

    // Verificar se pode habilitar o botão de finalizar compra
    function checkCheckoutButton() {
        const customerName = customerNameInput.value.trim();
        checkoutButton.disabled = cart.length === 0 || customerName === '';
    }

    // Monitorar mudanças no campo de nome do comprador
    customerNameInput.addEventListener('input', checkCheckoutButton);

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

        checkCheckoutButton();
    }

    // Fechar modal ao clicar fora
    window.addEventListener('click', (event) => {
        if (event.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    // back to top button
    const backToTopButton = document.getElementById('back-to-top');

    // Mostrar/ocultar botão de voltar ao topo
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    // Rolar para o topo ao clicar no botão
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Finalizar compra e enviar via WhatsApp
    checkoutButton.addEventListener('click', () => {
        const customerName = customerNameInput.value.trim();
        const whatsappNumber = whatsappNumberInput.value.trim();

        if (!customerName) {
            Toastify({
                text: "Por favor, insira o nome do comprador",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                backgroundColor: "#ff69b4",
                stopOnFocus: true,
            }).showToast();
            return;
        }

        let message = `Nome do Comprador: ${customerName}\n\n`;
        message += `Itens no Carrinho:\n`;

        cart.forEach(item => {
            message += `- ${item.name} (R$ ${item.price.toFixed(2)}) x ${item.quantity}\n`;
        });
    
        message += `\nTotal: R$ ${totalPrice.toFixed(2)}`;
    
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });
});
