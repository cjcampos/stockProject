const modalBuyStock = document.getElementById('buyStock');
const buySharesButton = document.getElementById('buyShares');

modalBuyStock.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        buySharesButton.click();
    }
});