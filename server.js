const express = require('express');
const app = express();

const finnhub = require('finnhub');
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = "bu3qnmf48v6up0bi2uvg" // Replace this
const finnhubClient = new finnhub.DefaultApi()

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const expressSession = require('express-session');

app.use(expressSession({
    name: "stockSessionCompany",
    secret: "FA6BBA0BE064725A45E6F253EAB3D153EC15AABE8E701505512E0CE22A81DFFF",
    resave: false,
    saveUninitialized: false
}));



// serve files from the public directory
app.use(express.static('public'));

// app.listen(process.env.PORT || 3000);
app.listen(8080);

// sends the homepage
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// get basic stock data from the API
app.get('/getBasicStockInfo', (req, res) => {
    finnhubClient.quote(req.query.symbol, (error, data, response) => {
        res.json(data);
    });
});

// get advanced stock data from the API
app.get('/getAdvancedStockInfo', (req, res) => {
    finnhubClient.companyProfile2(req.query.symbol, (error, data, response) => {
        res.json(data);
    });
});

// const Stocks = require("./stocksOwned.js");
const UserProfiles = require("./userProfiles.js");

const loginData = require('data-store')({ path: process.cwd() + '/data/users.json' });

app.post('/login', (req,res) => {
    let user = req.body.user;
    let password = req.body.password;

    let userData = loginData.get(user);
    if (userData == null) {
        res.status(404).send("Not found");
        return;
    }
    if (userData.password == password) {
        console.log("User " + user + " credentials valid");
        req.session.user = user;
        res.json(true);
        return;
    }
    res.status(403).send("Unauthorized");
});

app.get('/logout', (req, res) => {
    delete req.session.user;
    res.json(true);
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

app.post('/test', (req, res)=> {
    console.log(req.body);
    res.status(200).send("username: " + req.body.username);
    return;
});