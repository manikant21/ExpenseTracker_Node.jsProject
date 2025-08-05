// const BASE_URL = "http://expensetracker-env.eba-ex3dcvcn.ap-south-1.elasticbeanstalk.com/api/v1/expense";
// const BASE_URL = "http://localhost:3000/api/v1/expense";
const BASE_URL = "http://13.203.193.183:3000/api/v1/expense";
const proxyUrl = "https://cors-anywhere.herokuapp.com/";
let editingId = null;
const token = localStorage.getItem("token")
// const userId = localStorage.getItem("userId");
const form = document.querySelector("form");
const logout = document.getElementById("logout");
// const premium = document.getElementById("premium");
const cashfree = Cashfree({ mode: "sandbox" });
const leaderbordBtnContainer = document.getElementById("leaderbordBtnContainer");
const leaderbordBtn = document.getElementById("leaderbordBtn");
const closeLeaderBtn = document.getElementById("closeLeaderBtn");
const leaderbordContainer = document.getElementById("leaderbordContainer");
const ul_leader = document.getElementById("ul_leader");
const reportBtn = document.getElementById("reportBtn");
let isPremium = false;
let isLeaderboardVisible = false;
const paginationDiv = document.getElementById("pagination");
const leaderPaginationContainer = document.getElementById("leaderPaginationContainer");
let page =1;
const paginationLeader = document.getElementById("paginationLeader");


const itemsPerPageSelector = document.getElementById("itemsPerPage");
const leaderPerPageSelector = document.getElementById("leaderPerPage");


const urlParams = new URLSearchParams(window.location.search);
const tokenFromURL = urlParams.get("token");
if (tokenFromURL) {
    localStorage.setItem("token", tokenFromURL);
}





reportBtn.addEventListener('click', () => {
    window.location.href = "../report/report.html";
})


