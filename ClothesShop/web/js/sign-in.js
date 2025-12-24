const notifier = new AWN({
    position: "top-right" // Set position to top-right
});

async function signIn() {

    const user_dto = {
        email: document.getElementById("emailS").value,
        password: document.getElementById("passwordS").value,
    };

    const response = await fetch(
            "SignIn",
            {
                method: "POST",
                body: JSON.stringify(user_dto),
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

            if (json.content === "Unverified") {
                window.location = "verify-account.html";
            } else {
                notifier.alert(json.content);
            }
        }

    } else {
        notifier.alert("Please try again later");
    }

}


