let users = require('data-store')({ path: process.cwd() + '/data/users.json' });

class userProfiles {
    constructor (password, accountBalance) {
        this.password = password;
        this.accountBalance = accountBalance;
        this.userStocks = {};
        this.totalFundsAdded = accountBalance;
    }
}

userProfiles.getAllUserStocksForOwner = (owner) => {
    return Object.keys(users.data).filter(id => users.get(id).owner === owner).map(id => parseInt(id));
}

userProfiles.get = (owner, password) => {
    if (Object.keys(users.data).includes(owner.toLowerCase())) {
        const currentUser = users.get(owner);
        if (password === currentUser.password) {
            return true;
        }
    }
    return false;
}

userProfiles.create = (owner, password, accountBalance) => {
    if (!Object.keys(users.data).includes(owner.toLowerCase())) {
        let accountBalanceCast = parseFloat(accountBalance);
        let ownerCast = owner.toLowerCase();
        let account = new userProfiles(password, accountBalanceCast);
        users.set(ownerCast, account);
        users.save();
        return account;
    }
    return null;
}

userProfiles.getFunds = (owner) => {
    const userProfile = users.get(owner);
    users.save();
    return userProfile.accountBalance;
}

userProfiles.getTotalFundsAdded = (owner) => {
    const userProfile = users.get(owner);
    users.save();
    return userProfile.totalFundsAdded;
}

userProfiles.updateAddFunds = (owner, fundsToAdd) => {
    const userProfile = users.get(owner);
    userProfile.accountBalance += parseFloat(fundsToAdd);
    userProfile.totalFundsAdded += parseFloat(fundsToAdd);
    users.set(owner, userProfile);
    users.save();
    return userProfile.accountBalance;
}

userProfiles.canBuyStock = (owner, shares, costPerShare) => {
    const userProfile = users.get(owner);
    users.save();
    return (userProfile.accountBalance >= (shares * costPerShare));
}

userProfiles.buyStock = (owner, stockSymbol, shares, costPerShare) => {
    const userProfile = users.get(owner);
    if (userProfile.accountBalance >= (shares * costPerShare)) {
        userProfile.accountBalance -= (shares * costPerShare);
        if (userProfile.userStocks[stockSymbol] !== undefined) {
            userProfile.userStocks[stockSymbol] = parseInt(shares) + parseInt(userProfile.userStocks[stockSymbol]);
            users.set(owner, userProfile);
            users.save();
        } else {
            userProfile.userStocks[stockSymbol] = parseInt(shares);
            users.set(owner, userProfile);
            users.save();
        }
    }
}

userProfiles.hasStock = (owner, stockSymbol, shares) => {
    const userProfile = users.get(owner);
    if (userProfile.userStocks[stockSymbol] !== undefined) {
        return (userProfile.userStocks[stockSymbol] >= shares && shares >= 0);
    } else {
        return false;
    }
}

userProfiles.sellStock = (owner, stockSymbol, shares, costPerShare) => {
    const userProfile = users.get(owner);
    userProfile.accountBalance += (shares * costPerShare);
    userProfile.userStocks[stockSymbol] = userProfile.userStocks[stockSymbol] - shares;
    if (userProfile.userStocks[stockSymbol] === 0) {
        delete userProfile.userStocks[stockSymbol];
        users.set(owner, userProfile);
        return { numOfStocks: 0, accountBalance: userProfile.accountBalance, changeInBalance: (shares * costPerShare), valueForAllShares: 0, totalFundsAdded: userProfile.totalFundsAdded };
    }
    users.set(owner, userProfile);
    return { numOfStocks: userProfile.userStocks[stockSymbol], accountBalance: userProfile.accountBalance, changeInBalance: (shares * costPerShare), valueForAllShares: (userProfile.userStocks[stockSymbol] * costPerShare), totalFundsAdded: userProfile.totalFundsAdded};
}

userProfiles.deleteAccount = (owner) => {
    users.del(owner);
}

userProfiles.getAllStocks = (owner) => {
    const userProfile = users.get(owner);
    let stocksOwned = userProfile.userStocks;
    let stockSymbols = [];
    for (let stock in stocksOwned) {
        let symbol = stock;
        let shares = stocksOwned[stock];
        stockSymbols.push([symbol, shares]);
    }
    return stockSymbols;
}

module.exports = userProfiles;