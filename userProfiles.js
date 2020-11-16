const users = require('data-store')({ path: process.cwd() + '/data/users.json' });

class userProfiles {
    constructor (password, accountBalance) {
        this.password = password;
        this.accountBalance = accountBalance;
        this.userStocks = {};
    }
}

userProfiles.getAllUserStocksForOwner = (owner) => {
    return Object.keys(users.data).filter(id => users.get(id).owner === owner).map(id => parseInt(id));
}

userProfiles.create = (owner, password, accountBalance) => {
    if (!Object.keys(users.data).includes(owner)) {
        let account = new userProfiles(password, accountBalance);
        users.set(owner, account);
        return account;
    }
    return null;
}

userProfiles.updateAddFunds = (owner, fundsToAdd) => {
    const userProfile = users.get(owner);
    userProfile.accountBalance += fundsToAdd;
    users.set(owner, userProfile);
}

userProfiles.canBuyStock = (owner, shares, costPerShare) => {
    const userProfile = users.get(owner);
    return (userProfile.accountBalance >= (shares * costPerShare));
}

userProfiles.buyStock = (owner, stockSymbol, shares, costPerShare) => {
    const userProfile = users.get(owner);
    if (userProfile.accountBalance >= (shares * costPerShare)) {
        userProfile.accountBalance -= (shares * costPerShare);
        if (userProfile.userStocks[stockSymbol] != undefined) {
            userProfile.userStocks[stockSymbol] = shares + userProfile.userStocks[stockSymbol];
            users.set(owner, userProfile);
        } else {
            userProfile.userStocks[stockSymbol] = shares;
            users.set(owner, userProfile);
        }
    }
}

userProfiles.hasStock = (owner, stockSymbol, shares) => {
    const userProfile = users.get(owner);
    if (userProfile.userStocks[stockSymbol] !== undefined) {
        return (userProfile.userStocks[stockSymbol] >= shares);
    } else {
        return false;
    }
}

userProfiles.sellStock = (owner, stockSymbol, shares, costPerShare) => {
    const userProfile = users.get(owner);
    userProfile.accountBalance += (shares * costPerShare);
    userProfile.userStocks[stockSymbol] = userProfile.userStocks[stockSymbol] - shares;
    users.set(owner, userProfile);
}

userProfiles.deleteAccount = (owner) => {
    users.del(owner);
}

module.exports = userProfiles;