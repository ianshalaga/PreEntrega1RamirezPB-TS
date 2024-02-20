import fs from "fs";

// interface cartProduct {
//   product: number;
//   quantity: number;
//   [key: string]: number;
// }

class CartProduct {
  product: number;
  quantity: number;

  constructor(product: number, quantity: number = 0) {
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
    // if (!products) {
    //   throw new Error(
    //     "Los parámetros del constructor de Cart son obligatorios."
    //   );
    // }

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

  private generateId(): number {
    let maxId = 0;
    const ids = this.carts.map((cart) => cart.id);
    if (ids.length !== 0) maxId = Math.max(...ids);
    return maxId;
  }

  private async readCartsFromFileAsyncPromises(): Promise<void> {
    try {
      const data = await fs.promises.readFile(this.path, "utf8");
      this.carts = JSON.parse(data);
      CartManager.codeBase = this.generateId();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Error al cargar los carros desde el archivo: ${error.message}`
        );
      } else {
        throw error;
      }
    }
  }

  private async writeCartsIntoFileAsyncPromises(): Promise<void> {
    try {
      const cartsJson = JSON.stringify(this.carts, null, 2);
      await fs.promises.writeFile(this.path, cartsJson, "utf8");
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Error al guardar carros en el archivo: ${error.message}`
        );
      } else {
        throw error;
      }
    }
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
    // Read Carts from file
    await this.readCartsFromFileAsyncPromises();
    // Flag for unvalid cid
    let cartFound = false;
    // Search for cid in this.carts
    const carts = this.carts.map((cart) => {
      if (cart.id === cid) {
        cartFound = true; // cid found
        // When Cart is empty
        if (cart.products.length === 0) {
          cart.products.push(new CartProduct(pid));
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
    } else {
      callbackStatus(null);
    }
    // Update Carts
    this.carts = carts;
    // Write Carts into file
    await this.writeCartsIntoFileAsyncPromises();
  }

  async getCarts() {}

  async updateCart() {}

  async deleteCart() {}
}
