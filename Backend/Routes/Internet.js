const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

router.get('/showi/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Get the count of PersonalDetails for the given CountryID
    const random = await prisma.internetDetails.count({
      where: { CountryID: parseInt(id) },
    });

    // Generate a random number between 1 and the count of PersonalDetails
    const randomNumber = Math.floor(Math.random() * random) + 1;

    // Fetch the country details along with PersonalDetails
    const country = await prisma.countries.findUnique({
      where: { CountryID: parseInt(id) },
      include: {
        InternetDetails: true,
      },
    });

    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }

    res.json({
      country,
      randomNumber,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch country' });
  }
});


module.exports = router; 
