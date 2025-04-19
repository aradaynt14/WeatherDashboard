<template>
  <div class="graphs-container">
    <div class="graph-box">
      <h3>Temperature</h3>
      <div class="temp-graph" ref="tempChart"></div>
    </div>
    <div class="graph-box">
      <h3>Sunrise & Sunset</h3>
      <div class="sun-graph-container">
        <div class="sunrise-time">{{ formatTime(weatherData.sys.sunrise) }}</div>
        <div class="sun-graph" ref="sunChart"></div>
        <div class="sunset-time">{{ formatTime(weatherData.sys.sunset) }}</div>
      </div>
    </div>
    <div class="graph-box">
      <h3>Wind Speed & Direction</h3>
      <div class="wind-graph" ref="windChart"></div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'CurrentWeatherGraphs',
  props: {
    weatherData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      tempChart: null,
      sunChart: null,
      windChart: null
    }
  },
  watch: {
    weatherData: {
      handler() {
        this.$nextTick(() => {
          this.createTempChart()
          this.createSunChart()
          this.createWindChart()
        })
      },
      deep: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.createTempChart()
      this.createSunChart()
      this.createWindChart()
    })
  },
  methods: {
    formatTime(timestamp) {
      const date = new Date((timestamp + this.weatherData.timezone) * 1000)
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC'
      })
    },
    createTempChart() {
      // Clear previous chart.
      d3.select(this.$refs.tempChart).selectAll('*').remove()
      
      const currentTemp = Math.round(this.weatherData.main.temp)
      const minTemp = Math.round(this.weatherData.main.temp_min)
      const maxTemp = Math.round(this.weatherData.main.temp_max)
      
      const isToday = new Date().toDateString() === new Date(this.weatherData.dt * 1000).toDateString()
      
      // Determine the y-axis range based on temperature values
      let minY = minTemp - 1, maxY = maxTemp + 1
      // if (minTemp >= 0) {
      //   minY = 0
      //   maxY = maxTemp * 1.2
      // } else if (maxTemp <= 0) {
      //   minY = minTemp * 1.2
      //   maxY = 0
      // } else {
      //   const range = Math.max(Math.abs(minTemp), maxTemp)
      //   minY = -range * 1.2
      //   maxY = range * 1.2
      // }
      
      const margin = { top: 20, right: 20, bottom: 30, left: 20 }
      const width = this.$refs.tempChart.clientWidth - margin.left - margin.right
      const height = 150 - margin.top - margin.bottom
      
      const svg = d3.select(this.$refs.tempChart)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)
      
      const x = d3.scaleBand()
        .range([0, width])
        .padding(0.4)
      
      const y = d3.scaleLinear()
        .range([height, 0])
        .domain([minY, maxY])
      
      const data = isToday 
        ? [
            { label: `Min: ${minTemp}°C`, value: minTemp, color: 'rgba(54, 162, 235, 0.8)' },
            { label: `Current: ${currentTemp}°C`, value: currentTemp, color: 'rgba(255, 99, 132, 0.8)' },
            { label: `Max: ${maxTemp}°C`, value: maxTemp, color: 'rgba(75, 192, 192, 0.8)' }
          ]
        : [
            { label: `Min: ${minTemp}°C`, value: minTemp, color: 'rgba(54, 162, 235, 0.8)' },
            { label: `Max: ${maxTemp}°C`, value: maxTemp, color: 'rgba(75, 192, 192, 0.8)' }
          ]
      
      x.domain(data.map(d => d.label))
      
      // Add bars
      svg.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.label))
        .attr('width', x.bandwidth())
        .attr('y', d => y(d.value + 1))
        .attr('height', d => Math.abs(y(d.value - 1) - y(d.value + 1)))
        .attr('fill', d => d.color)
        .attr('stroke', d => d.color.replace('0.8', '1'))
        .attr('stroke-width', 1)
      
      // Add labels
      svg.selectAll('.label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', d => x(d.label) + x.bandwidth() / 2)
        .attr('y', height + 20)
        .attr('text-anchor', 'middle')
        .text(d => d.label)
    },
    createSunChart() {
      // Clear previous chart
      d3.select(this.$refs.sunChart).selectAll('*').remove()
      
      // Get timestamps and convert to local time of the searched city
      const sunrise = new Date((this.weatherData.sys.sunrise + this.weatherData.timezone) * 1000)
      const sunset = new Date((this.weatherData.sys.sunset + this.weatherData.timezone) * 1000)
      
      const sunriseHours = sunrise.getUTCHours() + sunrise.getUTCMinutes() / 60
      const sunsetHours = sunset.getUTCHours() + sunset.getUTCMinutes() / 60
      
      // Calculate angles for clockwise rotation

      const getArcAngle = (hours) => {
        const normalizedHours = hours % 24
        return ((12 - normalizedHours) * 15) % 360
      }

      // For hour markers (rotated 180° counterclockwise):
      const getTickAngle = (hours) => {
        const normalizedHours = hours % 24
        return ((18 - normalizedHours) * 15) % 360
      }

      const sunriseAngle = getArcAngle(sunriseHours)
      const sunsetAngle = getArcAngle(sunsetHours)
      
      const width = this.$refs.sunChart.clientWidth
      const height = 150
      const radius = Math.min(width, height) / 2
      
      const svg = d3.select(this.$refs.sunChart)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width/2},${height/2})`)
      
      // Create arc generator with larger inner radius
      const arc = d3.arc()
        .innerRadius(radius * 0.6)
        .outerRadius(radius)
        .startAngle(0)
        .endAngle(2 * Math.PI)
      
      // Add background circle
      svg.append('path')
        .attr('d', arc())
        .attr('fill', 'rgba(0, 0, 0, 0.1)')
      
      // Convert angles to radians for D3
      const sunriseRad = -sunriseAngle * Math.PI / 180
      const sunsetRad = -sunsetAngle * Math.PI / 180
      
      // Create the arcs for day and night
      // The day arc should go from sunrise to sunset
      const dayArc = d3.arc()
        .innerRadius(radius * 0.6)
        .outerRadius(radius)
        .startAngle(sunriseRad)
        .endAngle(sunsetRad)
      
      const nightArc = d3.arc()
        .innerRadius(radius * 0.6)
        .outerRadius(radius)
        .startAngle(sunsetRad)
        .endAngle(sunriseRad + 2 * Math.PI)
      
      // Add day and night sections
      svg.append('path')
        .attr('d', dayArc())
        .attr('fill', 'rgba(255, 238, 0, 0.8)')
      
      svg.append('path')
        .attr('d', nightArc())
        .attr('fill', 'rgb(10, 0, 116)')
        
      // Add hour markers (every 3 hours)
      for (let hour = 0; hour < 24; hour += 3) {
        const angle = getTickAngle(hour)
        const angleRad = -angle * Math.PI / 180  // Negative angle for clockwise rotation
        
        // Add tick mark
        svg.append('line')
          .attr('x1', radius * 0.95 * Math.cos(angleRad))
          .attr('y1', radius * 0.95 * Math.sin(angleRad))
          .attr('x2', radius * Math.cos(angleRad))
          .attr('y2', radius * Math.sin(angleRad))
          .attr('stroke', 'black')
          .attr('stroke-width', 1)
        
        // Add hour label
        svg.append('text')
          .attr('x', radius * 1.1 * Math.cos(angleRad))
          .attr('y', radius * 1.1 * Math.sin(angleRad))
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('font-size', '10px')
          .text(hour.toString().padStart(2, '0'))
      }
    },
    createWindChart() {
      // Clear previous chart
      d3.select(this.$refs.windChart).selectAll('*').remove()
      
      const windSpeed = this.weatherData.wind.speed
      const windDeg = this.weatherData.wind.deg
      
      const width = this.$refs.windChart.clientWidth
      const height = 150
      const radius = Math.min(width, height) / 2
      
      const svg = d3.select(this.$refs.windChart)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width/2},${height/2})`)
      
      // Create arc generator for the full circle with larger inner radius
      const fullArc = d3.arc()
        .innerRadius(radius * 0.6)  // Increased from 0.3 to 0.6
        .outerRadius(radius)
        .startAngle(0)
        .endAngle(2 * Math.PI)
      
      // Create arc generator for the wind direction indicator with larger inner radius
      const indicatorArc = d3.arc()
        .innerRadius(radius * 0.6)  // Increased from 0.3 to 0.6
        .outerRadius(radius)
        .startAngle((windDeg - 15) * Math.PI / 180)
        .endAngle((windDeg + 15) * Math.PI / 180)
      
      // Add background circle
      svg.append('path')
        .attr('d', fullArc())
        .attr('fill', 'rgba(0, 0, 0, 0.1)')
      
      // Add wind direction indicator
      svg.append('path')
        .attr('d', indicatorArc())
        .attr('fill', 'rgba(255, 0, 0, 0.8)')
      
      // Add wind speed and direction text
      svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.3em')
        .style('font-size', '12px')
        .text(`${windSpeed} m/s ${this.getWindDirection(windDeg)}`)
    },
    getWindDirection(degrees) {
      const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
      const index = Math.round(degrees / 22.5) % 16
      return directions[index]
    }
  }
}
</script>

<style scoped>
.graphs-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 20px;
  padding: 20px;
  width: 100%;
}

.graph-box {
  background: white;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex: 1;
  min-width: 200px;
  text-align: center;
}

.graph-box h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.temp-graph, .sun-graph, .wind-graph {
  height: 150px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.sun-graph-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 150px;
}

.sunrise-time, .sunset-time {
  font-size: 12px;
  color: #666;
  width: 60px;
  text-align: center;
}

.sun-graph {
  flex: 1;
}

.bar {
  transition: all 0.3s ease;
}

.label {
  font-size: 12px;
  fill: #666;
}
</style> 