const express = require("express");
const app = express();
const axios = require("axios");
const path = require("path");
const staticDir = path.join(__dirname, "src", "static");
const errorDir = path.join(staticDir, "error");
const dev = require("./src/router/devRoute");
const env = require("./src/utils/env");
const devEnv = env.node_env === "development";
const port = env.port;
const api = env.api;
const api_mess = env.message;

app.use(express.json());

if (devEnv) {
  app.use("/", dev); // Use the dev router
} else {
  app.use(express.static(staticDir));
}

app.post("/api/send", async (req, res) => {
  const requestData = req.body;

  try {
    const response = await axios.post(api_mess, requestData);
    res.json(response.data);
  } catch (error) {
    console.error("Error invoking API:", error.message);
    res
      .status(error.response?.status || 500)
      .json({ error: "Error invoking API" });
  }
});

app.all("/api/send", async (req, res) => {
  res.status(405).redirect("/not-allow");
});

function checkAuthorization(req, res, next) {
  const authorized = req.headers["api_data"]; // Example check, modify as needed

  if (!authorized) {
    return res.status(401).redirect("/unauthorized");
  }

  next();
}

app.get("/api/data", checkAuthorization, async (req, res) => {
  const apiMain = api;

  try {
    const response = await fetch(apiMain);
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
    console.error("error fetching data:", error);
    res.status(500).json({ error: "failed to fetch data" });
  }
});

// ----------------- Error Condition -----------------
app.get("/bad-request", (req, res) => {
  res.status(400).sendFile(path.join(errorDir, "400.html"));
});

app.get("/unauthorized", (req, res) => {
  res.status(401).sendFile(path.join(errorDir, "401.html"));
});

app.get("/forbidden", (req, res) => {
  res.status(403).sendFile(path.join(errorDir, "403.html"));
});

app.get("/not-allow", (req, res) => {
  res.status(405).sendFile(path.join(errorDir, "405.html"));
});

// Simulated errors for demonstration
app.get("/bad-gateway", (req, res) => {
  res.status(502).sendFile(path.join(errorDir, "502.html"));
});

app.get("/service-unavailable", (req, res) => {
  res.status(503).sendFile(path.join(errorDir, "503.html"));
});

// Error handler for 500 Internal Server Error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).sendFile(path.join(errorDir, "500.html"));
});

// Catch-all for 404 Not Found errors
app.use((req, res) => {
  res.status(404).sendFile(path.join(errorDir, "404.html"));
});

app.listen(port, () => {
  console.log(`application run on ${port}`);
});
