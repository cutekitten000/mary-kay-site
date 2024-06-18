document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.querySelector('.menu-toggle');
    const links = document.querySelector('.links');

    menuToggle.addEventListener('click', function () {
        links.classList.toggle('active');
    });

    const cartIcon = document.querySelector('.cart-icon');
    const cartModal = document.querySelector('.cart-modal');
    const closeModal = document.querySelector('.close-modal');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartCount = document.querySelector('.cart-count');
    const cartItemsList = document.querySelector('.cart-items');
    const cartTotalPrice = document.querySelector('.cart-total-price');

    let cart = [];
    let totalItems = 0;
    let totalPrice = 0;

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productName = button.getAttribute('data-name');
            const productPrice = parseFloat(button.getAttribute('data-price'));

            console.log(`Adicionando ${productName} ao carrinho por R$ ${productPrice}`);

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

    cartIcon.addEventListener('click', () => {
        console.log('Clicou no ícone do carrinho');
        console.log('Modal antes de mudar display:', cartModal.style.display);
        cartModal.style.display = 'flex';
        console.log('Modal depois de mudar display:', cartModal.style.display);
    });

    closeModal.addEventListener('click', () => {
        console.log('Clicou para fechar o modal do carrinho');
        cartModal.style.display = 'none';
        console.log('Modal depois de mudar display:', cartModal.style.display);
    });

    function updateCart() {
        console.log('Atualizando o carrinho');
        cartItemsList.innerHTML = '';
        cart.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${item.name} (R$ ${item.price.toFixed(2)}) x ${item.quantity}
                <ion-icon name="trash-outline" data-name="${item.name}"></ion-icon>
            `;
            cartItemsList.appendChild(li);
        });
        cartTotalPrice.textContent = `R$ ${totalPrice.toFixed(2)}`;

        const removeIcons = cartItemsList.querySelectorAll('ion-icon');
        removeIcons.forEach(icon => {
            icon.addEventListener('click', (event) => {
                const productName = event.target.getAttribute('data-name');
                const product = cart.find(item => item.name === productName);

                if (product) {
                    totalItems -= product.quantity;
                    totalPrice -= product.price * product.quantity;
                    cart = cart.filter(item => item.name !== productName);
                    cartCount.textContent = totalItems;
                    updateCart();
                }
            });
        });
    }
});
