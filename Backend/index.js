const express = require("express");
const cors = require("cors");
const path = require("path");
const { initializeCountries } = require("./Routes/initializeCountries.js");

const app = express();

app.use(express.json());
app.use(cors());

// Serve Frontend folder as static
// app.use(express.static(path.join(__dirname, "../Frontend")));

// app.get("/index.html", (req, res) => {
//   res.redirect(301, "/");
// });

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "../Frontend/index.html"));
// });


app.use("/api/personal", require("./Routes/personal.js"));
app.use("/api/financial", require("./Routes/financial.js"));
app.use("/api/employment", require("./Routes/Employment.js"));
app.use("/api/internet", require("./Routes/Internet.js"));
app.use("/api/education", require("./Routes/Education.js"));
app.use("/api/vehicle", require("./Routes/vehicle.js"));
app.use("/api/contact", require("./Routes/contact.js"));
app.use("/api/generator", require("./Routes/dataGenerator.js"));


// ✅ Start HTTP server (Nginx will handle HTTPS)
const PORT = 3000;

initializeCountries().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
