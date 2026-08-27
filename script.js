// ==========================================
// MEMBER 3: CONVERSION LOGIC
// ==========================================

// 1. Select HTML elements from the DOM
const amountInput = document.getElementById("amount");
const fromSelect = document.getElementById("fromCurrency");
const toSelect = document.getElementById("toCurrency");
const convertBtn = document.getElementById("convertBtn");
const swapBtn = document.getElementById("swapBtn");
const resultText = document.getElementById("resultText");

// Accent Color used for success: #10B981 | Error color: red
const ACCENT_GREEN = "#10B981";

// Frankfurter API endpoint (Supports all major global currencies)
const API_BASE_URL = "https://api.frankfurter.dev/v1";

/**
 * Loads all available currencies dynamically into the dropdown menus
 */
async function loadCurrencyList() {
  try {
    const response = await fetch(`${API_BASE_URL}/currencies`);
    const data = await response.json();

    // Clear loading options
    fromSelect.innerHTML = "";
    toSelect.innerHTML = "";

    // Populate select options with Currency Code and Name
    Object.entries(data).forEach(([code, name]) => {
      const option1 = new Option(`${code} - ${name}`, code);
      const option2 = new Option(`${code} - ${name}`, code);

      fromSelect.add(option1);
      toSelect.add(option2);
    });

    // Set standard default pair
    fromSelect.value = "USD";
    toSelect.value = "EUR";

    // Perform initial calculation
    performConversion();
  } catch (error) {
    resultText.style.color = "red";
    resultText.textContent = "Failed to load currency list.";
  }
}

/**
 * Calculates conversion math and updates output styling
 */
async function performConversion() {
  const amountValue = parseFloat(amountInput.value);
  const fromCurrency = fromSelect.value;
  const toCurrency = toSelect.value;

  // Input Validation: Prevent negative or non-numeric entries
  if (isNaN(amountValue) || amountValue <= 0) {
    resultText.style.color = "red";
    resultText.textContent = "Please enter a valid amount greater than 0.";
    return;
  }

  // Handle same currency conversion
  if (fromCurrency === toCurrency) {
    resultText.style.color = ACCENT_GREEN;
    resultText.textContent = `${amountValue} ${fromCurrency} = ${amountValue.toFixed(2)} ${toCurrency}`;
    return;
  }

  resultText.style.color = ACCENT_GREEN;
  resultText.textContent = "Converting...";

  try {
    const response = await fetch(
      `${API_BASE_URL}/latest?amount=${amountValue}&from=${fromCurrency}&to=${toCurrency}`
    );
    const data = await response.json();

    const convertedTotal = data.rates[toCurrency].toFixed(2);
    resultText.textContent = `${amountValue} ${fromCurrency} = ${convertedTotal} ${toCurrency}`;
  } catch (error) {
    resultText.style.color = "red";
    resultText.textContent = "Error calculating conversion rate.";
  }
}

/**
 * Swaps source and target currency dropdown selections
 */
function swapCurrencies() {
  const temp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = temp;
  performConversion();
}

// Event Listeners for user interactions
convertBtn.addEventListener("click", performConversion);
swapBtn.addEventListener("click", swapCurrencies);

// Initialize currency dropdowns when script loads
loadCurrencyList();