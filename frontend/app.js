const express = require("express");
const fs = require("fs");
const path = require("path");
const env = require("./env");

const app = express();
const port = env.port;

app.use(express.static("src"));

app.get("/api/data", (req, res) => {
  const apiPath = path.resolve(__dirname, "./src/data-api/test.json");
  const data = fs.readFileSync(apiPath, "utf8");
  const jsonData = JSON.parse(data);

  // Extracting all items
  const allData = jsonData.Items.map((item) => {
    const timestamp = item.timestamp.S;
    const date = new Date(timestamp);

    // Formatting the timestamp to HH:MM:SS
    const formattedTimestamp = date.toTimeString().split(" ")[0]; // Get the time part

    return {
      temperature: parseFloat(item.temperature.N),
      humidity: parseFloat(item.humidity.N),
      gas_concentration: parseFloat(item.gas_concentration.N),
      fire_intensity: parseFloat(item.fire_intensity.N),
      timestamp: formattedTimestamp,
    };
  });

  // Latest data
  function getLatestData(data) {
    return data.slice(-20); // Get the last 20 entries
  }

  // Send limited data as a response
  res.json(getLatestData(allData));
});

app.listen(port, () => {
  console.log(`Application Run On ${port}`);
});
