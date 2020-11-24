const searchBox = document.getElementById('searchBox');
searchBox.addEventListener('keyup', async ({key}) => {
    if (key === "Enter") {
        const searchBoxValue = searchBox.value;
        const url = '/stocks?symbol=' + searchBoxValue;
        window.location = url;
        /**
        const url = '/getBasicStockInfo?symbol=' + searchBoxValue;
        await fetch(url, {
            method: 'GET'
        });

        await fetch('/getAdvancedStockInfo?symbol=' + searchBoxValue, {
            method: 'GET'
        });

        await fetch('/getBasicStockPage', {
            method: 'GET'
        });

        window.location = '/getBasicStockPage';
         **/

        //const data = await stockInfo.json();
        /**
        const newStockPage = await fetch('/getBasicStockPage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
         **/
        // const newHTML = document.open("text/html", "replace");
        //const data2 = await newStockPage.text();
        //await document.write(data2);
        // newHTML.write(data2);
        // newHTML.close();
    }
});

const signOut = document.getElementById('signOut');
if (signOut != null) {
    signOut.addEventListener('click', async function(e) {
        await fetch('/logout', {
            method: 'POST'
        });

        await fetch('/getBasicStockPage', {
            method: 'GET'
        });

        window.location = '/getBasicStockPage';
    });
}

const signIn = document.getElementById('signIn');
if (signIn != null) {
    signIn.addEventListener('click', async function(e) {
        window.location = '/sign-up';
    });
}

/**
const homepageReturn = document.getElementById('homepage');
homepageReturn.addEventListener('click', async function(e) {
    console.log("hello");
    await fetch('http://localhost:8080/', {
        method: 'GET'
    });
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
//});

async function hello(symbol) {
    const url = 'https://stockfinalproject.herokuapp.com/getBasicStockInfo?symbol=' + symbol;
    console.log(url);
    let response = await fetch(url);
    let responseJSON = await response.json();
    console.log(responseJSON);
}

async function test() {
    const url = 'https://stockfinalproject.herokuapp.com/test';
    const data = {username: "hello"};
    console.log(JSON.stringify(data));
    let result = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
}

function debounce(func, wait) {
    let timeout;
    return function() {
        let context = this;
        let args = arguments;
        let later = function() {
            timeout = null;
            func.apply(context, args);
        }
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

searchBox.addEventListener("input", debounce(async function(e) {
    closeAutoCompleteElement();

    if (this.value != "") {
        const searchBoxValue = this.value;
        const autocompleteOptions = await fetch('/getStockSymbols?symbol=' + searchBoxValue, {
            method: 'GET'
        });

        const data = await autocompleteOptions.json();

        const boxToContainAutoCompleteElement = document.createElement("div");
        boxToContainAutoCompleteElement.setAttribute("id", "autocompleteList");
        boxToContainAutoCompleteElement.setAttribute("class", "autocompleteItems");

        let length = 5;

        if (data.length < length) {
            length = data.length;
        }

        for (let index = 0; index < length; index++) {
            let autocompleteItem = document.createElement("div");
            autocompleteItem.innerHTML = "<strong>" + data[index].symbol + "(" + data[index].name + ")" + "</strong>";
            boxToContainAutoCompleteElement.appendChild(autocompleteItem);
            autocompleteItem.addEventListener("click", function (e) {
                searchBox.value = data[index].symbol;
                closeAutoCompleteElement();
            });
        }

        this.parentNode.appendChild(boxToContainAutoCompleteElement);
    }
}, 350));

searchBox.addEventListener("keydown", async function(e) {
    const boxOfAutoCompleteElements = document.getElementById("autocompleteList");
    if (boxOfAutoCompleteElements != null) {

    }
});

function closeAutoCompleteElement (){
    const boxOfAutoCompleteElements = document.getElementById("autocompleteList");
    if (boxOfAutoCompleteElements != null) {
        boxOfAutoCompleteElements.remove();
    }
}


const costPerShare = document.getElementById('costPerShare');
const numberOfShares = document.getElementById('numShares');
const totalCost = document.getElementById('totalCost');
if (numberOfShares != null) {
    numberOfShares.addEventListener("input", (e) => {
        if (numberOfShares.value >= 0) {
            let cost = (costPerShare.textContent).substring(1);
            totalCost.innerText = "$" + cost * numberOfShares.value;
        }
    });
}

const buyShares = document.getElementById('buyShares');
if (buyShares != null) {
    buyShares.addEventListener("click", async function () {
        if (numberOfShares.value > 0) {
            let cost = (costPerShare.textContent).substring(1);
            await fetch('/buyStock', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({stockSymbol: document.title, shares: numberOfShares.value, costPerShare: cost})
            });
        }
    });
}

// portfolio

let sellShares = document.querySelectorAll(".sell");
if (sellShares != null) {
    sellShares.forEach(button => button.addEventListener("click", async function () {
        const id = this.id.substring(4);
        const totalCost = document.getElementById('costPerShare' + id);
        const costPerShare = document.getElementById('costPerShare' + id);
        const field = document.getElementById(id);
        await fetch('/sellStock', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({stockSymbol: id, shares: field.value, costPerShare: parseFloat(costPerShare.textContent.substring(1))})
        });
    }));
}

const numberOfSharesPortfolio = document.querySelectorAll('.numShares');
numberOfSharesPortfolio.forEach(field => field.addEventListener("input", async () => {
    const totalCost = document.getElementById('totalCost' + field.id);
    const costPerShare = document.getElementById('costPerShare' + field.id);
    if(field.value >= 0) {
        let cost = (costPerShare.textContent).substring(1);
        totalCost.innerText = "$" + cost * field.value;
    }
}));

const addFundsField = document.getElementById('addFundsField');
const addFunds = document.getElementById('addFunds');
if (addFunds != null) {
    addFunds.addEventListener("click", async function () {
        if (addFundsField.value > 0) {
            await fetch('/addFunds', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({fundsToAdd: addFundsField.value})
            });
        }
    });
}
