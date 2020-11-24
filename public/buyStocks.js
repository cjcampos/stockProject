let clickedOnce = true;
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

function changeStyle() {
    if (clickedOnce) {
        document.getElementById('moreStockInformation').style.display = 'block';
        clickedOnce = false;
    } else {
        document.getElementById('moreStockInformation').style.display = 'none';
        clickedOnce = true;
    }
}

buyStocksAlert.addEventListener("click", () => {
    buyStocksAlert.style.display = 'none';
});