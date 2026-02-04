
const balanceEl = document.querySelector("#balance");
const incomeAmountEl = document.querySelector("#income-amount");
const expenseAmountEl = document.querySelector("#expense-amount");
const transcactionListEl = document.querySelector("#transcaction-list");
const transcactionFormEl = document.querySelector("#transcaction-form");
const descriptionEl = document.querySelector("#description");
const amountEl = document.querySelector("#amount");


let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

transcactionFormEl.addEventListener("submit", addTransaction);

function addTransaction(e) {
    e.preventDefault();

    const description = descriptionEl.value.trim();
    const amount = parseFloat(amountEl.value);

    transactions.push({
        id: Date.now(),
        description,
        amount
    })

    localStorage.setItem("transactions", JSON.stringify(transactions));

    updateTransactionList();
    updateSummary();

}

transcactionFormEl.reset();

function updateTransactionList() {
    transcactionListEl.innerHTML = "";

    const sortedTransactions = [...transactions].reverse();

    sortedTransactions.forEach((transaction) => {
        const transactionEl = createTransactionElement(transaction);
        transcactionListEl.appendChild(transactionEl);
    })
}

function createTransactionElement(transaction) {
    const li = document.createElement("li");
    li.classList.add("transcaction");
    li.classList.add(transaction.amount > 0 ? "income" : "expenses");

    li.innerHTML = `
        <span>${transaction.description}</span>
        <span>${formatCurrency(transaction.amount)}
        <button class="delete-btn" onClick="removeTransaction(${transaction.id})">x</button>
        </span>
        `;

    return li;

}


function updateSummary() {
    const balance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);

    const income = transactions.filter(transaction => transaction.amount > 0)
        .reduce((acc, transaction) => acc + transaction.amount, 0)

    const expenses = transactions.filter(transaction => transaction.amount < 0)
        .reduce((acc, transaction) => acc + transaction.amount, 0)

    balanceEl.textContent = formatCurrency(balance);
    incomeAmountEl.textContent = formatCurrency(income);
    expenseAmountEl.textContent = formatCurrency(expenses);

}


function formatCurrency(number) {
    return new Intl.NumberFormat("el-GR", {
        style: "currency",
        currency: "EUR"
    }).format(number);
}


function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);

    localStorage.setItem("transactions",JSON.stringify(transactions));

    updateTransactionList();
    updateSummary();
}


updateSummary();
updateTransactionList();

