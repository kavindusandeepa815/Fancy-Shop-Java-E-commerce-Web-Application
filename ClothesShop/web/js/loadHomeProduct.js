async function loadNewProduct() {

    const response = await fetch(
            "LoadHomeProducts",
            );

    if (response.ok) {
        const json = await response.json();
        console.log(json);
        updateProductView(json);
    } else {
        console.log("Something went wrong.")
    }
}

var st_product = document.getElementById("st-product");

function updateProductView(json) {

    let st_product_container = document.getElementById("st-product-container");

    st_product_container.innerHTML = "";

    json.productList.forEach(product => {
        let st_product_clone = st_product.cloneNode(true);

        //update cards
        st_product_clone.querySelector("#st-product-al").href = "product-details.html?id=" + product.id;
        st_product_clone.querySelector("#st-product-img").src = "product-images/" + product.id + "/image1.png";
        st_product_clone.querySelector("#st-product-title").innerHTML = product.title;
        st_product_clone.querySelector("#st-product-price").innerHTML = new Intl.NumberFormat(
                "en-US",
                {
                    minimumFractionDigits: 2
                }
        ).format(product.price);

        st_product_container.appendChild(st_product_clone);

    });

}


