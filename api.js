/* =====================================================
   LIVE CURRENCY CONVERTER
   API MODULE
   ===================================================== */


/*
    ExchangeRate-API Open Access endpoint.

    We don't need an API key for this endpoint.

    The currency after /latest/ is our BASE currency.

    Example:
    /latest/USD

    This means:
    "Give me the latest exchange rates from USD
     to all supported currencies."
*/
const API_URL = "https://open.er-api.com/v6/latest";


/* =====================================================
   GET EXCHANGE RATES
   ===================================================== */

/*
    This function gets exchange rates from the API.

    Example:

    getExchangeRates("USD")

    will request:

    https://open.er-api.com/v6/latest/USD
*/
async function getExchangeRates(baseCurrency) {

    try {

        /*
            Create the complete API URL.

            If baseCurrency is USD:

            https://open.er-api.com/v6/latest/USD
        */
        const url = `${API_URL}/${baseCurrency}`;


        /*
            Send a GET request to the API.

            fetch() is JavaScript's built-in way
            of requesting data from a server.
        */
        const response = await fetch(url);


        /*
            Check whether the HTTP request was successful.

            response.ok will be false if the server
            returns an error such as 404 or 500.
        */
        if (!response.ok) {

            throw new Error(
                `API request failed: ${response.status}`
            );

        }


        /*
            Convert the server response from JSON
            into a JavaScript object.
        */
        const data = await response.json();


        /*
            The API has a "result" property.

            A successful request should return:

            result: "success"
        */
        if (data.result !== "success") {

            throw new Error(
                "The currency API returned an error."
            );

        }


        /*
            Return the complete API data.

            Other JavaScript files can now use
            the exchange rates.
        */
        return data;

    }


    /*
        If something goes wrong, such as:

        - No internet connection
        - API server unavailable
        - Invalid currency
        - Network error

        the error will be caught here.
    */
    catch (error) {

        console.error(
            "Currency API Error:",
            error
        );


        /*
            Send the error to the code that called
            this function.
        */
        throw error;

    }

}


/* =====================================================
   GET A SPECIFIC EXCHANGE RATE
   ===================================================== */

/*
    This function gets one specific exchange rate.

    Example:

    getExchangeRate("USD", "XAF")

    means:

    "How much XAF is equal to 1 USD?"
*/
async function getExchangeRate(
    fromCurrency,
    toCurrency
) {

    /*
        Get all rates based on the source currency.

        Example:

        If fromCurrency = USD

        the API returns rates such as:

        USD → EUR
        USD → GBP
        USD → XAF
        USD → NGN
        etc.
    */
    const data = await getExchangeRates(
        fromCurrency
    );


    /*
        Find the exchange rate for the
        selected target currency.

        Example:

        data.rates["XAF"]
    */
    const rate = data.rates[toCurrency];


    /*
        Make sure the requested currency exists.
    */
    if (rate === undefined) {

        throw new Error(
            `Exchange rate for ${toCurrency} is unavailable.`
        );

    }


    /*
        Return the exchange rate.

        Example:

        1 USD = 612.50 XAF

        The function returns:

        612.50
    */
    return rate;

}
// ==========================================
// TESTING OUR API FUNCTION
// ==========================================

// Ask the API for the exchange rate from USD to XAF
getExchangeRate("USD", "XAF")
    .then(rate => {

        // Display the returned rate in the browser console
        console.log("1 USD =", rate, "XAF");

    })
    .catch(error => {

        // Display the error if the API request fails
        console.error("API Test Failed:", error);

    });