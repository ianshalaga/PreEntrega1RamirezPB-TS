import { Router, Request, Response } from "express";
import { productsPath, successStatus, failureStatus } from "../utils/utils";
import ProductManager from "../ProductManager";

const productsRouter = Router(); // Express.js Router instance

// Queries interface
interface QueryParams {
  limit?: string; // ? Optional property
}

// Set a route in Express.js application to handle GET requests (GET ENDPOINT with QUERIES)
productsRouter.get("/", async (req: Request, res: Response) => {
  // Reading products
  const productManager = new ProductManager(productsPath); // New ProductManager instance
  const products = await productManager.getProducts(); // Get all Products
  // Set max limit value
  let limitParsed: number = products.length;
  // Get all queries
  const queryParams: QueryParams = req.query;
  // Get limit query
  const { limit } = queryParams;
  // If limit is not undefined
  if (limit) {
    limitParsed = parseInt(limit); // Update and parse new limit
  }
  res.json(products.splice(0, limitParsed));
});

// GET ENDPOINT with PARAMS
productsRouter.get("/:pid", async (req: Request, res: Response) => {
  const productManager = new ProductManager(productsPath); // New ProductManager instance
  const pid: number = parseInt(req.params.pid); // URL param pid into integer format
  const idProduct = await productManager.getProductById(pid); // Get Product by id
  // If idProduct is not undefined
  if (idProduct) {
    res.json(idProduct); // Product found
  } else {
    res.status(404).json(failureStatus(`El producto con id ${pid} no existe.`)); // Product not found / client error
  }
});

// POST ENDPOINT
productsRouter.post("/", async (req: Request, res: Response) => {
  const productManager = new ProductManager(productsPath); // New ProductManager instance
  const product = req.body; // New Product to add
  // Add new Product
  await productManager.addProduct(product, (error: Error) => {
    if (error) {
      res.status(500).json(failureStatus(error.message)); // Server error
    } else {
      res.json(successStatus);
    }
  });
});

// PUT ENDPOINT with PARAMS
productsRouter.put("/:pid", async (req: Request, res: Response) => {
  const productManager = new ProductManager(productsPath); // New ProductManager instance
  const pid: number = parseInt(req.params.pid); // URL param pid into integer format
  const updateProperties = req.body;
  await productManager.updateProduct(pid, updateProperties, (error: Error) => {
    if (error) {
      res.status(500).json(failureStatus(error.message));
    } else {
      res.json(successStatus);
    }
  });
});

// DELETE ENDPOINT with PARAMS
productsRouter.delete("/:pid", async (req: Request, res: Response) => {
  const productManager = new ProductManager(productsPath); // New ProductManager instance
  const pid: number = parseInt(req.params.pid); // URL param pid into integer format
  await productManager.deleteProduct(pid, (error: Error) => {
    if (error) {
      res.status(404).json(failureStatus(error.message));
    } else {
      res.json(successStatus);
    }
  });
});

export default productsRouter;
