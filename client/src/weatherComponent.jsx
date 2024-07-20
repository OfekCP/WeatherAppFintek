import React, { useState } from 'react';
import axios from 'axios';
import './weatherComponent.css';
import { ReactSVG } from 'react-svg';

const WeatherComponent = () => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);

    const fetchWeather = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/weather?city=${city}`);
            console.log('API Response:', response.data);
            setWeather(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            setError('Failed to fetch weather data. Please try again.');
        }
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);

        const localDateString = date.toLocaleDateString('en-GB');
        const localTimeString = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        
        return `${localDateString} at ${localTimeString}`;
    };

    const getCurrentDateTime = () => {
        const now = new Date();

        const dateString = now.toLocaleDateString('en-GB');
        const timeString = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

        return `${dateString} at ${timeString}`;
    };

    return (
        <div className='page-container'>
            <ReactSVG src='/logo.svg' className='logo'/>
            <div className={`search-container ${weather ? 'search-active' : ''}`}>
                <p className='paragraph'>Use our weather app to see the weather around the world</p>
                <div className='input-container'>
                    <label className='city-label' htmlFor='city-input'>City name</label>
                    <input
                        type="text"
                        id='city-input'
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className='city-input'
                    />
                    <button onClick={fetchWeather} className='fetch-button'>Check</button>
                </div>
            </div>
            {error && <p className='error-message'>{error}</p>}
            {weather && (
                <div className='background'>
                <div className='weather-info'>
                    <div className='weather-card'>
                        <h2 className='city'>{weather.city}</h2>
                        <p className='country'>{weather.country}</p>
                        <p className='time'>{formatDateTime(weather.date)}</p>

                        {weather.current ? (
                            <>
                                <h1 className='temp'>{weather.current.temp_c.toFixed(0)}°</h1>
                                <p className='condition'>{weather.current.condition}</p>
                                <div className='weather-details'>
                                    <div>
                                        <p className='info'>Precipitation</p>
                                        <p className='infoDetails'>{weather.current.precipitation} mm</p>
                                    </div>
                                    <div>
                                        <p className='info'>Humidity</p>
                                        <p className='infoDetails'>{weather.current.humidity}%</p>
                                    </div>
                                    <div>
                                        <p className='info'>Wind</p>
                                        <p className='infoDetails'>{weather.current.wind_kph.toFixed(0)} km/h</p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p>Current weather data not available</p>
                        )}

                        {weather.next5Hours && weather.next5Hours.length > 0 ? (
                            <div className='hourly-forecast'>
                                {weather.next5Hours.map((hour, index) => (
                                    <div key={index}>
                                        <p className='nextTime'>{new Date(hour.time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
                                        <p className='nextTimeInfo'>{hour.temp_c.toFixed(0)}°</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>Hourly forecast data not available</p>
                        )}
                    </div>
                </div>
                </div>
            )}
            {weather && (
                <div className='coordinates'>
                    <span>Latitude: {weather.latitude}</span>
                    <span>Longitude: {weather.longitude}</span>
                    <p>Accurate to {getCurrentDateTime()}</p>
                </div>
            )}
        </div>
    );
};

export default WeatherComponent;
