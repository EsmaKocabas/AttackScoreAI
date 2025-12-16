//express yapısının oluşturulması

const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const playerRoutes = require("./src/api/routes/player.routes");

app.use("/api/players", playerRoutes);

module.exports = app;   
