let clickedOnce = true;
const costPerShare = document.getElementById('costPerShare');
const stockSymbolValue = document.title;
const numberOfShares = document.getElementById('numShares');
const totalCost = document.getElementById('totalCost');
const buyShares = document.getElementById('buyShares');
const messageBox = document.getElementById('message');
const buyStocksAlert = document.getElementById('buyStocksAlert');
const lowPrice = document.getElementById('lowPrice');
const highPrice = document.getElementById('highPrice');
const currentPrice = document.getElementById('currentPrice');
const openPrice = document.getElementById('openPrice');
const previousClosePrice = document.getElementById('previousClosePrice');

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
});

lowPrice.innerHTML = currencyFormatter.format(parseFloat(lowPrice.textContent));
highPrice.innerHTML = currencyFormatter.format(parseFloat(highPrice.textContent));
currentPrice.innerHTML = currencyFormatter.format(parseFloat(currentPrice.textContent));
openPrice.innerHTML = currencyFormatter.format(parseFloat(openPrice.textContent));
previousClosePrice.innerHTML = currencyFormatter.format(parseFloat(previousClosePrice.textContent));
costPerShare.innerHTML = currencyFormatter.format(parseFloat(costPerShare.textContent));
totalCost.innerHTML = currencyFormatter.format(parseFloat(totalCost.textContent));

buyStocksAlert.addEventListener("click", () => {
    buyStocksAlert.style.display = 'none';
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

if (numberOfShares !== null) {
    numberOfShares.addEventListener("input", (e) => {
        if (numberOfShares.value >= 0) {
            let cost = parseFloat(((costPerShare.textContent).substring(1)).replace(/,/g, ""));
            totalCost.innerText = currencyFormatter.format(cost * numberOfShares.value);
        }
    });
}

if (buyShares !== null) {
    buyShares.addEventListener("click", async function () {
        await fetch('/buyStock', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({stockSymbol: stockSymbolValue, shares: numberOfShares.value})
        }).then((response) => {
            if (response.status === 200) {
                numberOfShares.value = 1;
                response.json().then(message => {
                    costPerShare.innerHTML = currencyFormatter.format(message['currentStockValue']);
                    messageBox.innerHTML = message['message'];
                    currentPrice.innerHTML = currencyFormatter.format(message['currentStockValue']);

                    buyStocksAlert.style.display = 'block';

                    const modalCostPerShare = document.getElementById('costPerShare');
                    modalCostPerShare.innerHTML = currencyFormatter.format(message['currentStockValue']);
                });
            } else if (response.status === 400) {
                response.json().then(message => {
                    messageBox.innerHTML = message['message'];
                    buyStocksAlert.style.display = 'block';
                });
            }
        });
        //if (numberOfShares.value > 0) {
        /**
            const fetchResponse = await fetch('/buyStock', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({stockSymbol: stockSymbolValue, shares: numberOfShares.value})
            });
         **/

            /**
            if (fetchResponse.status === 400) {
                message.innerHTML = "Not enough funds";
                buyStocksAlert.style.display = 'block';
            } else if (fetchResponse.status === 200) {
                message.innerHTML = "Successfully bought shares";
                buyStocksAlert.style.display = 'block';
            }
        } else if (numberOfShares.value <= 0) {
            message.innerHTML = "Invalid number of shares";
            buyStocksAlert.style.display = 'block';
        }
             **/
    });
}