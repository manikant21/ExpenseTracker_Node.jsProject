const BASE_URL = "http://localhost:3000/api/v1/expense";
let editingId = null;
const token = localStorage.getItem("token")
// const userId = localStorage.getItem("userId");
const form = document.querySelector("form");
const logout = document.getElementById("logout");
// const premium = document.getElementById("premium");
const cashfree = Cashfree({ mode: "sandbox" });



document.getElementById("buyPremiumBtn").addEventListener("click", async () => {
    try {
        const response = await axios.post("http://localhost:3000/api/v1/payment/create-order", {}, {
            headers: {
                "Authorization": token
            }

        });

        const paymentSessionId = response.data.paymentSessionId;

        
        const checkoutOptions = {
            paymentSessionId,
            redirectTarget: "_self"
        };

        await cashfree.checkout(checkoutOptions);

    } catch (err) {
        console.error("Error triggering premium payment:", err);
        alert("Something went wrong. Please try again later.");
    }
});



document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/v1/user/status", { 
         headers: {
                "Authorization": token
            }
     });
    const isPremium = response.data.isPremium;
    // console.log(isPremium);

    if (isPremium) {
      document.getElementById("buyPremiumBtn").style.display = "none";
    }
  } catch (err) {
    console.error("Error checking premium status:", err);
  }
});



logout.addEventListener('click', () => {
    // localStorage.removeItem("userId");
    localStorage.removeItem("token");
    window.location.href = "../login/login.html";
})

if (!token) {
    window.location.href = "../login/login.html";
} else {
    console.log("Logged in User token:", token);
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const amount = event.target.amount.value;
        const description = event.target.description.value;
        const category = event.target.category.value;
        const expenseObj = {
            amount: amount,
            description: description,
            category: category
        }
        console.log(expenseObj);
        try {
            if (editingId) {
                const res = await axios.put(`${BASE_URL}/edit/${editingId}`, expenseObj, {
                    headers: {
                        "Authorization": token
                    }
                });
                console.log("Edited:", res.data.data);
                editingId = null;
            } else {
                const res = await axios.post(`${BASE_URL}/add`, expenseObj, {
                    headers: {
                        "Authorization": token
                    }
                });
                console.log(res.data);
                // showData(res.data.user);

            }
            fetchExpenseData();
        } catch (error) {
            console.log(error.message);
            console.log("Error occred in inserting expense");
        }
        document.getElementById("amount").value = "";
        document.getElementById("description").value = "";
        document.getElementById("category").value = "movie";

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
                await axios.delete(`${BASE_URL}/delete/${data.id}`, {
                    headers: {
                        "Authorization": token
                    }
                });
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
        try {
            const data = await axios.get(`${BASE_URL}/`, {
                headers: {
                    "Authorization": token
                }
            });
            console.log(data.data.msg.length);
            let ul = document.getElementById("ul");
            ul.innerHTML = "";
            for (let i = 0; i < data.data.msg.length; i++) {
                showData(data.data.msg[i]);
            }

        }
        catch (error) {
            console.log(error.message);
            console.log("Error occred in fetching expense");
        }
    }


    window.addEventListener("DOMContentLoaded", fetchExpenseData())

}