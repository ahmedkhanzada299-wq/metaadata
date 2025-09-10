const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// Define your route
router.get('/showp/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Get the count of PersonalDetails for the given CountryID
    const random = await prisma.personalDetails.count({
      where: { CountryID: parseInt(id) },
    });

    // Generate a random number between 1 and the count of PersonalDetails
    const randomNumber = Math.floor(Math.random() * random) + 1;

    // Fetch the country details along with PersonalDetails
    const country = await prisma.countries.findUnique({
      where: { CountryID: parseInt(id) },
      include: {
        PersonalDetails: true,
      },
    });

    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }

    // Send both country details and random number in a single response
    res.json({
      country,
      randomNumber,  // Include randomNumber in the response
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch country' });
  }
});


module.exports = router; // Export the router correctly
