document.addEventListener("DOMContentLoaded", () => {
    const flagLinks = document.querySelectorAll(".flag-item a");
    const refreshButton = document.querySelector(".rb5"); // Get the refresh button
    
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
                fetchEmploymentDetails(countryID);
            }
        });
    });

    // Refresh button click handler
    refreshButton.addEventListener("click", () => {
        const countryID = refreshButton.id; // Get the country ID stored in the refresh button
        if (countryID) {
            console.log("Refreshing country details for ID:", countryID);
            fetchEmploymentDetails(countryID); // Trigger the fetch request using the stored countryID
        }
    });
});

// Function to fetch country details from the backend
async function fetchEmploymentDetails(countryID) {
const BASE_URL = "https://metaadata.com";  // Update with your backend URL
    try {
        // Fetch the country details from the server
        const response = await axios.get(`${BASE_URL}/api/employment/showe/${countryID}`);
        const countryDetails = response.data;
        console.log(countryDetails);
        if (countryDetails && countryDetails.country && countryDetails.country.EmploymentDetails && countryDetails.country.EmploymentDetails.length > 0) {
            const randomIndex = countryDetails.randomNumber - 1;
            const EmploymentDetails = countryDetails.country.EmploymentDetails[randomIndex];

            document.getElementById("CompanyName").innerText = EmploymentDetails.CompanyName;
            document.getElementById("Salary").innerText = EmploymentDetails.Salary;
            document.getElementById("CompanyAddress").innerText = EmploymentDetails.CompanyAddress;
            document.getElementById("JobTitle").innerText = EmploymentDetails.JobTitle;
            document.getElementById("CompanyPhone").innerText = EmploymentDetails.CompanyPhone;
            document.getElementById("CompanyEmail").innerText = EmploymentDetails.CompanyEmail;

        } else {
            console.error("No Financial Details details found.");
            alert("No Employment Details available for this country.");
        }
    } catch (error) {
        console.error("Error fetching country details:", error);
        alert("Failed to fetch country details. Please try again.");
    }
}
