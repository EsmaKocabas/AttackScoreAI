// sunucu başlatma
import playerRoutes from './src/api/routes/player.routes.js';
import predictRoutes from './src/api/routes/predict.routes.js';
import authRoutes from './src/api/routes/auth.routes.js';
import express from 'express';
import cors from 'cors';
import 'dotenv/config'; 

// SOAP sunucusunu başlat
import './src/integrations/soap/soap.server.js';

// Uygulama, aynı klasördeki `app.js` dosyasında tanımlı
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/players", playerRoutes);
app.use("/api/prediction", predictRoutes);
app.use("/api/auth", authRoutes);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 REST API Server is running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});

