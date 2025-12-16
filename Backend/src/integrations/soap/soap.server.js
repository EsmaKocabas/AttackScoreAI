import http from "http";
import soap from "soap";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import playerSoapService from "./player.soap.js";
import 'dotenv/config'; 

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.SOAP_PORT || 8000;

const wsdlPath = path.join(__dirname, "player.wsdl");
const wsdl = fs.readFileSync(wsdlPath, "utf8");

const server = http.createServer((req, res) => {
  res.end("SOAP Server is running");
});

server.listen(PORT, () => {
  soap.listen(server, "/wsdl", playerSoapService, wsdl);
  console.log(`🧼 SOAP server running at http://localhost:${PORT}/wsdl`);
});
