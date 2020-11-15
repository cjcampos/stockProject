console.log('Client-side code running');

const button = document.getElementById('myButton');
button.addEventListener('click', function(e) {
    console.log('button was clicked');
    hello('APPL');
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
    const url = 'localhost:8080/clicks?symbol=' + symbol;
    console.log(url);
    let response = await fetch(url);
    let responseJSON = await response.json();
    console.log(responseJSON);
}