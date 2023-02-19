const form = document.querySelector(".add");
const incomeList = document.querySelector(".income-list");
const expenseList = document.querySelector(".expense-list");

const balance = document.querySelector("#balance");
const income = document.querySelector("#income");
const expense = document.querySelector("#expense");

let transactions = localStorage.getItem("transactions") !== null ? 
JSON.parse(localStorage.getItem("transactions")) : [];

function updateStatistics(id){
    const updatedIncome = transactions
                            .filter(transaction => transaction.amount > 0)
                            .reduce((total, transaction) => total += transaction.amount, 0);

    const updatedExpense = transactions
                            .filter(transaction => transaction.amount < 0)
                            .reduce((total, transaction) => total += Math.abs(transaction.amount), 0);

    updatedBalance = updatedIncome - updatedExpense;

    balance.textContent = updatedBalance;
    income.textContent = updatedIncome;
    expense.textContent = updatedExpense;

}

function generateTemplate(id, source, amount, time){
    return `<li data-id="${id}">
                <p>
                    <span>${source}</span>
                    <span id="time">${time}</span>
                </p>
                <span>${Math.abs(amount)}</span>
                <i class="bi bi-trash delete"></i>
            </li>`
}

function addTransactionDOM(id, source, amount, time){
    if (amount > 0){
        incomeList.innerHTML += generateTemplate(id, source, amount, time);
    } else{
        expenseList.innerHTML += generateTemplate(id, source, amount, time);
    }
}

function addTransaction(source, amount){
    const time = new Date();
    const transaction = {
        id: Math.floor(Math.random()*100000),
        source: source,
        amount: amount,
        time: `${time.toLocaleTimeString()} ${time.toLocaleDateString()}`
    };
    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    addTransactionDOM(transaction.id, source, amount, transaction.time);
}

form.addEventListener("submit", event => {
    event.preventDefault();
    if(form.source.value.trim() == "" || form.amount.value == 0){
        return alert("Please enter proper values!");
    }
    addTransaction(form.source.value.trim(), Number(form.amount.value));
    updateStatistics();
    form.reset();
});

function getTransation(){
    transactions.forEach(transaction => {
        if (transaction.amount>0){
            incomeList.innerHTML += generateTemplate(transaction.id, transaction.source, transaction.amount, transaction.time);
        } else {
            expenseList.innerHTML += generateTemplate(transaction.id, transaction.source, transaction.amount, transaction.time);
        }
    });
}

function deleteTransation(id){
    transactions = transactions.filter(transaction => {
        return transaction.id !== id;
    })
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

incomeList.addEventListener("click", event =>{
    if(event.target.classList.contains("delete")){
        event.target.parentElement.remove();
        deleteTransation(Number(event.target.parentElement.dataset.id));
        updateStatistics();
    }
});

expenseList.addEventListener("click", event =>{
    if(event.target.classList.contains("delete")){
        event.target.parentElement.remove();
        deleteTransation(Number(event.target.parentElement.dataset.id));
        updateStatistics();
    }
});

function init(){
    updateStatistics();
    getTransation();
}

init();