const notifier = new AWN({
    position: "top-right"
});

function changeImage(smallImg) {
    const mainImage = document.getElementById("mainImage");
    mainImage.src = smallImg.src;
}

async function loadProduct() {

    const parameters = new URLSearchParams(window.location.search);

    if (parameters.has("id")) {
        const productId = parameters.get("id");

        const response = await fetch("LoadSingleProduct?id=" + productId);

        if (response.ok) {

            const json = await response.json();

            const id = json.product.id;
            document.getElementById("mainImage").src = "product-images/" + id + "/image1.png";
            document.getElementById("image1").src = "product-images/" + id + "/image1.png";
            document.getElementById("image2").src = "product-images/" + id + "/image2.png";
            document.getElementById("image3").src = "product-images/" + id + "/image3.png";

//            document.getElementById("leftimage1").src = "product-images/" + id + "/image1.png";
//            document.getElementById("leftimage2").src = "product-images/" + id + "/image2.png";
//            document.getElementById("leftimage3").src = "product-images/" + id + "/image3.png";


            document.getElementById("title").innerHTML = json.product.title;
            document.getElementById("product-price").innerHTML = "Rs. " + new Intl.NumberFormat(
                    "en-US",
                    {
                        minimumFractionDigits: 2
                    }
            ).format(json.product.price);
            document.getElementById("product-category").innerHTML = json.product.category.name;
            document.getElementById("product-brand").innerHTML = json.product.brand.name;

            document.getElementById("product-size").innerHTML = json.product.size.name.charAt(0);

            document.getElementById("product-size").className = "d-block";

            document.getElementById("product-color").style.background = json.product.color.name;
            document.getElementById("product-color").className = "d-block";

            document.getElementById("product-qty").value = json.product.qty;
            document.getElementById("product-qtyMax").max = json.product.qty;

            document.getElementById("product-description").innerHTML = json.product.description;


            document.getElementById("add-to-cart-main").addEventListener(
                    "click",
                    (e) => {
                addToCart(json.product.id,
                        document.getElementById("product-qtyMax").value
                        );
                e.preventDefault();
            });



            let ProductHtml = document.getElementById("similar-product");
            document.getElementById("similar-product-main").innerHTML = "";


            json.productList.forEach(item => {
                let ProductCloneHtml = ProductHtml.cloneNode(true);

                ProductCloneHtml.querySelector("#similar-product-a1").href = "product-details.html?id=" + item.id;
                ProductCloneHtml.querySelector("#similar-product-image").src = "product-images/" + item.id + "/image1.png";
                ProductCloneHtml.querySelector("#similar-product-title").innerHTML = item.title;
                ProductCloneHtml.querySelector("#similar-product-price").innerHTML = "Rs. " + new Intl.NumberFormat(
                        "en-US",
                        {
                            minimumFractionDigits: 2
                        }
                ).format(item.price);

                document.getElementById("similar-product-main").appendChild(ProductCloneHtml);


            });

//            $('.recent-product-activation').slick({
//                infinite: true,
//                slidesToShow: 4,
//                slidesToScroll: 4,
//                arrows: true,
//                dots: false,
//                prevArrow: '<button class="slide-arrow prev-arrow"><i class="fal fa-long-arrow-left"></i></button>',
//                nextArrow: '<button class="slide-arrow next-arrow"><i class="fal fa-long-arrow-right"></i></button>',
//                responsive: [{
//                        breakpoint: 1199,
//                        settings: {
//                            slidesToShow: 3,
//                            slidesToScroll: 3
//                        }
//                    },
//                    {
//                        breakpoint: 991,
//                        settings: {
//                            slidesToShow: 2,
//                            slidesToScroll: 2
//                        }
//                    },
//                    {
//                        breakpoint: 479,
//                        settings: {
//                            slidesToShow: 1,
//                            slidesToScroll: 1
//                        }
//                    }
//                ]
//            });


        } else {
            window.location = "index.html";
        }

    } else {
        window.location = "index.html";
    }
}

async function addToCart(id, qty) {

    const response = await fetch(
            "AddToCart?id=" + id + "&qty=" + qty
            );

    if (response.ok) {

        const json = await response.json();
        if (json.success) {
            notifier.success(json.content);
        } else {
            notifier.alert(json.content);
        }

    } else {
        notifier.alert("Please try again later");
    }

}
