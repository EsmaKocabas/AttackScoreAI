import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import 'dotenv/config'; 
const __dirname = dirname(fileURLToPath(import.meta.url));
const PROTO_PATH = path.join(__dirname, "prediction.proto");
const PORT = process.env.GRPC_PORT || 8001;
const packageDef = protoLoader.loadSync(PROTO_PATH);
const grpcObject = grpc.loadPackageDefinition(packageDef);
const predictionPackage = grpcObject.prediction;

function CalculatePlayerRating(call, callback) {
  // MOCK ML HESAPLAMASI - Futbolcu Rating (0-100 arası)
  const playerRating = Number(
    (Math.random() * (95 - 50) + 50).toFixed(1)
  );

  callback(null, {
    rating: playerRating,
    model: "RATING_MODEL_V1",
  });
}

function startServer() {
  const server = new grpc.Server();

  server.addService(
    predictionPackage.PredictionService.service,
    { CalculatePlayerRating }
  );    

  server.bindAsync(
    `0.0.0.0:${PORT}`,
    grpc.ServerCredentials.createInsecure(),
    () => {
      console.log(`🚀 gRPC ML Server running on port ${PORT}`);
      server.start();
    }
  );
}

startServer();
