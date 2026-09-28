const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const statusMsg = document.getElementById("statusMsg");
const currentCard = document.getElementById("currentCard");
const cityNameEl = document.getElementById("cityName");
const tempEl = document.getElementById("temp");
const windEl = document.getElementById("wind");
const conditionEl = document.getElementById("condition");
const forecastBody = document.getElementById("forecastBody");

// ============================================================
// TASK 1 — WEATHER CODE DESCRIPTION
// ============================================================

// TODO:
// Complete this function to convert an Open-Meteo WMO weather
// code into a human-readable weather description.
//
// Required mappings:
//
// 0                → "Clear sky"
// 1 to 3           → "Partly cloudy"
// 45 or 48         → "Fog"
// 51 to 57         → "Drizzle"
// 61 to 67         → "Rain"
// 71 to 77         → "Snow"
// 80 to 82         → "Rain showers"
// 95 to 99         → "Thunderstorm"
// Any other code   → "Unknown"
//
// Return the appropriate description.

function describeWeatherCode(code) {
  if (code === 0) {
    return "Clear sky";
  }

  if (code >= 1 && code <= 3) {
    return "Partly cloudy";
  }

  if (code === 45 || code === 48) {
    return "Fog";
  }

  if (code >= 51 && code <= 57) {
    return "Drizzle";
  }

  if (code >= 61 && code <= 67) {
    return "Rain";
  }

  if (code >= 71 && code <= 77) {
    return "Snow";
  }

  if (code >= 80 && code <= 82) {
    return "Rain showers";
  }

  if (code >= 95 && code <= 99) {
    return "Thunderstorm";
  }

  return "Unknown";
}

// ============================================================
// TASK 2 — STATUS MESSAGE
// ============================================================

// TODO:
// Complete this function.
//
// The function should:
// 1. Display the supplied message inside the element
//    represented by statusMsg.
// 2. Add the "error" class when isError is true.
// 3. Remove the "error" class when isError is false.
//

function setStatus(message, isError = false) {
  statusMsg.textContent = message;

  if (isError) {
    statusMsg.classList.add("error");
  } else {
    statusMsg.classList.remove("error");
  }
}

// ============================================================
// API FUNCTION 1 — GEOCODING
// ============================================================

// This function is provided.
// DO NOT MODIFY the API URL or the fetch logic.
//
// It converts a city name into latitude and longitude.

async function geocodeCity(city) {
const url =
`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;

const res = await fetch(url);

if (!res.ok) {
throw new Error("Geocoding request failed");
}

const data = await res.json();

if (!data.results || data.results.length === 0) {
throw new Error("City not found — try another name.");
}

return data.results[0];
}

// ============================================================
// API FUNCTION 2 — WEATHER FORECAST
// ============================================================

// This function is provided.
// DO NOT MODIFY the API URL or fetch logic.
//
// It retrieves:
// - Current weather
// - Daily weather code
// - Maximum temperature
// - Minimum temperature
// - Precipitation
//
// The API uses the coordinates obtained from geocodeCity().

async function fetchForecast(lat, lon) {
const url =
`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
`&current_weather=true` +
`&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum` +
`&timezone=auto`;

const res = await fetch(url);

if (!res.ok) {
throw new Error("Forecast request failed");
}

return res.json();
}

// ============================================================
// TASK 3 — DISPLAY CURRENT WEATHER
// ============================================================

// TODO:
// Complete this function to display the current weather.
//
// Requirements:
//
// 1. Get the current weather object from:
//      weatherData.current_weather
//
// 2. Display the city name and country in cityNameEl.
//    Example:
//      Colombo, Sri Lanka
//
// 3. Display the temperature in tempEl.
//    Format:
//      30 °C
//
// 4. Display the wind speed in windEl.
//    Format:
//      12 km/h
//
// 5. Convert the weather code into a description using
//    describeWeatherCode() and display it in conditionEl.
//
// 6. Remove the "hidden" class from currentCard so that
//    the current weather section becomes visible.
//

function renderCurrentWeather(place, weatherData) {

  const current = weatherData.current_weather;

  cityNameEl.textContent =
    `${place.name}, ${place.country}`;

  tempEl.textContent =
    `${current.temperature} °C`;

  windEl.textContent =
    `${current.windspeed} km/h`;

  conditionEl.textContent =
    describeWeatherCode(current.weathercode);

  currentCard.classList.remove("hidden");

}

// ============================================================
// TASK 4 — CREATE THE FORECAST TABLE
// ============================================================

