import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')

/*
fetch('http://api.weatherstack.com/current?access_key=aece18e8a7765582bf657165a4d97930&query=New%20York')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log(data.current.temperature);
  })
  .catch(error => {
    console.error('Error fetching weather data:', error);
  });*/
