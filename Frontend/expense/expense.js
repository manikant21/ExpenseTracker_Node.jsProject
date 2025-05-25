const BASE_URL = "http://localhost:3000/api/v1/expense";
let editingId = null;
const userId = localStorage.getItem("userId");
const form = document.querySelector("form");
const logout = document.getElementById("logout");

logout.addEventListener('click', ()=> {
    localStorage.removeItem("userId");
    window.location.href = "../login/login.html";
})
if (!userId) {
    window.location.href = "../login/login.html";
} else {
    console.log("Logged in User ID:", userId);
    form.addEventListener("submit", async(event) => {
    event.preventDefault();
    const amount = event.target.amount.value;
    const description =  event.target.description.value;
    const category =  event.target.category.value;
    const expenseObj = {
        amount: amount,
        description: description,
        category: category,
        userId: userId
    }
    console.log(expenseObj);
    try {
        if (editingId) {
            const res = await axios.put(`${BASE_URL}/edit/${editingId}`, expenseObj);
            console.log("Edited:", res.data.data);
            editingId = null;
        } else {
        const res = await axios.post(`${BASE_URL}/add`, expenseObj);
        console.log(res.data);
        // showData(res.data.user);

        }
        fetchExpenseData();
    } catch (error) {
        console.log(error.message);
        console.log("Error occred in inserting expense");
    }
    document.getElementById("amount").value="";
    document.getElementById("description").value="";
    document.getElementById("category").value="movie";

})

const showData = (data) => {
    console.log(data);
    let ul = document.getElementById("ul");
  
    let list = document.createElement("li");
    list.textContent = `${data.amount}-${data.description}-${data.category}`;
    let delebtn = document.createElement("button");
    delebtn.classList = "border m-1 p-1 cursor-pointer"
    delebtn.textContent = "Delete";
    delebtn.addEventListener("click", async () => {
        try {
            await axios.delete(`${BASE_URL}/${userId}/delete/${data.id}`);
            ul.removeChild(list);
        } catch (error) {
            console.error(error);
        }
    });
    let editBtn = document.createElement("button");
    editBtn.classList = "border m-1 p-1 cursor-pointer"
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => {
        
            document.getElementById("amount").value = data.amount;
            document.getElementById("description").value = data.description;
            document.getElementById("category").value = data.category;
            editingId = data.id;
            ul.removeChild(list);
        

    })
    list.appendChild(delebtn);
    list.appendChild(editBtn);
    ul.appendChild(list);


}

const fetchExpenseData = async () => {
    try{
        const data = await axios.get(`${BASE_URL}/${userId}`); 
        console.log(data.data.msg.length);
        let ul = document.getElementById("ul");
        ul.innerHTML = "";
        for (let i = 0; i < data.data.msg.length; i++) {
            showData(data.data.msg[i]);
        }

    }
    catch {
        console.log(error.message);
        console.log("Error occred in fetching expense");
    }
}


window.addEventListener("DOMContentLoaded", fetchExpenseData())
   
}





