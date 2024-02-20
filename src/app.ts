// -------------- IMPORTS -------------- //

import express from "express";
import productsRouter from "./routes/products.route";
import cartsRouter from "./routes/carts.route";
import {
  PORT,
  rootPath,
  apiRoute,
  productsRoute,
  cartsRoute,
} from "./utils/utils";

// -------------- DEFINITIONS -------------- //

// Express.js application instance creation
const app = express();

// Express.js server start
app.listen(PORT, () =>
  console.log(`Servidor de Express.js corriendo en el puerto: ${PORT}`)
);

// MIDDLEWARES
// Complex URLs format mapping
app.use(express.urlencoded({ extended: true }));
// Serves static files from public folder
app.use(express.static(`${rootPath}/public`));
// Format JSON requests to JavaScript Object format (POST / PUT)
app.use(express.json());

// ROUTES
app.use(apiRoute + productsRoute, productsRouter);
app.use(apiRoute + cartsRoute, cartsRouter);
