const express = require("express");
const path = require("path");
const env = require("./env");

const app = express();
const port = env.port;

app.use(express.static("src"));

app.get("/api/data", async (req, res) => {
  const apiPath = env.api;

  try {
    const response = await fetch(apiPath);
    const jsonData = await response.json();

    const allData = jsonData.map((item) => {
      const timestamp = item.timestamp;
      const date = new Date(timestamp);

      const formattedTimestamp = date.toTimeString().split(" ")[0];

      return {
        temperature: parseFloat(item.temperature),
        humidity: parseFloat(item.humidity),
        gas_concentration: parseFloat(item.gas_concentration),
        fire_intensity: parseFloat(item.fire_intensity),
        timestamp: formattedTimestamp,
      };
    });

    function getLatestData(data) {
      return data.slice(-20);
    }
    res.json(getLatestData(allData));
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(port, () => {
  console.log(`Application Run On ${port}`);
});
