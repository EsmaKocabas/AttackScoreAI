// sunucu başlatma
import playerRoutes from './src/api/routes/player.routes.js';
import predictRoutes from './src/api/routes/predict.routes.js';
import authRoutes from './src/api/routes/auth.routes.js';
import fixtureRoutes from './src/api/routes/fixture.routes.js';
import express from 'express';
import cors from 'cors';
import 'dotenv/config'; 

// SOAP sunucusunu başlat
import './src/integrations/soap/soap.server.js';

// gRPC sunucusunu başlat
import './src/integrations/gRPC/grpc.server.js';

// Uygulama, aynı klasördeki `app.js` dosyasında tanımlı
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/players", playerRoutes);
// 🔄 DEĞİŞTİRİLDİ: Route sırası düzeltildi - /api/predictions önce, /api/prediction sonra
app.use("/api/predictions", predictRoutes);
app.use("/api/prediction", predictRoutes);
// ❌ ESKİ KOD - SİLİNEBİLİR (Yorum satırına alındı):
// app.use("/api/prediction", predictRoutes);
// app.use("/api/predictions", predictRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/fixtures", fixtureRoutes);

// 🆕 YENİ: Test endpoint'i - route'ların çalışıp çalışmadığını kontrol etmek için
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend çalışıyor", routes: ["/api/predictions/manual"] });
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 REST API Server is running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});

