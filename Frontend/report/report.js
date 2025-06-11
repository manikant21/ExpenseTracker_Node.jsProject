

const downloadPdfBtn = document.getElementById("downloadPdfBtn");
const tableContainer = document.getElementById("tableContainer");
const BASE_URL = "https://expensetrackernodejsproject-production.up.railway.app/api/v1/report";
const filterType = document.getElementById("filterType");
const retrunBtn = document.getElementById("returnBtn");
const logout = document.getElementById("logout");
const token = localStorage.getItem("token");
const reportPerPageSelector = document.getElementById("reportPerPage");
const reportTypePerPageSelector = document.getElementById("reportTypePerPage");
const reportTypePerPageContainer = document.getElementById("reportTypePerPageContainer");
const reportPerPageContainer = document.getElementById("reportPerPageContainer");
let select = "";




window.onload = () => {
    fetchReport();
    isPremiumCheck();
};


retrunBtn.addEventListener('click', () => {
    window.location.href = "../expense/expense.html";
})

logout.addEventListener('click', () => {
    // localStorage.removeItem("userId");
    localStorage.removeItem("token");
    window.location.href = "../login/login.html";
})

const isPremiumCheck = async () => {
    try {
        const response = await axios.get("https://expensetrackernodejsproject-production.up.railway.app/api/v1/user/status", {
            headers: { "Authorization": token }
        });

        const isPremium = response.data.isPremium;
        console.log(isPremium);
        if (isPremium) {
            downloadPdfBtn.classList.remove("hidden");
        }

    } catch (error) {
        console.log(error);

    }
}

filterType.addEventListener("change", () => {
    const selected = filterType.value;
    fetchReportType(selected);
    select = filterType.value;
    reportPerPageContainer.classList.add("hidden");
    reportTypePerPageContainer.classList.remove("hidden");
});




