document.addEventListener("DOMContentLoaded", () => {
    const flagLinks = document.querySelectorAll(".flag-item a");
    const refreshButton = document.querySelector(".rb6"); // Get the refresh button
    
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
                fetchVehicleDetails(countryID);
            }
        });
    });

    // Refresh button click handler
    refreshButton.addEventListener("click", () => {
        const countryID = refreshButton.id; // Get the country ID stored in the refresh button
        if (countryID) {
            console.log("Refreshing country details for ID:", countryID);
            fetchVehicleDetails(countryID); // Trigger the fetch request using the stored countryID
        }
    });
});

// Function to fetch country details from the backend
async function fetchVehicleDetails(countryID) {
const BASE_URL = "https://metaadata.com";  // Update with your backend URL
    try {
        // Fetch the country details from the server
        const response = await axios.get(`${BASE_URL}/api/vehicle/showv/${countryID}`);
        const countryDetails = response.data;
        console.log(countryDetails);
        if (countryDetails && countryDetails.country && countryDetails.country.VehicleDetails && countryDetails.country.VehicleDetails.length > 0) {
            const randomIndex = countryDetails.randomNumber - 1;
            const VehicleDetails = countryDetails.country.VehicleDetails[randomIndex];

            document.getElementById("VehicleName").innerText = VehicleDetails.VehicleName;
            document.getElementById("LicensePlate").innerText = VehicleDetails.LicensePlate;
            document.getElementById("VIN").innerText = VehicleDetails.VIN;
            document.getElementById("Color").innerText = VehicleDetails.Color;
            
           

        } else {
            console.error("No Financial Details details found.");
            alert("No Employment Details available for this country.");
        }
    } catch (error) {
        console.error("Error fetching country details:", error);
        alert("Failed to fetch country details. Please try again.");
    }
}
