import { parentPort, workerData } from "worker_threads";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import createErrorHandler from "../errors/error-hendler.js";

const filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(filename);

const fnTasks = {
  expiredTime: "../../utils/times/expired-time.js",
  convertToISODate: "../../utils/times/convert-to-iso.js",
  checkExpiredTime: "../../utils/times/check-expired-time.js",
  hashing: "../../../modules/users/helpers/encrypt/hashing.js",
  compareHash: "../../../modules/users/helpers/encrypt/compare-hash.js",
  generateToken: "../../../modules/users/helpers/token/generate-token.js",
};

const taskPath = fnTasks[workerData.typeTaks];

if (taskPath) {
  const absolutePath = path.resolve(__dirname, taskPath);
  const taskURL = pathToFileURL(absolutePath).toString();

  import(taskURL)
    .then((module) => {
      const taskFunction =
        typeof module.default === "function"
          ? module.default
          : typeof module[workerData.typeTaks] === "function"
          ? module[workerData.typeTaks]
          : Object.values(module).find((exp) => typeof exp === "function");

      if (!taskFunction) {
        throw new Error(
          `Oppss..Tidak dapat melakukan ini masih terkendala ${workerData.typeTaks}`
        );
      }

      return taskFunction(workerData.data);
    })
    .then((result) => parentPort.postMessage(result))
    .catch((err) => {
      throw createErrorHandler(500, err.message);
    });
} else {
  parentPort.postMessage({
    status: "error",
    statusCode: 500,
    message: "Opss.. terjadi kekeliruan. Tugas tidak ditemukan.",
  });
}
