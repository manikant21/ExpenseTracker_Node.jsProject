const BASE_URL_USER = "http://localhost:3000/api/v1/user";
const form = document.getElementById("register_form");
const name = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");

const login_form = document.getElementById("login_form");
const email_login = document.getElementById("email_login");
const password_login = document.getElementById("password_login");

if(login_form) {
login_form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (email_login.value == "" || password_login.value == "") {
        alert("Please fill all details");
        return
    }
    const loginDetails = {
        email: email_login.value,
        password: password_login.value
    }
    console.log(loginDetails);

})
}

if(form){
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
}