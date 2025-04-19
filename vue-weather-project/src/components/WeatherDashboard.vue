<template>
  <div id="Body">
    <div id="SideBar">
      <div id="searchBar"> 
        <input 
          v-model="cityInput" 
          type="text" 
          class="form-control" 
          placeholder="Enter a city name"
          @keyup.enter="getWeather"
        >
        <button class="btn btn-primary" @click="getWeather">Get</button> 
      </div>
      <div id="sidebarSeperator">
        <div id="searchHistory">
          <!-- button placed here for layout purposes DON'T CHANGE -->
          <button class="btn btn-secondary" @click="toggleCalendar">
            {{ showCalendar ? 'Hide Calendar' : 'Select a Date for Historical Weather' }}
          </button>
          <button v-if="historicalWeather && showCalendar" class="btn" @click="clearHistoricalWeather">
            Clear Historical Weather
          </button>
          <h5 :style="{ marginTop: '10px' }">Recent Searches:</h5>
          <div class="list-group">
            <button 
              v-for="(city, index) in searchHistory" 
              :key="index"
              class="list-group-item list-group-item-action"
              @click="searchCity(city)"
            >
              {{ city[0].toUpperCase() + city.substring(1)}}
            </button>
          </div>
        </div>
        <div v-if="weatherData" id="SideBarInfo"> 
          <p id="cityName">{{ weatherData.name }}, {{ weatherData.sys.country }}</p>
          <div id="tempBox">
            <h1 id="temp">{{ weatherData ? Math.round(weatherData.main.temp) : '--' }}°C</h1>
            <p id="feelTemp"><strong>Feels Like:</strong> {{ weatherData ? Math.round(weatherData.main.feels_like) : '--' }}°C</p>
            <p><strong>Humidity:</strong> {{ weatherData.main.humidity }}%</p>
            <!--<p><strong>Wind Speed:</strong> {{ weatherData.wind.speed }} m/s</p>-->
            <p><strong>Cloud Cover:</strong> {{ weatherData.clouds.all }}%</p>
            <p v-if="weatherData.rain"><strong>Rain:</strong> {{ weatherData.rain['1h'] }} mm</p>
            <p v-if="weatherData.snow"><strong>Snow:</strong> {{ weatherData.snow['1h'] }} mm</p>
          </div>
          <div id="weatherIcon">
            <!-- Placeholder for weather icon ----------------------------------------------------------------------------- -->
            <p><img :src="weatherData ? 'https://openweathermap.org/img/wn/' + weatherData.weather[0].icon + '@2x.png' : 'assets/clear.svg'"></p>
            <p id="weatherDesc">{{ capatalizeSentence(weatherData.weather[0].description) }}</p>
          </div>
        </div>
      </div>
    </div>
    <div id="infoBox">




      <div v-show="showCalendar" id="calendarSection">
        <input id="calButton" type="date" v-model="selectedDate" @change="fetchHistoricalWeather" />
        <div v-if="historicalWeather" class="card">
          <div class="card-body">
            <h2 class="card-title">{{ weatherData.name }}, {{ weatherData.sys.country }} | {{ formattedDateText }}</h2>
            <div class="upper row">
              <div v-if="entry=filteredHistoricalWeather[0]" class="row">
                <div class="col-md-6">
                  <h3 class="temperature">{{ (entry.main.temp - 273.15).toFixed(1) }}°C</h3>
                  <p class="weather-description">{{ entry.weather[0].description }}</p>
                  <div class="weather-details">
                    <p><strong>Humidity:</strong> {{ entry.main.humidity }}%</p>
                    <p><strong>Pressure:</strong> {{ entry.main.pressure }} hPa</p>
                    <!--<p><strong>Wind Speed:</strong> {{ entry.wind.speed }} m/s</p>-->
                    <p><strong>Cloud Cover:</strong> {{ entry.clouds.all }}%</p>
                  </div>
                </div>
                <div class="col-md-6">
                  <p><strong>Time:</strong> {{ formatTime(entry.dt) }}</p>
                </div>
              </div>
              <div v-if="entry=filteredHistoricalWeather[1]" class="row">
                <div class="col-md-6">
                  <h3 class="temperature">{{ (entry.main.temp - 273.15).toFixed(1) }}°C</h3>
                  <p class="weather-description">{{ entry.weather[0].description }}</p>
                  <div class="weather-details">
                    <p><strong>Humidity:</strong> {{ entry.main.humidity }}%</p>
                    <p><strong>Pressure:</strong> {{ entry.main.pressure }} hPa</p>
                    <p><strong>Wind Speed:</strong> {{ entry.wind.speed }} m/s</p>
                    <p><strong>Cloud Cover:</strong> {{ entry.clouds.all }}%</p>
                  </div>
                </div>
                <div class="col-md-6">
                  <p><strong>Time:</strong> {{ formatTime(entry.dt) }}</p>
                </div>
              </div>
            </div>
            <div class="upper row">
              <div v-if="entry=filteredHistoricalWeather[2]" class="row">
                <div class="col-md-6">
                  <h3 class="temperature">{{ (entry.main.temp - 273.15).toFixed(1) }}°C</h3>
                  <p class="weather-description">{{ entry.weather[0].description }}</p>
                  <div class="weather-details">
                    <p><strong>Humidity:</strong> {{ entry.main.humidity }}%</p>
                    <p><strong>Pressure:</strong> {{ entry.main.pressure }} hPa</p>
                    <p><strong>Wind Speed:</strong> {{ entry.wind.speed }} m/s</p>
                    <p><strong>Cloud Cover:</strong> {{ entry.clouds.all }}%</p>
                  </div>
                </div>
                <div class="col-md-6">
                  <p><strong>Time:</strong> {{ formatTime(entry.dt) }}</p>
                </div>
              </div>
              <div v-if="entry=filteredHistoricalWeather[3]" class="row">
                <div class="col-md-6">
                  <h3 class="temperature">{{ (entry.main.temp - 273.15).toFixed(1) }}°C</h3>
                  <p class="weather-description">{{ entry.weather[0].description }}</p>
                  <div class="weather-details">
                    <p><strong>Humidity:</strong> {{ entry.main.humidity }}%</p>
                    <p><strong>Pressure:</strong> {{ entry.main.pressure }} hPa</p>
                    <p><strong>Wind Speed:</strong> {{ entry.wind.speed }} m/s</p>
                    <p><strong>Cloud Cover:</strong> {{ entry.clouds.all }}%</p>
                  </div>
                </div>
                <div class="col-md-6">
                  <p><strong>Time:</strong> {{ formatTime(entry.dt) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>







      <div v-if="!forecastData" id="noInfo">
          <h3 v-if="hasSearched">You have misspelled or our API doesn't have information on this city</h3>
          <h3 v-else>Enter a city name to see weather information</h3>
      </div>

      <div id="forcasting">
        <div 
          v-if="forecastData" 
          v-for="(day, index) in forecastData.list.slice(0, 5)" 
          :key="index" 
          class="forcastBox"
          @click="selectForecastDay(day)"
        >
          <h5 class="forcastDay">{{ formatDate(day.dt).slice(0, 3) }}</h5>
          <div class="forcastTemp">{{ Math.round(day.temp.day) }}°C</div>
          <img :src="day ? 'https://openweathermap.org/img/wn/'+day.weather[0].icon+'@2x.png' : 'assets/clear.svg'">
          <div class="forcastDetails">
            <div class="temp-range">
              <span class="max-temp">{{ Math.round(day.temp.max) }}°C</span>
              <span class="min-temp">{{ Math.round(day.temp.min) }}°C</span>
            </div>
          </div>
        </div>
      </div>




      <div id="infoOther">
        <current-weather-graphs 
          v-if="weatherData"
          :weather-data="weatherData"
        />
        <weather-charts 
          v-if="historicalWeather && historicalWeather.length > 0"
          :weather-data="weatherData"
          :historical-weather="filteredHistoricalWeather"
        />
        <!--<div v-else-if="weatherData" class="InfoBox">
          
          <h3>Current Weather Data</h3>
          <div class="current-data">
            <p><strong>Humidity:</strong> {{ weatherData.main.humidity }}%</p>
            <p><strong>Wind Speed:</strong> {{ weatherData.wind.speed }} m/s</p>
            <p><strong>Cloud Cover:</strong> {{ weatherData.clouds.all }}%</p>
            <p v-if="weatherData.rain"><strong>Rain:</strong> {{ weatherData.rain['1h'] }} mm</p>
            <p v-if="weatherData.snow"><strong>Snow:</strong> {{ weatherData.snow['1h'] }} mm</p>
          </div>
          
        </div>
        -->
      </div>
      <div id="logoDiv">
        <img id = "logo" src="../assets/rain.svg" alt="Logo">
      </div>
    </div>
  </div>
</template>

<script>
import './Dashboard.css';
//import WeatherCharts from './WeatherCharts.vue';
import CurrentWeatherGraphs from './CurrentWeatherGraphs.vue';
import $ from 'jquery';

export default {
  name: 'WeatherDashboard',
  components: {
    //WeatherCharts,
    CurrentWeatherGraphs
  },
  data() {
    return {
      cityInput: '',
      weatherData: null,
      forecastData: null,
      error: null,
      API_KEY: '3feecf72972e71bb7b17a5e31a4c1827',
      searchHistory: [],
      selectedDate: '',
      historicalWeather: '',
      showCalendar: false,
      targetHours: [3,7,12,16],
      hasSearched: false
    }
  },
  computed: {
    formattedDateText() {
      if (!this.selectedDate) return ''
      const date = new Date(this.selectedDate + 'T00:00:00')
      return date.toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      })
    },
    filteredHistoricalWeather() {
      if (!this.selectedDate) return []; 
      const [year, month, day] = this.selectedDate.split('-').map(Number);
      const startUTC = Date.UTC(year, month - 1, day, 5, 0, 0);
      const endUTC = startUTC + 86400 * 1000;
      return (this.historicalWeather || []).filter(entry => {
        const entryTime = entry.dt * 1000; 
        if (entryTime < startUTC || entryTime >= endUTC) return false;
        const entryDateEST = new Date(entryTime - 5 * 3600 * 1000);
        const entryHourEST = entryDateEST.getHours();
        return this.targetHours.includes(entryHourEST);
      });
  }
  },
  methods: {
    capatalizeSentence(sentence) {
      return sentence.split(' ').map(word => {
        return word[0].toUpperCase() + word.substring(1).toLowerCase();
      }).join(' ');
    },
    async getWeather() {
      if (!this.cityInput.trim()) {
        this.error = 'Please enter a city name'
        return
      }

      try {
        this.error = null
        
        const currentResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(this.cityInput)}&units=metric&appid=${this.API_KEY}`)
        const currentData = await currentResponse.json()
        
        if (currentData.cod === '404') {
          this.error = 'Not a valid city'
          this.weatherData = null
          this.forecastData = null
          this.hasSearched = true  // Only set hasSearched to true when we have an invalid search
          return
        }

        this.weatherData = currentData
        this.hasSearched = false  // Reset hasSearched when we have valid data

        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast/daily?q=${encodeURIComponent(this.cityInput)}&units=metric&cnt=7&appid=${this.API_KEY}`)
        const forecastData = await forecastResponse.json()
        this.forecastData = forecastData
        
        if (!this.searchHistory.includes(this.cityInput.toLowerCase())) {
          this.searchHistory.unshift(this.cityInput.toLowerCase())
          if (this.searchHistory.length > 5) {
            this.searchHistory.pop()
          }
        }
      } catch (error) {
        console.error('Error:', error)
        this.error = 'Error fetching weather data'
        this.weatherData = null
        this.forecastData = null
      }
    },
    searchCity(city) {
      this.cityInput = city
      this.getWeather()
    },
    formatDate(timestamp) {
      const date = new Date(timestamp * 1000)
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    },
    formatTime(timestamp) {
      const date = new Date(timestamp * 1000)
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    },
    async fetchHistoricalWeather() {
      if (!this.selectedDate || !this.weatherData?.name || !this.weatherData?.sys?.country) return;
      const [year, month, day] = this.selectedDate.split('-').map(Number);
      const startUnix = Date.UTC(year, month - 1, day, 5, 0, 0) / 1000;
      const endUnix = startUnix + 86400; // one day later

      const city = `${this.weatherData.name},${this.weatherData.sys.country}`;
      const url = `https://history.openweathermap.org/data/2.5/history/city?q=${city}&type=hour&start=${startUnix}&end=${endUnix}&appid=${this.API_KEY}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data?.list?.length) {
          this.historicalWeather = data.list;
        } else {
          this.historicalWeather = [];
        }
      } catch (error) {
        console.error('Historical API error:', error);
        this.historicalWeather = [];
      }
    },
    clearHistoricalWeather() {
      this.historicalWeather = null
      this.selectedDate = ''
    },
    selectForecastDay(day) {
      // Create a new weather data object based on the selected day
      const selectedWeatherData = {
        ...this.weatherData,
        main: {
          temp: day.temp.day,
          feels_like: day.feels_like.day,
          temp_min: day.temp.min,
          temp_max: day.temp.max,
          humidity: day.humidity,
          pressure: day.pressure
        },
        weather: [{
          ...day.weather[0]
        }],
        wind: {
          speed: day.speed,
          deg: day.deg
        },
        clouds: {
          all: day.clouds
        },
        sys: {
          ...this.weatherData.sys,  // Preserve the original sys data including country
          sunrise: day.sunrise,
          sunset: day.sunset
        },
        dt: day.dt,
        name: this.weatherData.name,  // Preserve the city name
        timezone: this.weatherData.timezone  // Preserve the timezone
      }
      
      // Update the weather data
      this.weatherData = selectedWeatherData
    },
    toggleCalendar() {
      const $calendar = $('#calendarSection');
  
      if ($calendar.is(':visible')) {
        $calendar.slideUp(300, () => {
          this.showCalendar = false;
        });
      } else {
        $calendar.slideDown(300, () => {
          this.showCalendar = true;
        });
      }
    }
  }
}
</script>

<style scoped>
.weather-dashboard {
  min-height: 100vh;
}

.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
  width: 90vh;
}

.row {
  margin: 0;
  margin-top: 6px;
  justify-content: space-between;
}

.upper {
  border-bottom: 1px solid #7f7272;
}

.card-title {
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.temperature {
  font-size: 3rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.weather-description {
  font-size: 1.5rem;
  color: #666;
  margin-bottom: 1.5rem;
  text-transform: capitalize;
}

.weather-details {
  color: #666;
}

.weather-details p {
  margin-bottom: 0.5rem;
}

.weather-details strong {
  color: #2c3e50;
  margin-right: 0.5rem;
}

.search-history {
  max-width: 300px;
}

.list-group-item {
  cursor: pointer;
  transition: background-color 0.2s;
}

.list-group-item:hover {
  background-color: #f8f9fa;
}

#SideBarInfo {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 15px;
}

#tempBox {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

#tempBox p {
  margin: 0;
  padding: 5px 0;
}

#temp {
  font-size: 2.5rem;
  margin: 0;
  padding: 0;
}

#feelTemp {
  font-size: 1rem;
  margin: 0;
  padding: 0;
}

#weatherIcon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

#weatherIcon p {
  margin: 0;
  padding: 0;
}

#weatherIcon img {
  width: 80px;
  height: 80px;
}

.forcastDetails {
  width: 100%;
  margin-top: 10px;
}

.temp-range {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
}

.max-temp {
  color: #ff6b6b;
  font-weight: bold;
}

.min-temp {
  color: #4dabf7;
  font-weight: bold;
}
</style> 