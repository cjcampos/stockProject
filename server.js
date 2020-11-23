const express = require('express');
const app = express();

let ejs = require('ejs');

const finnhub = require('finnhub');
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = "bu3qnmf48v6up0bi2uvg" // Replace this
const finnhubClient = new finnhub.DefaultApi();

const fetch = require('node-fetch');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const expressSession = require('express-session');

app.use(expressSession({
    name: "stockSessionCompany",
    secret: "FA6BBA0BE064725A45E6F253EAB3D153EC15AABE8E701505512E0CE22A81DFFF",
    resave: false,
    saveUninitialized: false
}));

app.set('views', __dirname + '/views');
app.set('view engine', ejs);

// serve files from the public directory
app.use(express.static('public'));

app.listen(process.env.PORT || 3000);
// app.listen(8080);

// sends the homepage
app.get('/', (req, res) => {
    if (req.session.user == undefined) {
        const userStatus = {
            accountStatus: 'Sign In',
            accountID: 'signIn',
            accountLink: 'signIn',
            portfolioLink: 'signIn'
        }
        res.render("index.ejs", userStatus);
    } else {
        const userStatus = {
            accountStatus: 'Sign Out',
            accountID: 'signOut',
            accountLink: 'logout',
            portfolioLink: 'myPortfolio'
        }
        res.render("index.ejs", userStatus);
    }
});

// sends the sign in page
app.get('/signIn', (req, res) => {
    if (req.session.user == undefined) {
        const userStatus = {
            accountStatus: 'Sign In',
            accountID: 'signIn',
            accountLink: 'signIn',
            portfolioLink: 'signIn'
        }
        res.render("sign-in.ejs", userStatus);
    } else {
        const userStatus = {
            accountStatus: 'Sign Out',
            accountID: 'signOut',
            accountLink: 'logout',
            portfolioLink: 'myPortfolio'
        }
        res.render("sign-in.ejs", userStatus);
    }
});

app.get('/stocks', (req, res) => {
    let basicStockInfo;
    let advancedStockInfo;

    finnhubClient.quote(req.query.symbol, (error, data, response) => {
        basicStockInfo = data;
        basicStockInfo = {
            o: data['o'].toFixed(2),
            h: data['h'].toFixed(2),
            l: data['l'].toFixed(2),
            c: data['c'].toFixed(2),
            pc: data['pc'].toFixed(2)
        }
        finnhubClient.companyProfile2({symbol: req.query.symbol}, (error, data, response) => {
            if (basicStockInfo['o'] != 0) {
                advancedStockInfo = {
                    country: data['country'],
                    currency: data['currency'],
                    exchange: data['exchange'],
                    shareOutstanding: data['shareOutstanding'].toFixed(2),
                    ipo: (data['ipo'].getMonth()).toString() + "-" + (data['ipo'].getDate()).toString() + "-" + (data['ipo'].getFullYear()).toString(),
                    name: data['name'],
                    ticker: data['ticker']
                }

                let allStockData = {...basicStockInfo, ...advancedStockInfo};
                if (req.session.user == undefined) {
                    const userStatus = {
                        accountStatus: 'Sign In',
                        accountID: 'signIn',
                        accountLink: 'signIn',
                        portfolioLink: 'signIn'
                    }
                    allStockData = {...allStockData, ...userStatus};
                } else {
                    const userStatus = {
                        accountStatus: 'Sign Out',
                        accountID: 'signOut',
                        accountLink: 'logout',
                        portfolioLink: 'myPortfolio'
                    }
                    allStockData = {...allStockData, ...userStatus};
                }

                res.render("stockPage.ejs", allStockData);
            } else {
                res.status(404).send("Not Found");
            }
        });
    });
});

// get advanced stock data from the API
app.get('/signUp', (req, res) => {
    if (req.session.user == undefined) {
        const userStatus = {
            accountStatus: 'Sign In',
            accountID: 'signIn',
            accountLink: 'signIn',
            portfolioLink: 'signIn'
        }
        res.render("sign-up.ejs", userStatus);
    } else {
        const userStatus = {
            accountStatus: 'Sign Out',
            accountID: 'signOut',
            accountLink: 'logout',
            portfolioLink: 'myPortfolio'
        }
        res.render("sign-up.ejs", userStatus);
    }
});

