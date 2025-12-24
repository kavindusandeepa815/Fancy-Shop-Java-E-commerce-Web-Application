const notifier = new AWN({
    position: "top-right"
});

async function verifyAccount() {

    const dto = {
        verification: document.getElementById("verification").value,
    };

    const response = await fetch(
            "Verification",
            {
                method: "POST",
                body: JSON.stringify(dto),
                headers: {
                    "Content-type": "application/json"
                }
            }
    );

    if (response.ok) {

        const json = await response.json();

        if (json.success) {
            window.location = "index.html";
        } else {
            notifier.alert(json.content);
        }

    } else {
        notifier.alert("Please try again later");
    }

}