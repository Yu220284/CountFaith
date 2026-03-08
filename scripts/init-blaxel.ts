import { SandboxInstance } from "@blaxel/core";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
  const sandbox = await SandboxInstance.createIfNotExists({
    name: "countfaith-sandbox",
    image: "blaxel/nextjs:latest",
    memory: 4096,
    ports: [{ target: 3000, protocol: "HTTP" }],
    region: "us-pdx-1"
  });
  console.log("Sandbox created:", sandbox);

  const { subdirectories, files } = await sandbox.fs.ls("/");
  console.log("Files:", files, "Subdirectories:", subdirectories);

  const process = await sandbox.process.exec({
    name: "hello-process",
    command: "echo 'CountFaith initialized'"
  });
  
  const logs = await sandbox.process.logs("hello-process");
  console.log("Logs:", logs);
}

main().catch(console.error);
