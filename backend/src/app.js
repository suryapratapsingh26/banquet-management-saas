const express = require("express");
// enable CORS for local dev
let cors;
try {
  cors = require("cors");
} catch (e) {
  cors = null;
}

// routes
const healthRoute = require("../routes/health");
const clientRoutes = require("../routes/clients");
const venueRoutes = require("../routes/venues");
const authRoutes = require("../routes/auth");

const app = express();

app.use(express.json());

if (cors) {
  app.use(cors());
} else {
  console.warn("CORS package not installed. If frontend runs on a different port, install 'cors' to enable it.");
}

// request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// routes
app.use("/health", healthRoute);
app.use("/api/clients", clientRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;
