const form = document.getElementById("form");
const email= document.getElementById("email_password");

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
        const response = await axios.post("http://localhost:3000/api/v1/password/forgotpassword", data);
    } catch (error) {
        console.log(error);
    }
    
})