document.addEventListener("DOMContentLoaded", () => {
    const flagLinks = document.querySelectorAll(".flag-item a");
    const refreshButton = document.querySelector(".rb2"); // Get the refresh button
    
    // Flag click handler
    flagLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent the default link behavior

            // Get the country ID from the clicked link
            const countryID = event.target.closest("a").id;
            console.log("Selected Country ID:", countryID);
            
            if (countryID) {
                // Store the selected country ID in the refresh button's id
                refreshButton.id = countryID;
                fetchFinancialDetails(countryID);
            }
        });
    });

    // Refresh button click handler
    refreshButton.addEventListener("click", () => {
        const countryID = refreshButton.id; // Get the country ID stored in the refresh button
        if (countryID) {
            console.log("Refreshing country details for ID:", countryID);
            fetchFinancialDetails(countryID); // Trigger the fetch request using the stored countryID
        }
    });
});

// Function to fetch country details from the backend
async function fetchFinancialDetails(countryID) {
const BASE_URL = "https://metaadata.com";  // Update with your backend URL
    try {
        // Fetch the country details from the server
        const response = await axios.get(`${BASE_URL}/api/financial/showf/${countryID}`);
        const countryDetails = response.data;
        console.log(countryDetails);
        if (countryDetails && countryDetails.country && countryDetails.country.FinancialDetails && countryDetails.country.FinancialDetails.length > 0) {
            const randomIndex = countryDetails.randomNumber - 1;
            const financialDetails = countryDetails.country.FinancialDetails[randomIndex];

            // Populate the table with the fetched data
            document.getElementById("CreditCardType").innerText = financialDetails.CreditCardType;
            document.getElementById("CreditCardNumber").innerText = financialDetails.CreditCardNumber;
            document.getElementById("CreditCardExpiry").innerText = financialDetails.CreditCardExpiry;
            document.getElementById("CreditCardCVV2").innerText = financialDetails.CreditCardCVV2;
            
            // Add copy icons after data is loaded
            if (typeof addCopyIconsToTables === 'function') {
                console.log("Adding copy icons after financial details loaded");
                setTimeout(addCopyIconsToTables, 100);
            }
        } else {
            console.error("No Financial Details details found.");
            alert("No Financial Details available for this country.");
        }
    } catch (error) {
        console.error("Error fetching country details:", error);
        alert("Failed to fetch country details. Please try again.");
    }
}
