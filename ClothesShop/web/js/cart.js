const notifier = new AWN({
    position: "top-right"
});


async function loadCartItems() {


    const response = await fetch(
            "LoadCartItems"
            );
    if (response.ok) {

        const json = await response.json();

        if (json.length === 0) {
            notifier.success("Cart is empty");

        } else {

            let cartItemContainer = document.getElementById("cart-item-container");
            let cartItemRow = document.getElementById("cart-item-row");

            cartItemContainer.innerHTML = " ";

            let totalQty = 0;
            let total = 0;

            json.forEach(item => {

                let itemSubTotal = item.product.price * item.qty;

                totalQty += item.qty;
                total += itemSubTotal;

                let cartItemRowClone = cartItemRow.cloneNode(true);
                cartItemRowClone.querySelector("#cart-item-a").href = "product-details.html?id=" + item.product.id;
                cartItemRowClone.querySelector("#cart-item-img").src = "product-images/" + item.product.id + "/image1.png";
                cartItemRowClone.querySelector("#cart-item-title").innerHTML = item.product.title;
                cartItemRowClone.querySelector("#cart-item-price").innerHTML = "Rs. " + new Intl.NumberFormat(
                        "en-US",
                        {
                            minimumFractionDigits: 2
                        }
                ).format(item.product.price);
                cartItemRowClone.querySelector("#cart-item-qty").value = item.qty;
                cartItemRowClone.querySelector("#cart-item-subtotal").innerHTML = new Intl.NumberFormat(
                        "en-US",
                        {
                            minimumFractionDigits: 2
                        }
                ).format(itemSubTotal);
                cartItemRowClone.querySelector(".removeFromCart").addEventListener("click", function () {
                    removeFromCart(item.product.id);
                });


                cartItemContainer.appendChild(cartItemRowClone);

            });

            document.getElementById("cart-total-qty").innerHTML = totalQty;
            document.getElementById("cart-total").innerHTML = "Rs. " + new Intl.NumberFormat(
                    "en-US",
                    {
                        minimumFractionDigits: 2
                    }
            ).format(total);

        }

    } else {
        notifier.alert("Please try again later");
    }

}

async function removeFromCart(id) {
    const response = await fetch("RemoveItemFromCart?id=" + id);

    if (response.ok) {
        const json = await response.json();
        console.log(json);
        if (json.success) {
            loadCartItems();
        }
    } else {
        notifier.alert("Server Error Please Try Again Later");
     }

}



