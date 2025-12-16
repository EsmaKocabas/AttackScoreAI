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

function PredictGoalKing(call, callback) {
  // MOCK ML HESAPLAMASI
  const possibilityofgolking = Number(
    (Math.random() * (0.85 - 0.15) + 0.15).toFixed(2)
  );

  callback(null, {
    golKraliOlasiligi: possibilityofgolking,
    model: "ML_MODEL_V1",
  });
    }

function startServer() {
  const server = new grpc.Server();

  server.addService(
    predictionPackage.PredictionService.service,
    { PredictGoalKing }
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
