# The API for autocomplete generation is different from the one that generates the stock data information. Therefore, selecting values might result in 404 pages.
# The API for stock information has a limited number of calls that can be made in a minute.
# API Documentation

Homepage (1)
Purpose:
	Renders the homepage based on whether the user has a logged in cookie.
Endpoint:
	GET /
Request Body:
	Checks the user’s browser for a cookie and changes text and links in the header to either allow the user to log in or logout.
Response:
	Renders an ejs file with a form to sign in with a specific JSON object which changes the links and text in the header depending on whether the user is logged in or not.

Sign In (2)
Purpose:
	Renders a page with a form to allow the user to sign in.
Endpoint:
	GET /signIn
Request Body:
	Checks the user’s browser for a cookie and changes text and links in the header to either allow the user to log in or logout.
Response:
	Renders an ejs file with a form to sign in with a specific JSON object which changes the links and text in the header depending on whether the user is logged in or not.

Stocks (3)
Purpose:
	Renders a page with a stock’s information utilizing the Finnhub API to get the stock’s data.
Endpoint:
	GET /stocks
Request Parameters:
	Symbol (string) – Required value which determines which stock to search for.
Response:
	Renders an ejs file using the fetch request obtained by getting the stock information from Finnhub API.

Sign Up (4)
Purpose:
	Renders a page with a form to allow the user to sign up.
Endpoint:
	GET /signUp
Request Body:
	Checks the user’s browser for a cookie and changes text and links in the header to either allow the user to log in or logout.
Response:
	Renders an ejs file with a form to sign up with a specific JSON object which changes the links and text in the header depending on whether the user is logged in or not.

Portfolio (5)
Purpose:
	Renders a page with information regarding all the stocks a user owns along with their account’s monetary information.
Endpoint:
	GET /myPortfolio
Request Body:
	Requires the user to have logged in to continue.
Response:
	Renders an ejs file containing stock information about all the stocks a user owns and their monetary account information.

Get Symbol (6)
Purpose:
	Fetches information about possible stock symbols based on input.
Endpoint:
	GET /getStockSymbols
Request Parameters:
	Symbol (string) – Requires a text field to search for all possible stock market values which could potentially match the text.
Response:
	JSON response with the stock symbols and company’s name for all possible symbol matches.

Login (7)
Purpose:
	Allows the user to log in to their account and have a cookie attached to their browser.
Endpoint:
	POST /login
Request Body:
	User (string) – Requires a text field with the username field.
	Password (string) – Requires a text field with the password field.
Response:
	Checks the user’s username and password for a match and adds a cookie to their browser. Afterwards, it redirects them to their homepage. If the username and password do not match, it allows them to retry to log in.

Logout (8)
Purpose:
	Logs a user out of their account
Endpoint:
	POST /logout
Request Body:
	None
Response:
	Deletes the user’s cookie and redirects them to the homepage.

Sign Up (9)
Purpose:
	Allows the user to create a new account
Endpoint:
	POST /signUp
Request Body:
	User (string) – Requires a username to be associated with the new account.
	Password (string) – Requires a password to be associated with the new account.
	AccountBalance (float) – Requires a starting account balance for the new account.
Response:
	Creates an account based on user’s specifications and redirects them to the homepage or displays an error to allow the user to try again.

Add Funds (10)
Purpose:
	Adds funds to the user account.
Endpoint:
	POST /addFunds
Request Body:
	FundsToAdd (float) – Value of funds to add to the account.
Response:
	Adds funds to the account if the user has a cookie. Otherwise, it sends an error message.

Buy Stock (11)
Purpose:
	Add a stock to the user’s account and remove the appropriate amount from their account.
Endpoint:
	POST /sellStock
Request Body:
	StockSymbol (string) – Required stock symbol of the stock the user wants to buy.
	Shares (integer) – Required number of shares the user wants to buy.
Response:
	Sells a stock from the user’s account if they are logged in and have the appropriate number of shares to sell.

Delete (12)
Purpose:
	Deletes a user account
Endpoint:
	POST /delete
Request Body:
	None
Response:
	Deletes a user’s account if they are logged in by checking for cookies.

404 (13)
Purpose:
	Loads a website if the user attempts to search for a page that does not exist.
Endpoint:
	GET /*
Response:
	Redirects a user to a page which displays a 404 error message.
