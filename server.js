// server.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Configure cors for a specific origin
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with the actual origin of your React app
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.post('/getWeather', async (req, res) => {
  try {
    const { cities } = req.body;

    if (!cities || !Array.isArray(cities)) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    const weatherPromises = cities.map(city => getWeather(city));

    const weatherResults = await Promise.all(weatherPromises);

    const response = { weather: {} };

    cities.forEach((city, index) => {
      response.weather[city] = weatherResults[index];
    });

    res.json(response);
  } catch (error) {
    console.error('Error fetching weather:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Function to fetch weather for a city from a sample API (replace with a real API)
async function getWeather(city) {
    try {
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric`;
  
      const response = await axios.get(apiUrl);
      const temperature = response.data.main.temp;
  
      return `${temperature}°C`;
    } catch (error) {
      console.error(`Error fetching weather for ${city}:`, error);
      return 'N/A';
    }
  }

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
