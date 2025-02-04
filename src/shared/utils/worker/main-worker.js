import { Worker } from "worker_threads";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function worker(typeTaks, data = null) {
  return new Promise((resolve, reject) => {
    const workerPath = path.resolve(__dirname, "./worker-thread.js");
    
    const worker = new Worker(workerPath, {
      workerData: { typeTaks, data },
    });

    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) {
        reject(new Error(`Worker exited with code ${code}`));
      }
    });
  });
}
