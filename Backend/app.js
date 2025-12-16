//express yapısının oluşturulması
import express from 'express';
import cors from 'cors';
const app = express();

app.use(express.json());
app.use(cors());

import playerRoutes from "./src/api/routes/player.routes.js";
app.use("/api/players", playerRoutes);
import fixtureRoutes from "./src/api/routes/fixture.routes.js";
app.use("/api/fixtures", fixtureRoutes);

export default app;