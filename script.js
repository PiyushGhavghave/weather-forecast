feather.replace();

const api_key = "482425fc4bbe5b6c9d1bebc271612d36"

const wheather_api = "https://api.openweathermap.org/data/2.5/weather?units=metric"
const forecast_api = "https://api.openweathermap.org/data/2.5/forecast?units=metric"


const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const loadingElement = document.querySelector(".loading");
const weatherInfo = document.querySelector(".weather-info");
const forecastElement = document.querySelector(".forecast");


function updateWeather(data){
    document.querySelector('.city-name').textContent = data.name;
    document.querySelector('.date').textContent = new Date().toLocaleDateString(
      "en-US",
      { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    );

    document.querySelector(".temperature").textContent = `${Math.round(
      data.main.temp
    )}°C`;
    document.querySelector(".description").textContent = data.weather[0].description;
    document.querySelector('.humidity-value').textContent = `${data.main.humidity}%`;
    document.querySelector('.wind-value').textContent = `${Math.round(data.wind.speed)} m/s`;
    document.querySelector('.pressure-value').textContent = `${data.main.pressure} hPa`;

    document.getElementById("weather-icon").src = 
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png` || "/api/placeholder/100/100";
} 



function updateForecast(data){
  const forecastItems = document.querySelectorAll(".forecast-item");
  data.forEach( (day , index) => {
    const item = forecastItems[index];
    item.querySelector(".forecast-day").textContent = new Date(
      day.dt * 1000
    ).toLocaleDateString("en-US", { weekday: "short" });

    item.querySelector("img").src = 
    `https://openweathermap.org/img/wn/${day.weather[0].icon}.png` || "/api/placeholder/50/50";

    item.querySelector(".forecast-temp").textContent = `${Math.round(day.main.temp)}°C`;

  })
}


async function fetchWeatherData(city){
    const wheather_url = `${wheather_api}&appid=${api_key}&q=${city}`
    const forecast_url = `${forecast_api}&appid=${api_key}&q=${city}`

    loadingElement.style.display = "block";
    weatherInfo.style.display = "none";
    forecastElement.style.display = "none";
    

    const timeoutId = setTimeout(() => {
      loadingElement.textContent = "Taking too much time... Please try again.";
    }, 5000);

    try{
        const [wheatherResponse, forecastResponse] = await Promise.all([
          fetch(wheather_url),
          fetch(forecast_url)
        ])

        clearTimeout(timeoutId);

        const wheather = await wheatherResponse.json();
        const forecast = await forecastResponse.json();
        
        if(wheather.cod === '404' || forecast === '404'){
          throw new Error('City not found... Please try again')
        }
        console.log(wheather)
        console.log(forecast)

        updateWeather(wheather);
        updateForecast(forecast.list.filter((item,index) => index % 8 === 0 ))

        loadingElement.style.display = "none";
        weatherInfo.style.display = "block";
        forecastElement.style.display = "flex";
    }
    catch(error){
        console.log(error);
        loadingElement.textContent = "Error fetching weather data. Please try again.";
    }
}

cityInput.addEventListener('keyup', (e) => {
    if(e.key == 'Enter'){
        let city = cityInput.value.trim();
        if(city){
            fetchWeatherData(city);
        }
    }
})

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeatherData(city);
  }
});

