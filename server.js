const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3001;

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.post("/getWeather", async (req, res) => {
  try {
    const { cities } = req.body;

    if (!cities || !Array.isArray(cities)) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const weatherPromises = cities.map((city) => getWeather(city));

    const weatherResults = await Promise.all(weatherPromises);

    const response = { weather: {} };

    cities.forEach((city, index) => {
      response.weather[city] = weatherResults[index];
    });

    res.json(response);
  } catch (error) {
    console.error("Error fetching weather:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function getWeather(city) {
  try {
    const apiUrl = `https://wttr.in/${city}?format=%t`;

    const response = await axios.get(apiUrl);

    if (response.data) {
      const temperature = response.data.trim().replace(/[^0-9+-]/g, '');
      return `${temperature}°C`;
    } else {
      return 'N/A';
    }
  } catch (error) {
    console.error(`Error fetching weather for ${city}:`, error);
    return 'N/A';
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