// get all user stocks
app.get('/myPortfolio', (req, res) => {
    if (req.session.user === undefined) {
        return res.redirect('/signIn');
    }

    let portfolioBalance = 0;
    const fundsRemaining = UserProfiles.getFunds(req.session.user);
    let stock = [];
    const myStocks = UserProfiles.getAllStocks(req.session.user);
    let resultCounter = 0;
    let oncePerLoop = true;

    if (myStocks === undefined || myStocks.length === 0) {
        res.render('portfolio.ejs', {
            stocks: stock,
            accountBalance: fundsRemaining.toFixed(2),
            portfolio: 0,
            accountStatus: 'Sign Out',
            accountID: 'signOut',
            accountLink: 'logout',
            portfolioLink: 'myPortfolio'
        });
        return;
    }

    for (let index = 0; index < myStocks.length; index++) {
        finnhubClient.quote(myStocks[index][0], (error, data, response) => {
            if (oncePerLoop) {
                oncePerLoop = false;
                portfolioBalance += data.c * myStocks[index][1];
                stock[index] = {
                    stockName: myStocks[index][0],
                    shares: myStocks[index][1],
                    currentValue: (data.c).toFixed(2),
                    totalValueOfShares: (data.c * myStocks[index][1]).toFixed(2)
                };
                resultCounter++;
                if (resultCounter === myStocks.length) {
                    let moneyOnAccount = fundsRemaining.toFixed(2);
                    let portfolioValue = portfolioBalance.toFixed(2);
                    res.render('portfolio.ejs', {
                        stocks: stock,
                        accountBalance: moneyOnAccount,
                        portfolio: portfolioValue,
                        accountStatus: 'Sign Out',
                        accountID: 'signOut',
                        accountLink: 'logout'
                    });
                }
                oncePerLoop = true;
            }
        });
    }
});

// get stock symbol
app.get('/getStockSymbols', (req, res) => {
    const url = 'https://ticker-2e1ica8b9.now.sh//keyword/' + req.query.symbol;
    fetch(url, {method: "GET"}).then(res => res.json()).then((json) => {
        res.json(json);
    });
})

const UserProfiles = require("./userProfiles.js");

const loginData = require('data-store')({ path: process.cwd() + '/data/users.json' });

app.post('/login', (req,res) => {
    let user = req.body.user;
    let password = req.body.password;

    let userData = loginData.get(user.toLowerCase());

    if (userData == null) {
        res.status(404).send("Not found");
        return;
    }

    if (userData.password == password) {
        req.session.user = user.toLowerCase();
        const userStatus = {
            accountStatus: 'Sign Out',
            accountID: 'signOut',
            accountLink: 'logout',
            portfolioLink: 'myPortfolio'
        }
        return res.redirect('/');
    }
});

app.get('/logout', (req, res) => {
    delete req.session.user;
    const userStatus = {
        accountStatus: 'Sign In',
        accountID: 'signIn',
        accountLink: 'signIn',
        portfolioLink: 'signIn'
    }
    res.render("index.ejs", userStatus);
});

app.post('/signUp', (req, res)=> {
    let s = UserProfiles.create(req.body.user, req.body.password, req.body.accountBalance);
    if (s == null) {
        res.status(400).send("Bad Request");
        return;
    }
    return res.json(s);
});

app.post('/addFunds', (req, res)=> {
    if (req.session.user == undefined) {
        res.status(403).send("Unauthorized");
        return;
    }

    UserProfiles.updateAddFunds(req.session.user, req.body.fundsToAdd);
    res.status(200).send("Successfully Added Funds");
    return;
});

app.post('/buyStock', (req, res)=> {
    if (req.session.user == undefined) {
        res.status(403).send("Unauthorized");
        return;
    }

    if (!(UserProfiles.canBuyStock(req.session.user, req.body.shares, req.body.costPerShare))) {
        res.status(400).send("Not Enough Funds");
        return;
    }

    UserProfiles.buyStock(req.session.user, req.body.stockSymbol, req.body.shares, req.body.costPerShare);
    res.status(200).send("Successfully Bought");
    return;
});

app.post('/sellStock', (req, res)=> {
    if (req.session.user == undefined) {
        res.status(403).send("Unauthorized");
        return;
    }

    if (!(UserProfiles.hasStock(req.session.user, req.body.stockSymbol, req.body.shares))) {
        res.status(400).send("Does Not Have Stock or Enough Shares");
        return;
    }

    UserProfiles.sellStock(req.session.user, req.body.stockSymbol, req.body.shares, req.body.costPerShare);
    res.status(200).send("Successfully Sold");
    return;
});

app.post('/delete', (req, res)=> {
    if (req.session.user == undefined) {
        res.status(403).send("Unauthorized");
        return;
    }

    UserProfiles.deleteAccount(req.session.user);
    delete req.session.user;
    res.status(200).send("Successfully Deleted Account");
    return;
});

app.get('/userInfo', (req, res) => {
    if (req.session.user == undefined) {
        res.status(403).send("Unauthorized");
        return;
    }

    return UserProfiles.getFunds(req.session.user);
});

app.get('*', function(req, res){
    res.status(404).send("Not Found");
});