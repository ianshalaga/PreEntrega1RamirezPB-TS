import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url); // Current file absolute path (.../paths.ts)
const __dirname = dirname(__filename); // Current folder absolute path (.../utils)
export const rootPath = dirname(dirname(__dirname)); // Root folder absolute path (.../)

export const productsPath = rootPath + "/src/data/products.json";
export const cartsPath = rootPath + "/src/data/carts.json";
export const productsImagesPath = rootPath + "/src/assets/images/products";
