//async function loadData() {
//    const response = await fetch("LoadData");
//
//    if (response.ok) {
//        const json = await response.json();
//        console.log(json);
//
//        loadOption("category", json.categoryList, "name");
//        loadOption("condition", json.conditionList, "name");
//        loadOption("color", json.colorList, "name");
//        loadOption("storage", json.storageList, "name");
//
//        updateProductView(json);
//
//    } else {
//        alert("Try again later.");
//    }
//
//}

//function loadOption(prefix, dataList, property) {
//    let options = document.getElementById(prefix + "-options");
//    let li = document.getElementById(prefix + "-li");
//    options.innerHTML = "";
//
//    dataList.forEach(data => {
//        let li_clone = li.cloneNode(true);
//
//        if (prefix == "color") {
//            li_clone.style.borderColor = data[property];
//            li_clone.querySelector("#" + prefix + "-a").style.backgroundColor = data[property];
//        } else {
//            li_clone.querySelector("#" + prefix + "-a").innerHTML = data[property];
//        }
//
//        options.appendChild(li_clone);
//    });
//
//    //from template js
//    const all_li = document.querySelectorAll("#" + prefix + "-options li");
//    all_li.forEach(x => {
//        x.addEventListener('click', function () {
//            all_li.forEach(y => y.classList.remove('chosen'));
//            this.classList.add('chosen');
//        });
//    });
//}

async function loadFeatures() {

    searchProducts(0);

    const response = await fetch(
            "LoadFeatures",
            );

    if (response.ok) {

        const json = await response.json();

        const categoryList = json.categoryList;
        const brandList = json.brandList;
        const colorList = json.colorList;
        const sizeList = json.sizeList;

        loadSelect("categorySelect", categoryList, ["id", "name"])
        loadSelect("brandSelect", brandList, ["id", "name"])
        loadSelect("colorSelect", colorList, ["id", "name"])
        loadSelect("sizeSelect", sizeList, ["id", "name"])



    } else {
        document.getElementById("message").innerHTML = "Please try again later.";
    }


}

function loadSelect(selectTagId, list, propertyArray) {
    const SelectTag = document.getElementById(selectTagId);
    list.forEach(item => {
        let optionTag = document.createElement("option");
        optionTag.value = item[propertyArray[0]];
        optionTag.innerHTML = item[propertyArray[1]];
        SelectTag.appendChild(optionTag);
    });
}


async function searchProducts(firstResult) {

    let categorySelect = document.getElementById('categorySelect');
    let category = categorySelect.options[categorySelect.selectedIndex].text;

    let brandSelect = document.getElementById('brandSelect');
    let brand = brandSelect.options[brandSelect.selectedIndex].text;

    let colorSelect = document.getElementById('colorSelect');
    let color = colorSelect.options[colorSelect.selectedIndex].text;

    let sizeSelect = document.getElementById('sizeSelect');
    let size = sizeSelect.options[sizeSelect.selectedIndex].text;

    let searchText = document.getElementById('searchText').value;

    const data = {
        firstResult: firstResult, 
        category_name: category,
        brand_name: brand,
        color_name: color,
        size_name: size,
        searchText: searchText
    };

    const response = await fetch("SearchProducts", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (response.ok) {
        const json = await response.json();
        console.log(json);
        updateProductView(json);
        currentPage = 0;
    } else {
        alert("Try again later");
    }
}

var st_product = document.getElementById("st-product");
var st_pagination_button = document.getElementById("st-pagination-button");

var currentPage = 0;

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

    //start pagination
    let st_pagination_container = document.getElementById("st-pagination-container");
    st_pagination_container.innerHTML = "";

    let product_count = json.allProductCount;
    const product_per_page = 6;

    let pages = Math.ceil(product_count / product_per_page);

    //add previous button
    if (currentPage != 0) {
        let st_pagination_button_clone_prev = st_pagination_button.cloneNode(true);
        st_pagination_button_clone_prev.innerHTML = "Prev";

        st_pagination_button_clone_prev.addEventListener("click", e => {
            currentPage--;
            searchProducts(currentPage * 6);
        });

        st_pagination_container.appendChild(st_pagination_button_clone_prev);
    }

    //add page buttons
    for (let i = 0; i < pages; i++) {
        let st_pagination_button_clone = st_pagination_button.cloneNode(true);
        st_pagination_button_clone.innerHTML = i + 1;

        st_pagination_button_clone.addEventListener("click", e => {
            currentPage = i;
            searchProducts(i * 6);
        });

        if (i === currentPage) {
            st_pagination_button_clone.className = "active";
        } else {
            st_pagination_button_clone.className = "page";
        }

        st_pagination_container.appendChild(st_pagination_button_clone);
    }

    //add Next button
    if (currentPage != (pages - 1)) {
        let st_pagination_button_clone_next = st_pagination_button.cloneNode(true);
        st_pagination_button_clone_next.innerHTML = "Next";

        st_pagination_button_clone_next.addEventListener("click", e => {
            currentPage++;
            searchProducts(currentPage * 6);
        });

        st_pagination_container.appendChild(st_pagination_button_clone_next);
    }

}