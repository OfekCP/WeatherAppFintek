const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());

app.get('/api/weather', async (req, res) => {
    const { city } = req.query;
    if (!city) {
        return res.status(400).json({ error: 'City is required' });
    }

    try {
        const response = await axios.get(`http://api.weatherapi.com/v1/forecast.json?key=${process.env.API_KEY}&q=${city}&days=1&aqi=no&alerts=no`);
        const data = response.data;


        if (!data.forecast || !data.forecast.forecastday || !data.forecast.forecastday[0].hour) {
            return res.status(500).json({ error: 'Forecast data is not available' });
        }

       
        const localTime = new Date(data.location.localtime);
        const localHour = localTime.getHours();

        
        let forecastHours = [];
        for (let i = 1; i <= 5; i++) {
            forecastHours.push(data.forecast.forecastday[0].hour[(localHour + i) % 24]);
        }
        console.log(forecastHours);

        const weatherInfo = {
            city: data.location.name,
            country: data.location.country,
            date: data.location.localtime,
            latitude: data.location.lat,
            longitude: data.location.lon,
            current: {
                temp_c: data.current.temp_c,
                condition: data.current.condition.text,
                precipitation: data.current.precip_mm,
                humidity: data.current.humidity,
                wind_kph: data.current.wind_kph,
            },
            next5Hours: forecastHours.map(hour => ({
                time: hour.time,
                temp_c: hour.temp_c,
            })),
        };

        res.json(weatherInfo);
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        res.status(500).json({ error: 'Error fetching weather data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
