let clickedOnce = true;
const costPerShare = document.getElementById('costPerShare');
const numberOfShares = document.getElementById('numShares');
const totalCost = document.getElementById('totalCost');
const buyShares = document.getElementById('buyShares');
const message = document.getElementById('message');
const portfolioAlert = document.getElementById('portfolioAlert');
portfolioAlert.addEventListener("click", () => {
    portfolioAlert.style.display = 'none';
});

function changeStyle() {
    if (clickedOnce) {
        document.getElementById('moreStockInformation').style.display = 'block';
        clickedOnce = false;
    } else {
        document.getElementById('moreStockInformation').style.display = 'none';
        clickedOnce = true;
    }
}

if (numberOfShares != null) {
    numberOfShares.addEventListener("input", (e) => {
        if (numberOfShares.value >= 0) {
            let cost = (costPerShare.textContent).substring(1);
            totalCost.innerText = "$" + cost * numberOfShares.value;
        }
    });
}

if (buyShares != null) {
    buyShares.addEventListener("click", async function () {
        if (numberOfShares.value > 0) {
            let cost = (costPerShare.textContent).substring(1);
            const fetchResponse = await fetch('/buyStock', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({stockSymbol: document.title, shares: numberOfShares.value, costPerShare: cost})
            });
            if (fetchResponse.status === 400) {
                message.innerHTML = "Not enough funds";
                portfolioAlert.style.display = 'block';
            } else if (fetchResponse.status === 200) {
                message.innerHTML = "Successfully bought shares";
                portfolioAlert.style.display = 'block';
            }
        } else if (numberOfShares.value <= 0) {
            message.innerHTML = "Invalid number of shares";
            portfolioAlert.style.display = 'block';
        }
    });
}