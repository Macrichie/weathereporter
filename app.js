const API_KEY = "";

const weatherInfo = document.getElementById('weatherInfo');
const errorMessage = document.getElementById('errorMessage');
const cityInput = document.getElementById('cityInput');
const searchButton = document.getElementById('searchButton');

let refTimer;

async function getWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('First catch block');
        console.log(error);
    } finally {
        console.log('Final block');
    }
}

async function updateWeather() {
    const city = cityInput.value;
    if(!city) {
        displayError('City name cannot be empty');

        return;
    }
    
    try {
        const { name, sys, main, weather, wind, cod } = await getWeatherData(city);
        if(cod === '404') {
            displayError('Please enter a valid city name');
            return;
        }
        // Display data on screen
        weatherInfo.innerHTML = `
            <h2>${name}, ${sys.country}</h2>
            <p>Temperature: ${main.temp}</p>
            <p>Description: ${weather[0].description}</p>
            <p>Humidity: ${main.humidity}%</p>
            <p>Wind Speed: ${wind.speed} m/s</p>
        `;
        weatherInfo.classList.remove('hidden');

        clearInterval(refTimer);
        refTimer = setTimeout(updateWeather, 60000);
    } catch (error) {
        displayError('Server error: something went wrong on our end!.');
    }
}

function displayError(message) {
    errorMessage.textContent = message;
    weatherInfo.innerHTML = '';
}

searchButton.addEventListener('click', updateWeather);

cityInput.addEventListener('keypress', event => {
    if(event.key === 'Enter') {
        updateWeather();
    }
})