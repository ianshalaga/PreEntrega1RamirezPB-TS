import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";

// PATHS
// Absolute root path
const __filename = fileURLToPath(import.meta.url); // Current file absolute path (.../utils.ts)
const __dirname = dirname(__filename); // Current folder absolute path (.../utils)
export const rootPath = dirname(dirname(__dirname)); // Root folder absolute path (.../)

export const productsPath = rootPath + "/src/data/products.json";
export const cartsPath = rootPath + "/src/data/carts.json";
export const productsImagesPath = rootPath + "/src/assets/images/products";

// PORT
export const PORT = 8080;

// STATUSES
export const successStatus = {
  status: "SUCCESS",
};
export function failureStatus(message: string) {
  return {
    status: "FAILURE",
    message,
  };
}

// ROUTES
export const apiRoute = "/api";
export const productRoute = "/product";
export const productsRoute = "/products";
export const cartsRoute = "/carts";

// FILES
// Read
export async function readDataFromJsonFileAsyncPromises<T>(
  path: string
): Promise<T> {
  try {
    const data = await fs.promises.readFile(path, "utf8");
    const dataParsed = JSON.parse(data);
    return dataParsed;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Error al cargar los productos desde el archivo: ${error.message}`
      );
    } else {
      throw error;
    }
  }
}

// Write
export async function writeDataIntoJsonFileAsyncPromises(
  path: string,
  data: object[]
): Promise<void> {
  try {
    const dataJson = JSON.stringify(data, null, 2);
    await fs.promises.writeFile(path, dataJson, "utf8");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Error al guardar productos en el archivo: ${error.message}`
      );
    } else {
      throw error;
    }
  }
}

// IDs
export function generateId(ids: number[]): number {
  let maxId = 0;
  if (ids.length !== 0) maxId = Math.max(...ids);
  return maxId;
}
