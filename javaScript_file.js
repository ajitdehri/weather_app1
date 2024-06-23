


const search_input = document.getElementById("search_input");
const search_btn = document.getElementById("search_btn1");
const location_button = document.getElementById("location-btn");
const currentWeather = document.querySelector(".current-weather");
const weather_cards_top_value = document.querySelector(".weather-card");



const API_KEY = "e660f03e59f93af65512a1fb37c8cdd0"; //API KEY


const ceateWeatherCard = (cityName, weatherItem, index) => {
    if (index === 0) {
        // this html wheather code for first day card
        return `<div class="details">
        <h2>${cityName} : ${weatherItem.dt_txt.split(" ")[0]}</h2>
        <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)} .C</h4>
        <h4>Wind: ${weatherItem.wind.speed}</h4>
        <h4>Humidity: ${weatherItem.main.humidity} %</h4>
    </div>

    <div class="icon">
    
        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather image">
        <h4>${weatherItem.weather[0].description}</h4>
    </div>`;

    }
    else {
        // remaining day wheather code 
        return `<li class="card-data">
    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather image">
    <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)} .C</h4>
    <h4>Wind: ${weatherItem.wind.speed}</h4>
    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
    </li>`;

    }

};


const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast/?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {

        const uniqeForecastDays = [];

        // filter the forecasts to get only one forecast per day
        const fiveDaysForecaste = data.list.filter(forecaste => {
            const forecastDate = new Date(forecaste.dt_txt).getDate();
            if (!uniqeForecastDays.includes(forecastDate)) {
                return uniqeForecastDays.push(forecastDate);
            }

        });

        // remove previos weather data value

        search_input.value = "";
        currentWeather.innerHTML = "";
        weather_cards_top_value.innerHTML = "";



        // remaining  5 days  creating weather cards 
        fiveDaysForecaste.forEach((weatherItem, index) => {
            if (index === 0) {

                currentWeather.insertAdjacentHTML("beforeend", ceateWeatherCard(cityName, weatherItem, index));
            } else {
                weather_cards_top_value.insertAdjacentHTML("beforeend", ceateWeatherCard(cityName, weatherItem, index));

            }

        });

    }).catch(() => {
        alert("error fetchin foreCaste......");
    });

}


const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        postion => {
            console.log(postion);
            const { latitude, longitude } = postion.coords;
            const REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;

            // Get city name from coordinates usin revrse geocoding API
            fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
                const { name } = data[0];
                getWeatherDetails(name, latitude, longitude);

            }).catch(() => {
                alert("error.....");
            });
        },
        error => {
            if (error.code === error.PERMISSION_DENIED) {
                alert("reuest denied...please reset location permission to grant access again..");
            }

        }
    );
}

const getcityValue = () => {
    const cityName = search_input.value.trim();
    if (!cityName) return;


    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;


    // get entered city coorinates(latitude,longitude,and name) form the api response
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        if (!data.length) return alert(`No coorinates found for ${cityName}`);
        const { name, lat, lon } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("error...");
    });

}

// color change function for search button
function btnColor() {
    document.getElementById("search_btn1").setAttribute("style", "background-color: coral");
}

// color change function for current location
function currentLocation(){
    document.getElementById("location-btn").setAttribute("style", "background-color: coral");

}


// eventlistener
location_button.addEventListener("click", getUserCoordinates);
search_btn.addEventListener("click", getcityValue);





