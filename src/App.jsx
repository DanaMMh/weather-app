import { useState, useEffect } from 'react';
import axios from 'axios';

const defaultCity = 'New York';

function App() {
  const [city, setCity] = useState(defaultCity);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

  const fetchWeather = async (cityName) => {
    if (!cityName.trim()) {
      setError('Please enter a city name.');
      return;
    }

    if (!apiKey) {
      setError('Missing OpenWeatherMap API key. Add VITE_OPENWEATHER_API_KEY to your .env file.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`
      );

      setWeather(response.data);
    } catch (err) {
      setError('City not found or API request failed.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(defaultCity);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchWeather(city);
  };

  return (
    <div className="app-shell">
      <div className="weather-card">
        <h1>Weather App</h1>

        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="Search city"
            aria-label="City name"
          />
          <button type="submit">Search</button>
        </form>

        {loading && <p className="status">Loading weather...</p>}
        {error && <p className="error">{error}</p>}

        {weather && (
          <div className="weather-info">
            <div className="city-row">
              <h2>{weather.name}</h2>
              <span>{weather.sys.country}</span>
            </div>

            <div className="temp-row">
              <div>
                <p className="temperature">{Math.round(weather.main.temp)}°C</p>
                <p className="condition">{weather.weather[0].description}</p>
              </div>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
              />
            </div>

            <div className="stats-grid">
              <div className="stat-box">
                <span>Humidity</span>
                <strong>{weather.main.humidity}%</strong>
              </div>
              <div className="stat-box">
                <span>Wind</span>
                <strong>{weather.wind.speed} m/s</strong>
              </div>
              <div className="stat-box">
                <span>Feels like</span>
                <strong>{Math.round(weather.main.feels_like)}°C</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
