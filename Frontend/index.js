const BASE_URL_USER = "http://localhost:3000/user";
const form = document.querySelector("form");
const name = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");


form.addEventListener('submit', async(event) => {
    event.preventDefault();
    if(name.value =="" || email.value == "" || password.value=="") {
        alert("Please fill all details");
        return 
    }
    const signUpDetails = {
        name: name.value,
        email: email.value,
        password: password.value
    }
    console.log(signUpDetails);
    await axios.post(`${BASE_URL_USER}/login`, signUpDetails);
    console.log("User details added!");
})