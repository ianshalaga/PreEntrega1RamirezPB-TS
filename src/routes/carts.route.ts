import { Router, Request, Response } from "express";
import {
  productRoute,
  cartsPath,
  productsPath,
  successStatus,
  failureStatus,
} from "../utils/utils";
import { CartManager } from "../CartManager";
import ProductManager from "../ProductManager";

const cartsRouter = Router();

cartsRouter.get("/:cid", async (req: Request, res: Response) => {
  const cartManager = new CartManager(cartsPath); // New CartManager instance
  const cid: number = parseInt(req.params.cid); // URL param cid into integer format
  const idCart = await cartManager.getCartById(cid); // Get Cart by id
  // If idCart is not undefined
  if (idCart) {
    // Cart found
    res.json(idCart.products);
  } else {
    // Cart not found
    res.status(404).json(failureStatus(`El carro con id ${cid} no existe.`));
  }
});

cartsRouter.post("/", async (req: Request, res: Response) => {
  const cartManager = new CartManager(cartsPath); // New CartManager instance
  await cartManager.createCart(); // Create new Cart
  res.json(successStatus);
});

cartsRouter.post(
  "/:cid" + productRoute + "/:pid",
  async (req: Request, res: Response) => {
    const cartManager = new CartManager(cartsPath); // New CartManager instance
    const productManager = new ProductManager(productsPath); // New CartManager instance
    const cid: number = parseInt(req.params.cid);
    const pid: number = parseInt(req.params.pid);
    const idProduct = await productManager.getProductById(pid);
    // Product not found (undefined)
    if (!idProduct) {
      res
        .status(404)
        .json(failureStatus(`El producto con id ${pid} no existe.`));
    } else {
      await cartManager.addProductToCart(cid, pid, (error: Error) => {
        if (error) {
          res.status(404).json(failureStatus(error.message));
        } else {
          res.json(successStatus);
        }
      });
    }
  }
);

export default cartsRouter;
