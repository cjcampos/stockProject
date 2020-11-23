let sellShares = document.querySelectorAll(".sell");
const numberOfSharesPortfolio = document.querySelectorAll('.numShares');
const addFundsField = document.getElementById('addFundsField');
const addFunds = document.getElementById('addFunds');
const accountBalance = document.getElementById('accountBalance');
const portfolioBalance = document.getElementById('portfolioBalance');

if (sellShares != null) {
    sellShares.forEach(button => button.addEventListener("click", async function () {
        const id = this.id.substring(4);
        const totalCost = document.getElementById('totalValueOfShares' + id);
        const costPerShare = document.getElementById('costPerShare' + id);
        const field = document.getElementById(id);
        const currentSharesOwned = document.getElementById('numSharesOwned' + id);
        await fetch('/sellStock', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({stockSymbol: id, shares: field.value, costPerShare: parseFloat(costPerShare.textContent.substring(1))})
        });

        if (currentSharesOwned >= field.value) {
            const currentTotalValue = parseFloat(totalCost.textContent.substring(1)).toFixed(2);
            const currentValuePerShare = parseFloat(costPerShare.textContent.substring(1)).toFixed(2);
            const currentNumberOfShares = parseInt(currentSharesOwned.textContent);
            const currentAccountBalance = parseFloat(accountBalance.textContent.substring(1)).toFixed(2);
            const currentPortfolioBalance = parseFloat(portfolioBalance.textContent.substring(1)).toFixed(2);
            totalCost.innerHTML = "$" + ((currentTotalValue - (currentValuePerShare * field.value)).toFixed(2));
            currentSharesOwned.innerHTML = currentNumberOfShares - field.value;
            accountBalance.innerHTML = "$" + ((+currentAccountBalance + (currentValuePerShare * field.value)).toFixed(2));
            portfolioBalance.innerHTML = "$" + ((+currentPortfolioBalance - (currentValuePerShare * field.value)).toFixed(2));
            field.value = '';
            /**
            if (currentNumberOfShares === field.value) {
                const removeDiv = document.getElementById('allDiv' + id);
                removeDiv.parentNode.removeChild(removeDiv);
            }
             **/
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
        await fetch('/addFunds', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({fundsToAdd: addFundsField.value})
        });
        const currentAccountBalance = parseFloat(accountBalance.textContent.substring(1)).toFixed(2);
        const fundsToAdd = parseFloat(addFundsField.value);
        accountBalance.innerHTML = "$" + ((+currentAccountBalance + +fundsToAdd).toFixed(2));
        addFundsField.value = '';
    }
});