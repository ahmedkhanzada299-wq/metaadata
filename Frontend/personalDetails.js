document.addEventListener("DOMContentLoaded", () => {
    const flagLinks = document.querySelectorAll(".flag-item a");
    const refreshButton = document.querySelector(".rb1"); // Get the refresh button
    
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
                fetchCountryDetails(countryID); // Fetch the details of the country
            }
        });
    });

    // Refresh button click handler
    refreshButton.addEventListener("click", () => {
        const countryID = refreshButton.id; // Get the country ID stored in the refresh button
        if (countryID) {
            console.log("Refreshing country details for ID:", countryID);
            fetchCountryDetails(countryID); // Trigger the fetch request using the stored countryID
        }
    });
});

// Function to fetch country details from the backend
async function fetchCountryDetails(countryID) {
const BASE_URL = "https://metaadata.com";  // Update with your backend URL

    try {
        // Fetch the country details from the server
        const response = await axios.get(`${BASE_URL}/api/personal/showp/${countryID}`);
        const countryDetails = response.data;
        console.log(countryDetails);
        if (countryDetails && countryDetails.country && countryDetails.country.PersonalDetails && countryDetails.country.PersonalDetails.length > 0) {
            const randomIndex = countryDetails.randomNumber - 1;
            const personalDetails = countryDetails.country.PersonalDetails[randomIndex];

            // Populate the table with the fetched data
            document.getElementById("country").innerText = countryDetails.country.CountryName;
            document.getElementById("name").innerText = personalDetails.Name;
            document.getElementById("address").innerText = personalDetails.Address;
            document.getElementById("postcode").innerText = personalDetails.Postcode;
            document.getElementById("city").innerText = personalDetails.City;
            document.getElementById("dob").innerText = personalDetails.DateOfBirth;
            document.getElementById("gender").innerText = personalDetails.Gender;
            document.getElementById("phone").innerText = personalDetails.Phone;
            document.getElementById("motherMaidenName").innerText = personalDetails.MothersMaidenName;
            document.getElementById("email").innerHTML = `<a href="mailto:${personalDetails.Email}">${personalDetails.Email}</a>`;
            document.getElementById("ethnicity").innerText = personalDetails.Ethnicity;
            document.getElementById("zodiacSign").innerText = personalDetails.ZodiacSign;
            document.getElementById("age").innerText = personalDetails.Age;
            document.getElementById("height").innerText = personalDetails.Height;
            document.getElementById("weight").innerText = personalDetails.Weight;
            document.getElementById("eyeColor").innerText = personalDetails.EyeColor;
            document.getElementById("hairColor").innerText = personalDetails.HairColor;
            
            // Add copy buttons after data is loaded
            if (typeof addCopyIconsToTables === 'function') {
                console.log("Adding copy icons after personal details loaded");
                setTimeout(addCopyIconsToTables, 100);
            }
        } else {
            console.error("No personal details found.");
            alert("No personal details available for this country.");
        }
    } catch (error) {
        console.error("Error fetching country details:", error);
        alert("Failed to fetch country details. Please try again.");
    }
}
