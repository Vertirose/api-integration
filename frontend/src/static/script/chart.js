const ctx = document.getElementById("sensorChart").getContext("2d");

// Gradient
const temperatureGradient = ctx.createLinearGradient(0, 0, 0, 400);
temperatureGradient.addColorStop(0, "rgba(255, 99, 132, 1)");
temperatureGradient.addColorStop(1, "rgba(255, 99, 132, 0.2)");

const humidityGradient = ctx.createLinearGradient(0, 0, 0, 400);
humidityGradient.addColorStop(0, "rgba(54, 162, 235, 1)");
humidityGradient.addColorStop(1, "rgba(54, 162, 235, 0.2)");

const gasGradient = ctx.createLinearGradient(0, 0, 0, 400);
gasGradient.addColorStop(0, "rgba(75, 192, 192, 1)");
gasGradient.addColorStop(1, "rgba(75, 192, 192, 0.2)");

const fireGradient = ctx.createLinearGradient(0, 0, 0, 400);
fireGradient.addColorStop(0, "rgba(255, 206, 86, 1)");
fireGradient.addColorStop(1, "rgba(255, 206, 86, 0.2)");

const myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [], // Timestamps will go here
    datasets: [
      {
        label: "Temperature",
        data: [], // Temperature values
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: temperatureGradient,
        borderWidth: 2,
        fill: true,
      },
      {
        label: "Humidity",
        data: [], // Humidity values
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: humidityGradient,
        borderWidth: 2,
        fill: true,
      },
      {
        label: "Gas Concentration",
        data: [], // Gas concentration values
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: gasGradient,
        borderWidth: 2,
        fill: true,
      },
      {
        label: "Fire Intensity",
        data: [], // Fire intensity values
        borderColor: "rgba(255, 206, 86, 1)",
        backgroundColor: fireGradient,
        borderWidth: 2,
        fill: true,
      },
    ],
  },
  options: {
    scales: {
      x: {
        ticks: {
          autoSkip: true, // Automatically skip ticks
          maxTicksLimit: 10, // Set a limit on the number of ticks
          maxRotation: 0, // Prevent rotation
          minRotation: 0, // Prevent rotation
        },
        grid: {
          color: "#3a3a3a",
          display: true, // Ensure the x-axis grid is visible
        },
      },
      y: {
        grid: {
          color: "#3a3a3a",
          display: true, // Ensure the y-axis grid is visible
        },
        ticks: {
          color: "#e5e5e5",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#e5e5e5",
        },
      },
    },
  },
});

// Function to fetch data and update the chart
function fetchData() {
  console.log("Fetching data..."); // Log to track the fetch process
  fetch("/api/data", {
    headers: {
      api_data:
        "eyJhbGciOiJIUzUxMiJ9.eyJSb2xlIjoiYWRtaW5pc3RyYXRvciIsIklzc3VlciI6ImFkbWluaXN0cmF0b3IiLCJVc2VybmFtZSI6ImFwaUludGVncmF0aW9uIiwiVXNlZCI6ImdlbmVyYXRlQ2hhcnQifQ.xkWsKWZbLlUp67eWmLd8OAyJwW5_Gbo2GRIAB6eJMaKaT149owFi80JoqQaRHCjRX_hc_kvOsiZlHEXi1acOhw",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((allData) => {
      console.log("Data fetched successfully:", allData); // Log the fetched data
      // Clear existing data
      myChart.data.labels = [];
      myChart.data.datasets.forEach((dataset) => {
        dataset.data = [];
      });

      // Update chart with new data
      allData.forEach((entry) => {
        myChart.data.labels.push(entry.timestamp);
        myChart.data.datasets[0].data.push(entry.temperature); // Temperature
        myChart.data.datasets[1].data.push(entry.humidity); // Humidity
        myChart.data.datasets[2].data.push(entry.gas_concentration); // Gas Concentration
        myChart.data.datasets[3].data.push(entry.fire_intensity); // Fire Intensity
      });

      myChart.update(); // Update the chart
    })
    .catch((error) => {
      console.error("Error fetching data:", error); // Log the error
    });
}

// Initial data fetch
fetchData();

// Poll for new data every 5 seconds
setInterval(fetchData, 5000);
