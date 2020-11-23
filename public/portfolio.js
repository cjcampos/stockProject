let sellShares = document.querySelectorAll(".sell");
const numberOfSharesPortfolio = document.querySelectorAll('.numShares');
const addFundsField = document.getElementById('addFundsField');
const addFunds = document.getElementById('addFunds');
const accountBalance = document.getElementById('accountBalance');
const portfolioBalance = document.getElementById('portfolioBalance');
const message = document.getElementById('message');
const portfolioAlert = document.getElementById('portfolioAlert');

portfolioAlert.addEventListener("click", () => {
    portfolioAlert.style.display = 'none';
});

if (sellShares != null) {
    sellShares.forEach(button => button.addEventListener("click", async function () {
        const id = this.id.substring(4);
        const totalCost = document.getElementById('totalValueOfShares' + id);
        const costPerShare = document.getElementById('costPerShare' + id);
        const field = document.getElementById(id);
        const currentSharesOwned = document.getElementById('numSharesOwned' + id);
        const numberOfCurrentShares = parseInt(currentSharesOwned.textContent);
        const response = await fetch('/sellStock', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({stockSymbol: id, shares: field.value, costPerShare: parseFloat(costPerShare.textContent.substring(1))})
        });

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
            message.innerHTML = "Cannot sell more shares than you own";
            portfolioAlert.style.display = 'block';
        }

        if (response.status === 200) {
            field.value = 1;
            message.innerHTML = "Successfully sold shares";
            portfolioAlert.style.display = 'block';
        } else if (response.status === 400) {
            field.value = 1;
            message.innerHTML = "Error, you do not own enough shares of the stock";
            portfolioAlert.style.display = 'block';
        }
    }));
}

numberOfSharesPortfolio.forEach(field => field.addEventListener("input", async () => {
    const totalCost = document.getElementById('totalCost' + field.id);
    const costPerShare = document.getElementById('costPerShare' + field.id);
    if(field.value >= 0) {
        let cost = (costPerShare.textContent).substring(1);
        totalCost.innerText = "$" + cost * field.value;
    }
}));

addFunds.addEventListener("click", async function () {
    if (addFundsField.value > 0) {
        const result =  await fetch('/addFunds', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({fundsToAdd: addFundsField.value})
        });
        const currentAccountBalance = parseFloat(accountBalance.textContent.substring(1)).toFixed(2);
        const fundsToAdd = parseFloat(addFundsField.value);
        accountBalance.innerHTML = "$" + ((+currentAccountBalance + +fundsToAdd).toFixed(2));
        if (result.status === 200) {
            addFundsField.value = '';
            message.innerHTML = "Successfully added funds";
            portfolioAlert.style.display = 'block';
        } else if (result.status === 400) {
            message.innerHTML = "Error, invalid sum of funds";
            portfolioAlert.style.display = 'block';
        }
    } else {
        message.innerHTML = "Error, invalid sum of funds";
        portfolioAlert.style.display = 'block';
    }
});