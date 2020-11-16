const stockOwnedData = require('data-store')({ path: process.cwd() + '/data/stocksOwned.json' });

class stocksOwned {
    constructor (id, owner, accountBalance) {
        this.id = id;
        this.owner = owner;
        this.accountBalance = accountBalance;
        this.userStocks = new Map();
    }

    addFunds (fundsToAdd) {
        this.accountBalance += fundsToAdd;
        stockOwnedData.set(this.id.toString(), this);
    }

    deleteAccount () {
        stockOwnedData.del(this.id.toString());
    }

    buyStock (symbol, shares, cost) {
        if (this.accountBalance >= cost) {
            this.accountBalance -= cost;
            if (this.userStocks.has(symbol)) {
                this.userStocks.set(symbol, shares + this.userStocks.get(symbol));
            } else {
                this.userStocks.set(symbol, shares);
            }
        }
    }

    sellStock (symbol, shares, sellValue) {
        if (this.userStocks.get(symbol) >= shares && this.userStocks.has(symbol)) {
            this.accountBalance += sellValue;
            this.userStocks.set(symbol, this.userStocks.get(symbol) - shares);
        }
    }
}

stocksOwned.getAllIDs = () => {
    return Object.keys(stockOwnedData.data).map(id => parseInt(id));
};

stocksOwned.getAllIDsForOwner = (owner) => {
    return Object.keys(stockOwnedData.data).filter(id => stockOwnedData.get(id).owner === owner).map(id => parseInt(id));
}

stocksOwned.findByID = (id) => {
    let stockData = stockOwnedData.get(id);
    if (stockData != null) {
        return new stocksOwned(stockData.id, stockData.owner);
    }
    return null;
};

stocksOwned.nextID = stocksOwned.getAllIDs().reduce((max, nextID) => {
    if (max < nextID) {
        return nextID;
    }
    return max;
}, -1) + 1;

stocksOwned.create = (owner, secret) => {
    let id = stocksOwned.nextID;
    stocksOwned.nextID += 1;
    let s = new stocksOwned(id, owner, secret);
    stockOwnedData.set(s.id.toString(), s);
    return s;
}

module.exports = stocksOwned;