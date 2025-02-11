import express from "express";
import { MySQLConnection } from "./easyorder/Infrastructure/DB/Impl/MySQLConnection";
import { DefaultApiEndpoints } from "./easyorder/Infrastructure/Api/ApisDefaultEndpoints";
import { ApiClientes } from "./easyorder/Infrastructure/Api/ApiClientes";
import dotenv from 'dotenv';
import { AWSApiConfigService } from "./easyorder/Infrastructure/Service/AWSApiConfigService";

dotenv.config();

// Inicialização de banco de dados
const mysqlConnection = new MySQLConnection({
  hostname: process.env.DATABASE_HOST ?? "ERROR",
  portnumb: Number(process.env.DATABASE_PORT ?? "0"),
  database: process.env.DATABASE_NAME ?? "ERROR",
  username: process.env.DATABASE_USER ?? "ERROR",
  password: process.env.DATABASE_PASS ?? "ERROR",
  databaseType: 'mysql'
});


// Inicialização de framework Express + endpoints default
const port = Number(process.env.SERVER_PORT ?? "3000");
const app = express();
DefaultApiEndpoints.start(app);

// Inicialização de endpoints da aplicação
ApiClientes.start(mysqlConnection, app);

// Buscar configurações do Terraform no S3
const bucketName = process.env.TERRAFORM_BUCKET_NAME ?? "ERROR";
const key_infra = process.env.TERRAFORM_INFRA_KEY ?? "ERROR";
const key_serverless = process.env.TERRAFORM_SERVERLESS_KEY ?? "ERROR";

const region = process.env.AWS_REGION ?? "ERROR";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID ?? "ERROR";
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY ?? "ERROR";
const sessionToken = process.env.AWS_SESSION_TOKEN ?? "ERROR";

const fetchAWSConfigService = new AWSApiConfigService(region, accessKeyId, secretAccessKey, sessionToken);

async function fetchConfigs() {
  const outputsS3Infra = await fetchAWSConfigService.fetchS3OutputConfigs(bucketName, key_infra);
  console.log("Outputs S3 Infra: ", outputsS3Infra);
  const outputsS3Serverless = await fetchAWSConfigService.fetchS3OutputConfigs(bucketName, key_serverless);
  console.log("Outputs S3 Serverless: ", outputsS3Serverless);
}
fetchConfigs();

// Inicialização do Express server
app.listen(port, () => {
  console.log(`Servidor Microserviço Clientes rodando na porta ${port}`);
});