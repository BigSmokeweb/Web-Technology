// ⚠️ Replace with your OpenWeatherMap API key from https://openweathermap.org/api
const API_KEY = 'YOUR_API_KEY_HERE';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

const popularCities = ['Mumbai', 'Delhi', 'Bangalore', 'London', 'New York', 'Tokyo', 'Paris', 'Dubai', 'Sydney'];

const weatherIcons = {
    'Clear': '☀️', 'Clouds': '☁️', 'Rain': '🌧️', 'Drizzle': '🌦️',
    'Thunderstorm': '⛈️', 'Snow': '❄️', 'Mist': '🌫️',
    'Fog': '🌫️', 'Haze': '🌁', 'Smoke': '💨', 'Dust': '🌪️'
};

document.getElementById('cityInput').addEventListener('keyup', function (e) {
    if (e.key === 'Enter') fetchWeather();
    else showSuggestions(this.value);
});

function showSuggestions(query) {
    const box = document.getElementById('suggestions');
    if (!query || query.length < 2) { box.innerHTML = ''; return; }
    const matches = popularCities.filter(c => c.toLowerCase().startsWith(query.toLowerCase()));
    box.innerHTML = matches.map(c => `<div class="sug-item" onclick="quickSearch('${c}')">${c}</div>`).join('');
}

function quickSearch(city) {
    document.getElementById('cityInput').value = city;
    document.getElementById('suggestions').innerHTML = '';
    fetchWeather();
}

function fetchWeather() {
    const city = document.getElementById('cityInput').value.trim();
    if (!city) return;
    document.getElementById('suggestions').innerHTML = '';
    showLoader(true);
    hideAll();

    // AJAX using XMLHttpRequest
    const xhr = new XMLHttpRequest();
    const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;
        showLoader(false);
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            displayWeather(data);
        } else if (xhr.status === 404) {
            showError('🔍 City not found. Please check the spelling and try again.');
        } else if (xhr.status === 401) {
            showError('🔑 Invalid API key. Please update your API key in script.js');
        } else {
            showError('⚠️ Something went wrong. Please try again later.');
        }
    };
    xhr.send();
}

function displayWeather(data) {
    const icon = weatherIcons[data.weather[0].main] || '🌡️';
    const date = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    document.getElementById('wcCity').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('wcDate').textContent = date;
    document.getElementById('wcCondition').textContent = data.weather[0].description;
    document.getElementById('wcIcon').textContent = icon;
    document.getElementById('wcTemp').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('wcHumidity').textContent = `${data.main.humidity}%`;
    document.getElementById('wcWind').textContent = `${(data.wind.speed * 3.6).toFixed(1)} km/h`;
    document.getElementById('wcVisibility').textContent = `${(data.visibility / 1000).toFixed(1)} km`;
    document.getElementById('wcFeelsLike').textContent = `${Math.round(data.main.feels_like)}°C`;
    document.getElementById('wcPressure').textContent = `${data.main.pressure} hPa`;
    document.getElementById('wcCloud').textContent = `${data.clouds.all}%`;

    document.getElementById('weatherCard').classList.remove('hidden');
}

function showLoader(show) {
    document.getElementById('loader').classList.toggle('hidden', !show);
}

function showError(msg) {
    const el = document.getElementById('errorBox');
    el.textContent = msg;
    el.classList.remove('hidden');
}

function hideAll() {
    document.getElementById('weatherCard').classList.add('hidden');
    document.getElementById('errorBox').classList.add('hidden');
}
