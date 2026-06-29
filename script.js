const API_KEY = "cf33962732f84e44976112424262806"; 

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Map weather codes to emojis
function getIcon(code, isDay) {
  const c = String(code);
  if (c === "1000") return isDay ? "☀️" : "🌙";
  if (c === "1003") return "⛅";
  if (["1006", "1009"].includes(c)) return "☁️";
  if (c.startsWith("11")) return "⛈️";
  if (c.startsWith("12") || c.startsWith("13")) return "🌧️";
  if (c.startsWith("22") || c.startsWith("37")) return "❄️";
  if (["1030", "1135"].includes(c)) return "🌫️";
  return "🌡️";
}

async function searchWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return;

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "<p style='color:white; text-align:center;'>Loading...</p>";

  try {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=5`;
    const res = await fetch(url);

    if (!res.ok) throw new Error("City not found");

    const data = await res.json();
    displayWeather(data);

  } catch (err) {
    resultDiv.innerHTML = `<div class="error">❌ ${err.message}. Please try again.</div>`;
  }
}

function displayWeather(data) {
  const cur = data.current;
  const loc = data.location;
  const fore = data.forecast.forecastday;

  // Build forecast cards
  const forecastHTML = fore.map(day => {
    const d = new Date(day.date);
    return `
      <div class="f-card">
        <div class="f-day">${days[d.getUTCDay()]}</div>
        <div class="f-icon">${getIcon(day.day.condition.code, 1)}</div>
        <div class="f-hi">${Math.round(day.day.maxtemp_c)}°</div>
        <div class="f-lo">${Math.round(day.day.mintemp_c)}°</div>
      </div>
    `;
  }).join("");

  document.getElementById("result").innerHTML = `
    <div class="card">
      <div class="city-name">${loc.name}</div>
      <div class="country">${loc.region ? loc.region + ", " : ""}${loc.country}</div>
      <div class="temp-row">
        <div class="weather-icon">${getIcon(cur.condition.code, cur.is_day)}</div>
        <div>
          <div class="temp">${Math.round(cur.temp_c)}°C</div>
          <div class="description">${cur.condition.text}</div>
        </div>
      </div>
      <div class="stats">
        <div class="stat">
          <div class="stat-val">${cur.humidity}%</div>
          <div class="stat-label">Humidity</div>
        </div>
        <div class="stat">
          <div class="stat-val">${Math.round(cur.wind_kph)} km/h</div>
          <div class="stat-label">Wind</div>
        </div>
        <div class="stat">
          <div class="stat-val">${cur.uv}</div>
          <div class="stat-label">UV Index</div>
        </div>
      </div>
    </div>

    <div class="card">
      <p style="margin-bottom: 12px; font-size: 14px; opacity: 0.75;">5-Day Forecast</p>
      <div class="forecast">${forecastHTML}</div>
    </div>
  `;
}

// Allow pressing Enter to search
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("cityInput").addEventListener("keydown", e => {
    if (e.key === "Enter") searchWeather();
  });
});