const { PrismaClient } = require("@prisma/client");
const { initializeCountries } = require("./Routes/initializeCountries");

const prisma = new PrismaClient();

async function setup() {
  try {
    console.log("Starting database setup...");
    
    // Initialize countries
    await initializeCountries();
    
    console.log("Database setup completed successfully!");
  } catch (error) {
    console.error("Error setting up database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

setup(); 