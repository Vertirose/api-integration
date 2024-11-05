const express = require("express");
const app = express();
const axios = require("axios");
const path = require("path");
const fs = require("fs");
const winston = require("winston");
const env = require("./src/utils/env");
const staticDir = path.join(__dirname, "src", "static");
const errorDir = path.join(staticDir, "error");
const dev = require("./src/router/devRoute");

const devEnv = env.node_env === "development";
const port = env.port;
const api = env.api;
const api_mess = env.message;
const logDir = env.storage;

// check log dir exist or not
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// logger configuration
const logger = winston.createLogger({
  level: devEnv ? "debug" : "warn", // "warn" in production, "debug" in development
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: path.join(logDir, "app.log") }),
    new winston.transports.Console(),
  ],
});

app.use(express.json());

// checking node environement
if (devEnv) {
  app.use("/", dev);
} else {
  app.use(express.static(staticDir, { maxAge: "1d" }));
}

// logging midleware
function logRequest(req, res, next) {
  logger.info(`Request: ${req.method} ${req.url}`);
  next();
}

app.post("/api/send", logRequest, async (req, res) => {
  const requestData = req.body;

  try {
    const response = await axios.post(api_mess, requestData);
    logger.info(`Successful request to /api/send`, {
      method: req.method,
      url: req.url,
      requestData,
      responseData: response.data,
    });

    res.json(response.data);
  } catch (error) {
    logger.error("Error invoking API:", error.message);
    res
      .status(error.response?.status || 500)
      .json({ error: "Error invoking API" });
  }
});

app.all("/api/send", async (req, res) => {
  logger.warn(`Incorrect method ${req.method} used on ${req.url}`);
  res.status(405).redirect("/not-allow");
});

function checkAuthorization(req, res, next) {
  const authorized = req.headers["api_data"]; // Example check, modify as needed

  if (!authorized) {
    return res.status(401).redirect("/unauthorized");
  }

  next();
}

app.get("/api/data", checkAuthorization, logRequest, async (req, res) => {
  try {
    const response = await axios.get(api);
    const jsonData = response.data;

    const allData = jsonData.map((item) => ({
      temperature: parseFloat(item.temperature),
      humidity: parseFloat(item.humidity),
      gas_concentration: parseFloat(item.gas_concentration),
      fire_intensity: parseFloat(item.fire_intensity),
      timestamp: new Date(item.timestamp).toTimeString().split(" ")[0],
    }));

    const getLatestData = (data) => data.slice(-20);
    res.json(getLatestData(allData));
  } catch (error) {
    logger.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Failed to fetch data" });
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
  logger.info(`Application running on port ${port}`);
});
