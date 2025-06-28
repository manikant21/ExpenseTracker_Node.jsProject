const BASE_URL_USER = "http://expensetracker-env.eba-ex3dcvcn.ap-south-1.elasticbeanstalk.com/api/v1/user";
const proxyUrl = "https://cors-anywhere.herokuapp.com/";
const form = document.getElementById("register_form");
const name = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");


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
        const response = await axios.post(`${proxyUrl}${BASE_URL_USER}/register`, signUpDetails);
        alert("User register successfully...Please login!!");
        console.log(response.status);
        console.log("User details added!");
        name.value = "";
        email.value = "";
        password.value = "";
        window.location.href = "../login/login.html";
    }
    catch (error) {
        console.log(error);
        if (error.response.status == 409) {
            alert("This email already exist in db");
        }
        else {
            alert("Something went wrong");
            console.log("Internal server error");
        }

    }


})
}