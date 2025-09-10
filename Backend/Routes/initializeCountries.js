const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// List of all countries
const countries = [
  { CountryID: 1, CountryName: "Argentina" },
  { CountryID: 2, CountryName: "Australia" },
  { CountryID: 3, CountryName: "Bangladesh" },
  { CountryID: 4, CountryName: "Brazil" },
  { CountryID: 5, CountryName: "Canada" },
  { CountryID: 6, CountryName: "China" },
  { CountryID: 7, CountryName: "Egypt" },
  { CountryID: 8, CountryName: "France" },
  { CountryID: 9, CountryName: "Germany" },
  { CountryID: 10, CountryName: "India" },
  { CountryID: 11, CountryName: "Italy" },
  { CountryID: 12, CountryName: "Japan" },
  { CountryID: 13, CountryName: "South Korea" },
  { CountryID: 14, CountryName: "Mexico" },
  { CountryID: 15, CountryName: "Nigeria" },
  { CountryID: 16, CountryName: "Russia" },
  { CountryID: 17, CountryName: "Saudi Arabia" },
  { CountryID: 18, CountryName: "United Kingdom" },
  { CountryID: 19, CountryName: "United States" },
  { CountryID: 20, CountryName: "Vietnam" }
];

// Function to initialize countries
async function initializeCountries() {
  try {
    console.log("Starting country initialization...");
    
    // Check if countries already exist
    const countryCount = await prisma.countries.count();
    
    if (countryCount === 0) {
      console.log("No countries found. Creating countries...");
      
      // Create countries one by one to ensure IDs are set correctly
      for (const country of countries) {
        await prisma.countries.create({
          data: country
        });
        console.log(`Created country: ${country.CountryName} (ID: ${country.CountryID})`);
      }
      
      console.log("All countries created successfully!");
    } else {
      console.log(`Found ${countryCount} countries. No initialization needed.`);
    }
  } catch (error) {
    console.error("Error initializing countries:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run initialization
initializeCountries();

// Export for potential use in other files
module.exports = { initializeCountries }; 