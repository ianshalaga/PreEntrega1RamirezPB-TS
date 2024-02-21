import fs from "fs";
import {
  readDataFromJsonFileAsyncPromises,
  writeDataIntoJsonFileAsyncPromises,
  generateId,
} from "./utils/utils";

class CartProduct {
  product: number;
  quantity: number;

  constructor(product: number, quantity: number = 1) {
    if (!product) {
      throw new Error(
        "Los parámetros del constructor de CartProduct son obligatorios."
      );
    }
    this.product = product;
    this.quantity = quantity;
  }

  raiseQuantity() {
    this.quantity += 1;
  }
}

interface IdCart {
  id: number;
  products: CartProduct[];
  [key: string]: number | CartProduct[];
}

class Cart {
  products: CartProduct[];
  constructor(products: CartProduct[] = []) {
    this.products = products;
  }

  addId(id: number) {
    const idCart: IdCart = {
      id, // Equal to: id: id
      products: this.products,
    };
    return idCart;
  }
}

export class CartManager {
  path: string;
  carts: IdCart[];

  constructor(path: string, carts: IdCart[] = []) {
    this.path = path;
    this.carts = carts;
  }

  static codeBase: number = 0;

  private generateProductId(): number {
    const ids = this.carts.map((carts) => carts.id);
    return generateId(ids);
  }

  private async readCartsFromFileAsyncPromises(): Promise<void> {
    this.carts = await readDataFromJsonFileAsyncPromises(this.path);
    CartManager.codeBase = this.generateProductId();
  }

  private async writeCartsIntoFileAsyncPromises(): Promise<void> {
    writeDataIntoJsonFileAsyncPromises(this.path, this.carts);
  }

  async createCart() {
    // Read data from file
    await this.readCartsFromFileAsyncPromises();
    // Create new cart without products
    const cart = new Cart();
    // Add an id to cart and update carts array
    this.carts.push(cart.addId(++CartManager.codeBase));
    // Save carts array into file
    await this.writeCartsIntoFileAsyncPromises();
  }

  async getCartById(cid: number) {
    // Read data from file
    await this.readCartsFromFileAsyncPromises();
    const idCart = this.carts.find((cart) => cart.id === cid);
    return idCart;
  }

  async addProductToCart(cid: number, pid: number, callbackStatus: Function) {
    await this.readCartsFromFileAsyncPromises(); // Read Carts from file
    let cartFound = false; // Flag for unvalid cid
    // Search for cid in this.carts
    const carts = this.carts.map((cart) => {
      if (cart.id === cid) {
        cartFound = true; // cid found
        // When Cart is empty
        if (cart.products.length === 0) {
          cart.products.push(new CartProduct(pid));
          return cart;
        }
        let productExist = false;
        // When Cart is not empty
        const products = cart.products.map((product) => {
          // When the product have a quantity already
          if (product.product === pid) {
            productExist = true;
            const cartProduct = new CartProduct(
              product.product,
              product.quantity
            );
            cartProduct.raiseQuantity();
            product = cartProduct;
          }
          return product;
        });
        // Product doesn't exist then add
        if (!productExist) {
          products.push(new CartProduct(pid));
        }
        cart.products = products; // Update products
      }
      return cart;
    });
    // If cid not found
    if (!cartFound) {
      callbackStatus(new Error(`El carro con id ${cid} no existe.`));
      return; // Early return
    }
    this.carts = carts; // Update Carts
    await this.writeCartsIntoFileAsyncPromises(); // Write Carts into file
    callbackStatus(null);
  }

  async getCarts() {}

  async updateCart() {}

  async deleteCart() {}
}
