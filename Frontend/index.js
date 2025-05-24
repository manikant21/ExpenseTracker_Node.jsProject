const BASE_URL_USER = "http://localhost:3000/api/v1/user";
const form = document.querySelector("form");
const name = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");


form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (name.value == "" || email.value == "" || password.value == "") {
        alert("Please fill all details");
        return
    }
    const signUpDetails = {
        name: name.value,
        email: email.value,
        password: password.value
    }
    console.log(signUpDetails);
    try {
        const response = await axios.post(`${BASE_URL_USER}/login`, signUpDetails);
        console.log(response.status);
        console.log("User details added!");
        name.value = "";
        email.value = "";
        password.value = "";
    }
    catch (error) {
        console.log(error);
        if (error.response.status == 409) {
            alert("This email already exist in db");
        }
        else {
            alert("Some thing went wrong");
        }

    }


})