const notifier = new AWN({
    position: "top-right"
});

async function loadFeatures() {

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
        notifier.alert("Please try again later");
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

async function productListing() {

    const titleTag = document.getElementById("titleSelect");
    const categoryTag = document.getElementById("categorySelect");
    const brandTag = document.getElementById("brandSelect");
    const descriptionTag = document.getElementById("descriptionSelect");
    const priceTag = document.getElementById("priceSelect");
    const quantityTag = document.getElementById("quantitySelect");
    const colorTag = document.getElementById("colorSelect");
    const sizeTag = document.getElementById("sizeSelect");
    const image1Tag = document.getElementById("image1Select");
    const image2Tag = document.getElementById("image2Select");
    const image3Tag = document.getElementById("image3Select");

    const data = new FormData();
    data.append("title", titleTag.value);
    data.append("categoryId", categoryTag.value);
    data.append("brandId", brandTag.value);
    data.append("description", descriptionTag.value);
    data.append("price", priceTag.value);
    data.append("quantity", quantityTag.value); 
    data.append("colorId", colorTag.value);
    data.append("sizeId", sizeTag.value);

    data.append("image1", image1Tag.files[0]);
    data.append("image2", image2Tag.files[0]);
    data.append("image3", image3Tag.files[0]);

    const response = await fetch(
            "ProductListing",
            {
                method: "POST",
                body: data,
            }
    );

    if (response.ok) {

        const json = await response.json();

        if (json.success) {

            titleTag.value = "";
            categoryTag.value = 0;
            brandTag.value = 0;
            descriptionTag.value = "";
            priceTag.value = "";
            quantityTag.value = "";
            colorTag.value = 0;
            sizeTag.value = 0;
            image1Tag.value = null;
            image2Tag.value = null;
            image3Tag.value = null;

            notifier.success(json.content);

        } else {
            notifier.alert(json.content);
        }

    } else {
        notifier.alert("Please try again later");
    }

}

async function logOut() {

    const response = await fetch("SignOut");
    window.location.reload();

}