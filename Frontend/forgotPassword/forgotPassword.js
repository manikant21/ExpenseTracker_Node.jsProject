const form = document.getElementById("form");
const email= document.getElementById("email_password");
const proxyUrl = "https://cors-anywhere.herokuapp.com/";

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if(email.value=="") {
        alert("Please fill email");
        return ;
    }
    const data = {
        email: email.value
    }
    try {
        const response = await axios.post(`${proxyUrl}http://13.203.193.183:3000/api/v1/password/forgotpassword`, data);
    } catch (error) {
        console.log(error);
    }
    
})

document.getElementById("cancel").addEventListener('click', () => {
    
    const path = window.location.pathname;
    console.log(path);
    window.location.href = "../login/login.html"

})