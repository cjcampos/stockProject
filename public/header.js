const searchBox = document.getElementById('searchBox');
searchBox.addEventListener('keyup', async ({key}) => {
    if (key === "Enter") {
        const searchBoxValue = searchBox.value;
        const url = '/stocks?symbol=' + searchBoxValue;
        window.location = url;
    }
});

const signOut = document.getElementById('signOut');
if (signOut != null) {
    signOut.addEventListener('click', async function(e) {
        await fetch('/logout', {
            method: 'GET'
        });
    });
}

const signIn = document.getElementById('signIn');
if (signIn != null) {
    signIn.addEventListener('click', async function(e) {
        window.location = '/sign-up';
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