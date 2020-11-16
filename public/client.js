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

async function test(hello) {
    const url = 'https://stockfinalproject.herokuapp.com/test';
    const data = {username: hello};
    let result = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    console.log(result.json);
}