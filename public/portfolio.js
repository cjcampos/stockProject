let sellShares = document.querySelectorAll(".sell");
const numberOfSharesPortfolio = document.querySelectorAll('.numShares');
const modalElements = document.querySelectorAll('.allDiv');
const addFundsField = document.getElementById('addFundsField');
const addFunds = document.getElementById('addFunds');
const accountBalance = document.getElementById('accountBalance');
const portfolioBalance = document.getElementById('portfolioBalance');
const messageBox = document.getElementById('message');
const portfolioAlert = document.getElementById('portfolioAlert');
const modalDelete = document.getElementById('delete');
const deleteAccount = document.getElementById('deleteAccount');
const modalAddFunds = document.getElementById('funds');
const profitLoss = document.getElementById('profitLoss');

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
});

let currentPortfolioBalance = parseFloat(portfolioBalance.textContent).toFixed(2);

accountBalance.innerHTML = currencyFormatter.format(parseFloat(accountBalance.textContent));
portfolioBalance.innerHTML = currencyFormatter.format(parseFloat(portfolioBalance.textContent));
profitLoss.innerHTML = currencyFormatter.format(parseFloat(profitLoss.textContent));

portfolioAlert.addEventListener("click", () => {
    portfolioAlert.style.display = 'none';
});

modalAddFunds.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        addFunds.click();
    }
});

modalDelete.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        deleteAccount.click();
    }
});

deleteAccount.addEventListener('click', async () => {
    const result = await fetch('/delete', {
        method: 'POST'
    });

    if (result.status === 200) {
        window.location = '/';
    } else {
        messageBox.innerHTML = "Error, could not delete your account";
        portfolioAlert.style.display = 'block';
    }
});

if (sellShares !== null) {
    sellShares.forEach(button => button.addEventListener("click", async function () {
        const id = this.id.substring(4);
        const totalCost = document.getElementById('totalValueOfShares' + id);
        const costPerShare = document.getElementById('costPerShare' + id);
        const field = document.getElementById('field' + id);
        const currentSharesOwned = document.getElementById('numSharesOwned' + id);
        const currentChangeInStockValue = document.getElementById('changeOverTime' + id);
        const currentValuePerShare = document.getElementById('currentValuePerShare' + id);

        await fetch('/sellStock', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({stockSymbol: id, shares: field.value})
        }).then((response) => {
            if (response.status === 200) {
                field.value = 1;
                response.json().then(message => {
                    const valueForAllShares = ((totalCost.textContent).substring(1)).replace(/,/g, "");
                    costPerShare.innerHTML = currencyFormatter.format(message['currentStockValue']);
                    currentValuePerShare.innerHTML = currencyFormatter.format(message['currentStockValue']);
                    currentSharesOwned.innerHTML = ((message['viewElements'])['numOfStocks']);
                    currentChangeInStockValue.innerHTML = message['currentChangeInStockValue'] + "%";
                    currentPortfolioBalance = currentPortfolioBalance - valueForAllShares + (message['viewElements'])['valueForAllShares'];
                    portfolioBalance.innerHTML = currencyFormatter.format(currentPortfolioBalance);
                    messageBox.innerHTML = message['message'];
                    profitLoss.innerHTML = currencyFormatter.format(((message['viewElements'])['accountBalance']) + currentPortfolioBalance - ((message['viewElements'])['totalFundsAdded']));
                    totalCost.innerHTML = currencyFormatter.format((message['viewElements'])['valueForAllShares']);
                    accountBalance.innerHTML = currencyFormatter.format((message['viewElements'])['accountBalance']);
                    portfolioAlert.style.display = 'block';
                    const modalCostPerShare = document.getElementById('costPerShare' + id);
                    modalCostPerShare.innerHTML = currencyFormatter.format(message['currentStockValue']);
                });
            } else if (response.status === 400) {
                response.json().then(message => {
                    messageBox.innerHTML = message['message'];
                    portfolioAlert.style.display = 'block';
                });
            }
        });
    }));
}

numberOfSharesPortfolio.forEach(field => field.addEventListener("input", async () => {
    const id = field.id.substring(5);
    const totalCost = document.getElementById('totalCost' + id);
    const costPerShare = document.getElementById('costPerShare' + id);
    const costPerShareValue = parseFloat(((costPerShare.textContent).substring(1)).replace(/,/g, ""));
    if(field.value >= 0) {
        totalCost.innerText = currencyFormatter.format(costPerShareValue * field.value);
    }
}));

modalElements.forEach(field => field.addEventListener("keydown", (e) => {
    const elementID = (field.id).substring(12);
    if (e.key === "Enter") {
        e.preventDefault();
        const submitButton = document.getElementById('sell' + elementID);
        submitButton.click();
    }
}));

addFunds.addEventListener("click", async function () {
    if (addFundsField.value > 0) {
        if (addFundsField.value / 0.01 % 1 !== 0) {
            messageBox.innerHTML = "Error, invalid sum of funds";
            portfolioAlert.style.display = 'block';
        } else {
            await fetch('/addFunds', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({fundsToAdd: addFundsField.value})
            }).then((response) => {
                if (response.status === 200) {
                    addFundsField.value = '';
                    response.json().then(message => {
                        accountBalance.innerHTML = currencyFormatter.format(message['newAccountBalance']);
                        messageBox.innerHTML = message['message'];
                        portfolioAlert.style.display = 'block';
                    });
                } else if (response.status === 400) {
                    addFundsField.value = '';
                    response.json().then(message => {
                        messageBox.innerHTML = message['message'];
                        portfolioAlert.style.display = 'block';
                    });
                }
            });
        }
    } else {
        messageBox.innerHTML = "Error, invalid sum of funds";
        portfolioAlert.style.display = 'block';
    }
});