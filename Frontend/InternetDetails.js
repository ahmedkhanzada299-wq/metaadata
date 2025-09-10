document.addEventListener("DOMContentLoaded", () => {
    const flagLinks = document.querySelectorAll(".flag-item a");
    const refreshButton = document.querySelector(".rb3"); // Get the refresh button
    
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
                fetchInternetDetails(countryID);
            }
        });
    });

    // Refresh button click handler
    refreshButton.addEventListener("click", () => {
        const countryID = refreshButton.id; // Get the country ID stored in the refresh button
        if (countryID) {
            console.log("Refreshing country details for ID:", countryID);
            fetchInternetDetails(countryID); // Trigger the fetch request using the stored countryID
        }
    });
});

// Function to fetch country details from the backend
async function fetchInternetDetails(countryID) {
const BASE_URL = "https://metaadata.com";  // Update with your backend URL
    try {
        // Fetch the country details from the server
        const response = await axios.get(`${BASE_URL}/api/internet/showi/${countryID}`);
        const countryDetails = response.data;
        console.log(countryDetails);
        if (countryDetails && countryDetails.country && countryDetails.country.InternetDetails && countryDetails.country.InternetDetails.length > 0) {
            const randomIndex = countryDetails.randomNumber - 1;
            const InternetDetails = countryDetails.country.InternetDetails[randomIndex];

            document.getElementById("UserName").innerText = InternetDetails.UserName;
            document.getElementById("Password").innerText = InternetDetails.Password;
            document.getElementById("IPv4Address").innerText = InternetDetails.IPv4Address;
            document.getElementById("IPv6Address").innerText = InternetDetails.IPv6Address;
            document.getElementById("UserAgent").innerText = InternetDetails.UserAgent;
           

        } else {
            console.error("No Financial Details details found.");
            alert("No Employment Details available for this country.");
        }
    } catch (error) {
        console.error("Error fetching country details:", error);
        alert("Failed to fetch country details. Please try again.");
    }
}
