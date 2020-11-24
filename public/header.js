const searchBox = document.getElementById('searchBox');
const signOut = document.getElementById('signOut');
const signIn = document.getElementById('signIn');
let currentSelection = -1;

searchBox.addEventListener('keyup', async ({key}) => {
    if (key === "Enter") {
        const searchBoxValue = searchBox.value;
        const url = '/stocks?symbol=' + searchBoxValue;
        window.location = url;
    }
});

if (signOut != null) {
    signOut.addEventListener('click', async function(e) {
        await fetch('/logout', {
            method: 'GET'
        });
    });
}

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

        let listLength = 5;
        currentSelection = -1;

        if (data.length < listLength) {
            listLength = data.length;
        }

        for (let index = 0; index < listLength; index++) {
            let autocompleteItem = document.createElement("div");
            autocompleteItem.innerHTML = "<strong>" + data[index].symbol + " (" + data[index].name + ")" + "</strong>";
            boxToContainAutoCompleteElement.appendChild(autocompleteItem);
            autocompleteItem.addEventListener("click", function (e) {
                searchBox.value = data[index].symbol;
                closeAutoCompleteElement();
                const searchBoxValue = searchBox.value;
                const url = '/stocks?symbol=' + searchBoxValue;
                window.location = url;
            });
        }
        this.parentNode.appendChild(boxToContainAutoCompleteElement);
    }
}, 300));

searchBox.addEventListener("keydown", async function(e) {
    const boxOfAutoCompleteElements = document.getElementById("autocompleteList");
    if (boxOfAutoCompleteElements != null) {
        const autocompleteElements = boxOfAutoCompleteElements.getElementsByTagName("div");
        if (autocompleteElements.length > 0) {
            if (e.key === "ArrowDown") {
                if (currentSelection === autocompleteElements.length - 1) {
                    autocompleteElements[currentSelection].classList.remove("searchBarActive");
                    currentSelection = 0;
                } else if (currentSelection === -1) {
                    currentSelection++;
                } else {
                    autocompleteElements[currentSelection].classList.remove("searchBarActive");
                    currentSelection++;
                }
                autocompleteElements[currentSelection].classList.add('searchBarActive');
            } else if (e.key === "ArrowUp") {
                if (currentSelection === 0) {
                    autocompleteElements[currentSelection].classList.remove("searchBarActive");
                    currentSelection = autocompleteElements.length - 1;
                } else if (currentSelection === -1) {
                    currentSelection = autocompleteElements.length - 1;
                } else {
                    autocompleteElements[currentSelection].classList.remove("searchBarActive");
                    currentSelection--;
                }
                autocompleteElements[currentSelection].classList.add('searchBarActive');
            } else if (e.key === "Enter") {
                autocompleteElements[currentSelection].click();
            }
        }
    }
});

function closeAutoCompleteElement (){
    const boxOfAutoCompleteElements = document.getElementById("autocompleteList");
    if (boxOfAutoCompleteElements != null) {
        boxOfAutoCompleteElements.remove();
    }
}

document.addEventListener("click", function (e) {
    closeAutoCompleteElement();
});