// TODO:
// Complete this function to display the 5-day forecast.
//
// Requirements:
//
// 1. Clear any existing rows from forecastBody.
//
// 2. Loop through daily.time.
//
// 3. For each day:
//    - Create a <tr> element.
//    - Create/display the date.
//    - Display the weather condition.
//    - Display maximum temperature.
//    - Display minimum temperature.
//    - Display precipitation.
//
// 4. Use describeWeatherCode() to convert the weather code
//    into a readable condition.
//
// 5. Add the completed row to forecastBody.
//
// Hint:
//
// You can use:
//   document.createElement("tr")
//   row.innerHTML
//   forecastBody.appendChild(row)
//
// Data available:
//
//   daily.time
//   daily.weathercode
//   daily.temperature_2m_max
//   daily.temperature_2m_min
//   daily.precipitation_sum
//

function renderForecastTable(daily) {

  forecastBody.innerHTML = "";

  for (let i = 0; i < daily.time.length; i++) {

    const row = document.createElement("tr");

    
if (daily.precipitation_sum[i] > 0) {
  row.classList.add("rainy");
}

    row.innerHTML = `
      <td>${daily.time[i]}</td>
      <td>${describeWeatherCode(daily.weathercode[i])}</td>
      <td>${daily.temperature_2m_max[i]} °C</td>
      <td>${daily.temperature_2m_min[i]} °C</td>
      <td>${daily.precipitation_sum[i]} mm</td>
    `;

    forecastBody.appendChild(row);

  }

}

// ============================================================
// TASK 5 — HANDLE SEARCH
// ============================================================

// TODO:
// Complete the search function.
//
// Requirements:
//
// 1. Get the value entered into cityInput.
//
// 2. Remove unnecessary spaces using trim().
//
// 3. If the input is empty:
//    - Display "Please type a city name."
//    - Display it as an error.
//    - Stop the function using return.
//
// 4. Hide the current weather card before a new search.
//
// 5. Clear the existing forecast table.
//
// 6. Display "Loading…" while the API requests are running.
//
// 7. Use geocodeCity(city) to obtain the location.
//
// 8. Use fetchForecast(latitude, longitude) to obtain
//    weather information.
//
// 9. Call renderCurrentWeather() to display the current weather.
//
// 10. Call renderForecastTable() to display the forecast.
//
// 11. Clear the status message after a successful search.
//
// 12. Use try/catch to handle errors.
//
// 13. If an error occurs, display the error message using
//     setStatus().
//
//

async function handleSearch() {

  // 1 & 2. Read the city and remove extra spaces
  const city = cityInput.value.trim();

  // 3. Check for empty input
  if (city === "") {
    setStatus("Please type a city name.", true);
    return;
  }

  // 4. Hide the previous weather card
  currentCard.classList.add("hidden");

  // 5. Clear the previous forecast table
  forecastBody.innerHTML = "";

  // 6. Display loading message
  setStatus("Loading…");

  try {

    // 7. Get the city's coordinates
    const place = await geocodeCity(city);

    // 8. Fetch the weather data
    const weatherData = await fetchForecast(
      place.latitude,
      place.longitude
    );

    // 9. Display current weather
    renderCurrentWeather(place, weatherData);

    // 10. Display the forecast table
    renderForecastTable(weatherData.daily);

    // 11. Clear the loading message
    setStatus("");

  } catch (error) {

    // 12 & 13. Handle and display errors
    setStatus(error.message, true);

  }

}

// ============================================================
// TASK 6 — SEARCH BUTTON EVENT
// ============================================================

// TODO:
// Add an event listener to searchBtn.
//
// When the button is clicked, handleSearch() should execute.
//
// Hint:
//   addEventListener("click", ...)

searchBtn.addEventListener("click", function () {
  handleSearch();
});

// ============================================================
// TASK 7 — ENTER KEY SUPPORT
// ============================================================

// TODO:
// Add a keydown event listener to cityInput.
//
// When the user presses the Enter key,
// handleSearch() should execute.
//
// Hint:
//   e.key === "Enter"

cityInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    handleSearch();
  }
});

// ============================================================
// STRETCH GOAL — HIGHLIGHT RAINY DAYS
// ============================================================

// Optional:
//
// If the precipitation value for a day is greater than 0,
// add the CSS class "rainy" to that table row.
//
// Hint:
//   row.classList.add("rainy");
//
// This feature is optional and can be attempted after
// completing Tasks 1–7.

