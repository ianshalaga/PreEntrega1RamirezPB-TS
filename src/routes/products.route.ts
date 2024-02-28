import { Router, Request, Response } from "express";
import ProductManager from "../classes/ProductManager";
import QueryParams from "../interfaces/QueryParams";
import UpdateProduct from "../interfaces/UpdateProduct";
import IdProduct from "../interfaces/IdProduct";
import { productsPath } from "../utils/paths";
import { successStatus, failureStatus } from "../utils/statuses";
import Product from "../classes/Product";
import validateQueryParams from "../validators/queryParams";
import validateId from "../validators/ids";
import validateUpdateProduct from "../validators/updateProduct";

const productsRouter: Router = Router();

/** GET ENDPOINTS */
productsRouter.get("/", async (req: Request, res: Response) => {
  const productManager: ProductManager = new ProductManager(productsPath);
  const products: IdProduct[] = await productManager.getProducts();
  let limitParsed: number = products.length;
  const queryParams: QueryParams = validateQueryParams(req.query);
  if (!queryParams) {
    res.status(404).json(failureStatus("Query Params inválidos."));
    return;
  }
  const { limit } = queryParams;
  console.log(limit);
  if (limit) {
    limitParsed = parseInt(limit);
  }
  res.json(products.splice(0, limitParsed));
});

productsRouter.get("/:pid", async (req: Request, res: Response) => {
  const productManager: ProductManager = new ProductManager(productsPath);
  const pid: number = validateId(req.params.pid);
  if (pid) {
    const idProduct: IdProduct = await productManager.getProductById(pid);
    if (idProduct) {
      res.json(idProduct);
    } else {
      res
        .status(404)
        .json(failureStatus(`El producto con id ${pid} no existe.`));
    }
  } else {
    res.status(404).json(failureStatus("Pid inválido."));
  }
});

/** POST ENDPOINT */
productsRouter.post("/", async (req: Request, res: Response) => {
  const productManager: ProductManager = new ProductManager(productsPath);
  const product: Product = req.body;
  await productManager.addProduct(product, (error: Error) => {
    if (error) {
      res.status(500).json(failureStatus(error.message)); // Server error
    } else {
      res.json(successStatus);
    }
  });
});

/** PUT ENDPOINT */
productsRouter.put("/:pid", async (req: Request, res: Response) => {
  const productManager: ProductManager = new ProductManager(productsPath);
  // const pid: number = parseInt(req.params.pid);
  const pid: number = validateId(req.params.pid);
  if (pid) {
    const updateProperties: UpdateProduct = validateUpdateProduct(req.body);
    if (updateProperties) {
      await productManager.updateProduct(
        pid,
        updateProperties,
        (error: Error) => {
          if (error) {
            res.status(500).json(failureStatus(error.message));
          } else {
            res.json(successStatus);
          }
        }
      );
    } else {
      res.status(404).json(failureStatus("Propiedades inválidas."));
    }
  } else {
    res.status(404).json(failureStatus("Product ID inválido."));
  }
});

/** DELETE ENDPOINT */
productsRouter.delete("/:pid", async (req: Request, res: Response) => {
  const productManager: ProductManager = new ProductManager(productsPath);
  // const pid: number = parseInt(req.params.pid);
  const pid: number = validateId(req.params.pid);
  if (pid) {
    await productManager.deleteProduct(pid, (error: Error) => {
      if (error) {
        res.status(404).json(failureStatus(error.message));
      } else {
        res.json(successStatus);
      }
    });
  } else {
    res.status(404).json(failureStatus("Product ID inválido."));
  }
});

export default productsRouter;
