let cart = [];

function addToCart(product, price) {
    cart.push({ product, price });
    updateCart();
}

function updateCart() {
    const cartList = document.getElementById("cart-items");
    const totalPrice = document.getElementById("cart-total");

    cartList.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.product} - ₹${item.price}`;
        cartList.appendChild(li);
        total += item.price;
    });

    totalPrice.textContent = total;
}

function checkout() {
    alert("Thank you for your order!");
    cart = [];
    updateCart();
}
