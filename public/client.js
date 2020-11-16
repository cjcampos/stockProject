console.log('Client-side code running');

const button = document.getElementById('myButton');
button.addEventListener('click', function(e) {
    console.log('button was clicked');
    hello("hello");
    test();
    /**
    fetch('/clicks', {method: 'GET'})
        .then(function(response) {
            console.log(response);
            if(response.ok) {
                console.log('click was recorded');
                return;
            }
            throw new Error('Request failed.');
        })
        .catch(function(error) {
            console.log(error);
        });
     **/
});

async function hello(symbol) {
    const url = 'https://stockfinalproject.herokuapp.com/getBasicStockInfo?symbol=' + symbol;
    console.log(url);
    let response = await fetch(url);
    let responseJSON = await response.json();
    console.log(responseJSON);
}

async function test(object) {
    const url = 'https://stockfinalproject.herokuapp.com/test';
    let result = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({try: object})
    });
    console.log(result.json);
}