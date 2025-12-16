    
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

const client = new predictionPackage.PredictionService(
  `localhost:${PORT}`,
  grpc.credentials.createInsecure()
);

export default client;
