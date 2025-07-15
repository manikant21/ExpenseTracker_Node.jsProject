// const BASE_URL_USER = "http://expensetracker-env.eba-ex3dcvcn.ap-south-1.elasticbeanstalk.com/api/v1/user";
const BASE_URL_USER = "http://localhost:3000/api/v1/user";
// const proxyUrl = "https://cors-anywhere.herokuapp.com/";

const form = document.getElementById("register_form");

const login_form = document.getElementById("login_form");
const email_login = document.getElementById("email_login");
const password_login = document.getElementById("password_login");



if(login_form) {
login_form.addEventListener('submit', async(event) => {
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
     try{
        const response = await axios.post(`${BASE_URL_USER}/login`, loginDetails);
        alert("User loggedin successfully");
        console.log("User loggedin successfully");
        // console.log(response.data.user_id);
        // const userId = response.data.user_id;
        // localStorage.setItem("userId", userId);
        console.log(response.data);
        localStorage.setItem("token", response.data.token);
        email_login.value = "";
        password_login.value = "";
        window.location.href = "../expense/expense.html";
     }
     catch(error) {
        console.log(error.response);
        if(error.response.status == 404) {
            alert("Please enter valid email")
        }
        else if(error.response.status == 401) {
            alert("Please enter valid password");
        }
        else {
            alert("Something went wrong");
            console.log("Internal server error");

        }
     }
  
   

})
}