downloadPdfBtn.addEventListener("click", async () => {
    const type = filterType.value|| "daily";

    try {
        const response = await axios.get(`https://expensetrackernodejsproject-production.up.railway.app/api/v1/report/download/pdf/${type}`, {
            responseType: "blob",
            headers: { "Authorization": token }
        });

        const blob = new Blob([response.data], { type: "application/pdf" });

        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `${type}-report.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();

    } catch (err) {
        console.error(err);
        alert("Error downloading PDF report.");
    }
});


const fetchReportType = async (type, page = 1) => {
    try {
        const response = await axios.get(`${BASE_URL}/${type}?page=${page}&limit=${reportTypePerPage}`, {
            headers: { "Authorization": token }
        });
        const data = response.data;
        console.log(data);
        const totalAmount = response.data.totalAmount;
        const heading = document.createElement("h1");
        heading.innerHTML = `${type.charAt(0).toUpperCase() + type.slice(1)} Report`;
        heading.className = "text-xl font-bold text-white mb-4";
        tableContainer.appendChild(heading);
        showData(data.expense);
        renderPaginationForCategory(data, page, type);
        showTotalExpense(totalAmount);
    } catch (error) {
        console.error(error);
        tableContainer.innerHTML = `<p class="text-red-500">Failed to load data.</p>`;
    }
};

let reportTypePerPage = localStorage.getItem("reportTypePerPage") || 3;
reportTypePerPage = parseInt(reportTypePerPage);
reportTypePerPageSelector.value = reportTypePerPage;


reportTypePerPageSelector.addEventListener("change", () => {
    reportTypePerPage = parseInt(reportTypePerPageSelector.value);
    localStorage.setItem("reportTypePerPage", reportTypePerPage);
    fetchReportType(select, page = 1); 
})


function renderPaginationForCategory(data, page, type) {
    const paginationDiv = document.getElementById("paginationDiv");
    paginationDiv.innerHTML = ""; 

    const createBtn = (label, page) => {
        const btn = document.createElement("button");
        btn.textContent = label;
        btn.className = "mx-1 px-3 py-1 bg-blue-500 text-white rounded";
        btn.addEventListener("click", () => fetchReportType(type,page));
        return btn;
    };

   
    if (data.hasPreviousPage) {
        paginationDiv.appendChild(createBtn(page - 1, data.previousPage));
    }

   
    const current = document.createElement("span");
    current.textContent = ` Page ${data.currentPage} of ${data.lastPage} `;
    current.className = "mx-2 text-lg font-semibold text-orange-300";
    paginationDiv.appendChild(current);


    if (data.hasNextPage) {
        paginationDiv.appendChild(createBtn(page + 1, data.nextPage));
    }

    
    if (data.currentPage !== data.lastPage) {
        paginationDiv.appendChild(createBtn("Last", data.lastPage));
    }
}

const fetchReport = async (page = 1) => {
    try {

        const response = await axios.get(`${BASE_URL}/dailyreport?page=${page}&limit=${reportPerPage}`, {
            headers: { "Authorization": token }
        });
        const data = response.data;
        // console.log(data.expense);
        const totalAmount = response.data.totalAmount;
        const heading = document.createElement("h1");
        heading.innerHTML = "Total Report";
        heading.className = "text-xl font-bold text-red-400 mb-4";
        tableContainer.appendChild(heading);
        if (!Array.isArray(data.expense) || data.expense.length === 0) {
            tableContainer.innerHTML = '<p class="text-gray-500">No data available.</p>';
            return;
        }

        showData(data.expense);
        renderPagination(data, page);
        showTotalExpense(totalAmount);



    } catch (error) {
        console.error("Error fetching data:", error);
        alert("Something went wrong!");
    }
};


let reportPerPage = localStorage.getItem("reportPerPage") || 3;
reportPerPage = parseInt(reportPerPage);
reportPerPageSelector.value = reportPerPage;


reportPerPageSelector.addEventListener("change", () => {
    reportPerPage = parseInt(reportPerPageSelector.value);
    localStorage.setItem("reportPerPage", reportPerPage);
    fetchReport(page = 1); 
})

function renderPagination(data, page) {
    const paginationDiv = document.getElementById("paginationDiv");
    paginationDiv.innerHTML = ""; 

    const createBtn = (label, page) => {
        const btn = document.createElement("button");
        btn.textContent = label;
        btn.className = "mx-1 px-3 py-1 bg-blue-500 text-white rounded";
        btn.addEventListener("click", () => fetchReport(page));
        return btn;
    };

    
    if (data.hasPreviousPage) {
        paginationDiv.appendChild(createBtn(page - 1, data.previousPage));
    }


    const current = document.createElement("span");
    current.textContent = ` Page ${data.currentPage} of ${data.lastPage} `;
    current.className = "mx-2 text-lg font-semibold text-orange-300";
    paginationDiv.appendChild(current);

    
    if (data.hasNextPage) {
        paginationDiv.appendChild(createBtn(page + 1, data.nextPage));
    }

   
    if (data.currentPage !== data.lastPage) {
        paginationDiv.appendChild(createBtn("Last", data.lastPage));
    }
}

const showTotalExpense = (amount) => {
    const container = document.getElementById("tableContainer");

    const totalDiv = document.createElement("div");
    totalDiv.className = "text-white text-lg font-bold mt-4";
    totalDiv.textContent = `Total Expense: ₹${amount}`;

    container.appendChild(totalDiv);
};


const showData = (data) => {
    // console.log(data);
    tableContainer.innerHTML = "";

    if (!data.length) {
        tableContainer.innerHTML = `<p class="text-gray-400">No data found.</p>`;
        return;
    }

    const headers = ["Date","Note", "Category", "Description", "Amount"];

    
    const table = document.createElement("table");
    table.className = "min-w-full bg-white border border-gray-300 text-sm";

    const thead = document.createElement("thead");
    thead.className = "bg-gray-100";
    const headerRow = document.createElement("tr");

    headers.forEach(header => {
        const th = document.createElement("th");
        th.className = "py-2 px-4 border-b text-left font-medium text-gray-700";
        th.textContent = header;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);


    const tbody = document.createElement("tbody");

    data.forEach(row => {
        const tr = document.createElement("tr");

        const createdAt = new Date(row.createdAt).toLocaleDateString(); 
        const note = row.note || "N/A"
        const category = row.category || "N/A";
        const description = row.description || "N/A";
        const amount = row.amount || 0;

        [createdAt, note, category, description, amount].forEach(value => {
            const td = document.createElement("td");
            td.className = "py-2 px-4 border-b text-black";
            td.textContent = value;
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    //   tableContainer.innerHTML = ""; 
    tableContainer.appendChild(table);
};
