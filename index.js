// external imports
const express = require("express");
const cors = require("cors");
require("dotenv").config();
// internal imports
const db = require("./src/config/db");
const routes = require("./src/routes/routes");

// app and port declared
const app = express();
const port = process.env.PORT || 5001;

require("dotenv").config({ path: `${__dirname}/../.env` });

// application level middleware
app.use(cors());
app.use(express.json());

// initial routes
app.get("/", (req, res) => {
  res.json("hi commerce app");
});

// routes
app.use("/api", routes);

// app listen
app.listen(port, () => {
  console.log(`listing the port: ${port}`);
});
