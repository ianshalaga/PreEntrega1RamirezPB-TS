import express from "express";
import { Express } from "express";
import productsRouter from "./routes/products.route";
import cartsRouter from "./routes/carts.route";
import { PORT } from "./utils/ports";
import { rootPath } from "./utils/paths";
import { apiRoute, productsRoute, cartsRoute } from "./utils/routes";

const app: Express = express(); // Express.js application instance creation

// Express.js server start
app.listen(PORT, () =>
  console.log(`Servidor de Express.js corriendo en el puerto: ${PORT}`)
);

/** MIDDLEWARES */
app.use(express.urlencoded({ extended: true })); // Complex URLs format mapping
app.use(express.static(`${rootPath}/public`)); // Serves static files from public folder
app.use(express.json()); // Format JSON requests to JavaScript Object format (POST / PUT)

/** ROUTES */
app.use(apiRoute + productsRoute, productsRouter);
app.use(apiRoute + cartsRoute, cartsRouter);
