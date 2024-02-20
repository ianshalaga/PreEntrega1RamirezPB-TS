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
// const SUCCESS = true;
// const FAILURE = false;

// ROUTES
export const apiRoute = "/api";
export const productRoute = "/product";
export const productsRoute = "/products";
export const cartsRoute = "/carts";