document.getElementById("buyPremiumBtn").addEventListener("click", async () => {
    try {
        const response = await axios.post(`${proxyUrl}http://13.203.193.183:3000/api/v1/payment/create-order`, {}, {
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
        const response = await axios.get(`${proxyUrl}http://13.203.193.183:3000/api/v1/user/status`, {
            headers: { "Authorization": token }
        });

        isPremium = response.data.isPremium;

        if (isPremium) {
            document.getElementById("buyPremiumBtn").style.display = "none";
            leaderbordBtnContainer.classList.remove("hidden");

            leaderbordBtn.addEventListener("click", async () => {
                if (!isLeaderboardVisible) {
                    leaderbordContainer.classList.remove("hidden");
                    leaderPaginationContainer.classList.remove("hidden");
                    closeLeaderBtn.classList.remove("hidden"); 
                    paginationLeader.classList.remove("hidden")
                    await fetchLeaderData(page = 1);
                    isLeaderboardVisible = true;
                }
            });


            closeLeaderBtn.addEventListener("click", () => {
                leaderbordContainer.classList.add("hidden");
                 leaderPaginationContainer.classList.add("hidden");
                closeLeaderBtn.classList.add("hidden");
                paginationLeader.classList.add("hidden");
                isLeaderboardVisible = false;
            });
        }
    } catch (err) {
        console.error("Error checking premium status:", err);
    }
});



const fetchLeaderData = async (page = 1) => {
    try {
        const response = await axios.get(`${proxyUrl}${BASE_URL}/allexpensedetails?page=${page}&limit=${leaderPerPage}`, {
            headers: {
                "Authorization": token
            }
        })
        console.log(response.data);
        const data = response.data;
        let ul_leader = document.getElementById("ul_leader");
        ul_leader.innerHTML = "";
        for (let i = 0; i < response.data.expense.length; i++) {
            // console.log(response.data.result[i]);
            showLeaderboardData(response.data.expense[i]);
        }

        renderPaginationForLeaders(data, page);
    } catch (error) {
        console.error("Error occures in fetching leaderboard details:", error);
        alert("Something went wrong. Please try again later.");
    }
}

let leaderPerPage = localStorage.getItem("leaderPerPage") || 3;
leaderPerPage = parseInt(leaderPerPage);
leaderPerPageSelector.value = leaderPerPage;


leaderPerPageSelector.addEventListener("change", () => {
    leaderPerPage = parseInt(leaderPerPageSelector.value);
    localStorage.setItem("leaderPerPage", leaderPerPage);
    fetchLeaderData(page = 1); 
})

function renderPaginationForLeaders(data, page) {
    const paginationDiv = document.getElementById("paginationLeader");
    paginationDiv.innerHTML = ""; 

    const createBtn = (label, page) => {
        const btn = document.createElement("button");
        btn.textContent = label;
        btn.className = "mx-1 px-3 py-1 bg-blue-500 text-white rounded";
        btn.addEventListener("click", () => fetchLeaderData(page));
        return btn;
    };

    if (data.hasPreviousPage) {
        paginationDiv.appendChild(createBtn(page - 1, data.previousPage));
    }

    const current = document.createElement("span");
    current.textContent = ` Page ${data.currentPage} of ${data.lastPage} `;
    current.className = "mx-2 text-lg font-semibold text-gray-700";
    paginationDiv.appendChild(current);

    if (data.hasNextPage) {
        paginationDiv.appendChild(createBtn(page + 1, data.nextPage));
    }

    if (data.currentPage !== data.lastPage) {
        paginationDiv.appendChild(createBtn("Last", data.lastPage));
    }
}


const showLeaderboardData = (data) => {
    // console.log(data.name, data.totalExpenses);
    // const totalExpense = data.totalExpense ?? 0;
    let ul_leader = document.getElementById("ul_leader");
    let list = document.createElement("li");
    list.textContent = `Name: ${data.name};Total Expense: ${data.totalExpenses}`;
    ul_leader.appendChild(list);
}

logout.addEventListener('click', () => {
    // localStorage.removeItem("userId");
    localStorage.removeItem("token");
    window.location.href = "../login/login.html";
})

if (!token) {
    window.location.href = "../login/login.html";
} else {
    // console.log("Logged in User token:", token);
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const amount = event.target.amount.value;
        const note = event.target.note.value;
        const description = event.target.description.value;
        const category = event.target.category.value;
        const expenseObj = {
            amount: amount,
            note: note,
            description: description,
            category: category
        }
        // console.log(expenseObj);
        try {
            if (editingId) {
                const res = await axios.put(`${proxyUrl}${BASE_URL}/edit/${editingId}`, expenseObj, {
                    headers: {
                        "Authorization": token
                    }
                });
                if (isPremium) {
                    fetchLeaderData();
                }
                console.log("Edited:", res.data.data);
                editingId = null;
            } else {
                const res = await axios.post(`${proxyUrl}${BASE_URL}/add`, expenseObj, {
                    headers: {
                        "Authorization": token
                    }
                });
                console.log(res.data);
                if (isPremium) {
                    fetchLeaderData();
                }
                // showData(res.data.user);

            }
            fetchExpenseData();
        } catch (error) {
            console.log(error.message);
            console.log("Error occred in inserting expense");
        }
        document.getElementById("amount").value = "";
        document.getElementById("note").value = "";
        document.getElementById("description").value = "";
        document.getElementById("category").value = "movie";

    })

    const showData = (data) => {
        // console.log(data);
        let ul = document.getElementById("ul");

        let list = document.createElement("li");
        list.textContent = `${data.amount}-${data.note}-${data.description}-${data.category}`;
        let delebtn = document.createElement("button");
        delebtn.classList = "border m-1 p-1 cursor-pointer"
        delebtn.textContent = "Delete";
        delebtn.addEventListener("click", async () => {
            try {
                await axios.delete(`${proxyUrl}${BASE_URL}/delete/${data.id}`, {
                    headers: {
                        "Authorization": token
                    }
                });
                ul.removeChild(list);
                if (isPremium) {
                    fetchLeaderData();
                }
            } catch (error) {
                console.error(error);
            }
        });
        let editBtn = document.createElement("button");
        editBtn.classList = "border m-1 p-1 cursor-pointer"
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", () => {

            document.getElementById("amount").value = data.amount;
            document.getElementById("note").value = data.note;
            document.getElementById("description").value = data.description;
            document.getElementById("category").value = data.category;
            editingId = data.id;
            ul.removeChild(list);


        })
        list.appendChild(delebtn);
        list.appendChild(editBtn);
        ul.appendChild(list);


    }

    const fetchExpenseData = async (page = 1) => {
        try {
            const response = await axios.get(`${proxyUrl}${BASE_URL}/?page=${page}&limit=${itemsPerPage}`, {
                headers: {
                    "Authorization": token
                }
            });
             const data = response.data;
            // console.log(data);
            let ul = document.getElementById("ul");
            ul.innerHTML = "";
            for (let i = 0; i < data.expense.length; i++) {
                 showData(data.expense[i]);
            }

            renderPagination(data, page);

        }
        catch (error) {
            console.log(error.message);
            console.log("Error occred in fetching expense");
        }
    }


    function renderPagination(data, page) {
    const paginationDiv = document.getElementById("pagination");
    paginationDiv.innerHTML = ""; 

    const createBtn = (label, page) => {
        const btn = document.createElement("button");
        btn.textContent = label;
        btn.className = "mx-1 px-3 py-1 bg-blue-500 text-white rounded";
        btn.addEventListener("click", () => fetchExpenseData(page));
        return btn;
    };

    if (data.hasPreviousPage) {
        paginationDiv.appendChild(createBtn(page - 1, data.previousPage));
    }

    const current = document.createElement("span");
    current.textContent = ` Page ${data.currentPage} of ${data.lastPage} `;
    current.className = "mx-2 text-lg font-semibold text-gray-700";
    paginationDiv.appendChild(current);

    if (data.hasNextPage) {
        paginationDiv.appendChild(createBtn(page + 1, data.nextPage));
    }

    if (data.currentPage !== data.lastPage) {
        paginationDiv.appendChild(createBtn("Last", data.lastPage));
    }
}

let itemsPerPage = localStorage.getItem("itemsPerPage") || 10;
itemsPerPage = parseInt(itemsPerPage);
itemsPerPageSelector.value = itemsPerPage;

// Update localStorage when changed
itemsPerPageSelector.addEventListener("change", () => {
    itemsPerPage = parseInt(itemsPerPageSelector.value);
    localStorage.setItem("itemsPerPage", itemsPerPage);
    fetchExpenseData(page = 1); // Refresh from page 1 with new setting
});



    window.addEventListener("DOMContentLoaded", () => fetchExpenseData())

}