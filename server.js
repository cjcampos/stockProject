console.log('Server-side code running');

const express = require('express');
const app = express();

const finnhub = require('finnhub');
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = "bu3qnmf48v6up0bi2uvg" // Replace this
const finnhubClient = new finnhub.DefaultApi()

 finnhubClient.stockCandles("AAPL", "D", 1590988249, 1591852249, {}, (error, data, response) => {
    console.log(data)
});



// serve files from the public directory
app.use(express.static('public'));

app.listen(process.env.PORT || 3000);

// serve the homepage
// sends the
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// get the click data from the database
app.get('/clicks', (req, res) => {
    res.json(req.query.symbol);
    console.log(req);
    console.log("working");
    console.log("send info");
    // const string = {hey: 'hello'};
    //res.json(string);
    /**
     db.collection('clicks').find().toArray((err, result) => {
        if (err) return console.log(err);
        res.send(result);
    });
     **/
});

// add a document to the DB collection recording the click event
app.post('/clicked', (req, res) => {
    const click = {clickTime: new Date()};
    console.log(click);
    /**
     console.log(db);

     db.collection('clicks').save(click, (err, result) => {
        if (err) {
            return console.log(err);
        }
        console.log('click added to db');
        res.sendStatus(201);
    });
     **/
});

/**

// connect to the db and start the express server
let db;

// Replace the URL below with the URL for your database
const url =  'mongodb://user:password@mongo_address:mongo_port/clicks';

MongoClient.connect(url, (err, database) => {
    if(err) {
        return console.log(err);
    }
    db = database;
    // start the express web server listening on 8080
    app.listen(8080, () => {
        console.log('listening on 8080');
    });
});

 **/

