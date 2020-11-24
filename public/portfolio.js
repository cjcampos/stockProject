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

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
});

let currentPortfolioBalance = parseFloat(portfolioBalance.textContent).toFixed(2);

accountBalance.innerHTML = currencyFormatter.format(parseFloat(accountBalance.textContent));
portfolioBalance.innerHTML = currencyFormatter.format(parseFloat(portfolioBalance.textContent));

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

if (sellShares != null) {
    sellShares.forEach(button => button.addEventListener("click", async function () {
        const id = this.id.substring(4);;
        const totalCost = document.getElementById('totalValueOfShares' + id);
        const costPerShare = document.getElementById('costPerShare' + id);
        const field = document.getElementById('field' + id);
        //console.log(field);
        const currentSharesOwned = document.getElementById('numSharesOwned' + id);
        // const numberOfCurrentShares = parseInt(currentSharesOwned.textContent);

        await fetch('/sellStock', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({stockSymbol: id, shares: field.value, costPerShare: parseFloat(((costPerShare.textContent).substring(1)).replace(/,/g, ""))})
        }).then((response) => {
            if (response.status === 200) {
                field.value = 1;
                response.json().then(message => {
                    costPerShare.innerHTML = currencyFormatter.format(message['currentStockValue']);
                    currentSharesOwned.innerHTML = ((message['viewElements'])['numOfStocks']);
                    currentPortfolioBalance = currentPortfolioBalance - (message['viewElements'])['changeInBalance'];
                    portfolioBalance.innerHTML = currencyFormatter.format(currentPortfolioBalance);
                    messageBox.innerHTML = message['message'];
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

        /**
        if (numberOfCurrentShares >= field.value) {
            const currentTotalValue = parseFloat(totalCost.textContent.substring(1)).toFixed(2);
            const currentValuePerShare = parseFloat(costPerShare.textContent.substring(1)).toFixed(2);
            const currentAccountBalance = parseFloat(accountBalance.textContent.substring(1)).toFixed(2);
            const currentPortfolioBalance = parseFloat(portfolioBalance.textContent.substring(1)).toFixed(2);
            totalCost.innerHTML = "$" + ((currentTotalValue - (currentValuePerShare * field.value)).toFixed(2));
            currentSharesOwned.innerHTML = numberOfCurrentShares - field.value;
            accountBalance.innerHTML = "$" + ((+currentAccountBalance + (currentValuePerShare * field.value)).toFixed(2));
            portfolioBalance.innerHTML = "$" + ((+currentPortfolioBalance - (currentValuePerShare * field.value)).toFixed(2));
        } else {
            messageBox.innerHTML = "Cannot sell more shares than you own";
            portfolioAlert.style.display = 'block';
        }
         **/

        /**
        if (response.status === 200) {
            field.value = 1;
            messageBox.innerHTML = "Successfully sold shares";
            portfolioAlert.style.display = 'block';
        } else if (response.status === 400) {
            field.value = 1;
            messageBox.innerHTML = "Error, you do not own enough shares of the stock";
            portfolioAlert.style.display = 'block';
        }
         **/
    }));
}

numberOfSharesPortfolio.forEach(field => field.addEventListener("input", async () => {
    const totalCost = document.getElementById('totalCost' + field.id);
    const costPerShare = document.getElementById('costPerShare' + field.id);
    console.log(field.id);
    console.log(costPerShare);
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
                        console.log(message);
                        portfolioAlert.style.display = 'block';
                    });
                } else if (response.status === 400) {
                    addFundsField.value = '';
                    response.json().then(message => {
                        accountBalance.innerHTML = currencyFormatter.format(message['newAccountBalance']);
                        messageBox.innerHTML = message['message'];
                        portfolioAlert.style.display = 'block';
                    });
                }
            });
        }
        // console.log(result);
        // const currentAccountBalance = parseFloat(accountBalance.textContent.substring(1)).toFixed(2);
        // const fundsToAdd = parseFloat(addFundsField.value);
        // accountBalance.innerHTML = "$" + ((+currentAccountBalance + +fundsToAdd).toFixed(2));
        /**
        if (result.status === 200) {
            addFundsField.value = '';
            message.innerHTML = "Successfully added funds";
            portfolioAlert.style.display = 'block';
        } else if (result.status === 400) {
            message.innerHTML = "Error, invalid sum of funds";
            portfolioAlert.style.display = 'block';
        }
         **/
    } else {
        messageBox.innerHTML = "Error, invalid sum of funds";
        portfolioAlert.style.display = 'block';
    }
});