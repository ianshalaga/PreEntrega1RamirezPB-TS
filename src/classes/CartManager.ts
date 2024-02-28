import { generateId } from "../utils/functions";
import Cart from "./Cart";
import IdCart from "../interfaces/IdCart";
import CartProduct from "./CartProduct";
import {
  readDataFromJsonFileAsyncPromises,
  writeDataIntoJsonFileAsyncPromises,
} from "../utils/files";

export class CartManager {
  path: string;
  carts: IdCart[];

  constructor(path: string, carts: IdCart[] = []) {
    this.path = path;
    this.carts = carts;
  }

  static codeBase: number = 0;

  private generateProductId(): number {
    const ids: number[] = this.carts.map((carts: IdCart) => carts.id);
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
    await this.readCartsFromFileAsyncPromises();
    const cart: Cart = new Cart();
    this.carts.push(cart.addId(++CartManager.codeBase));
    await this.writeCartsIntoFileAsyncPromises();
  }

  async getCartById(cid: number) {
    await this.readCartsFromFileAsyncPromises();
    const idCart: IdCart = this.carts.find((cart: IdCart) => cart.id === cid);
    return idCart;
  }

  async addProductToCart(cid: number, pid: number, callbackStatus: Function) {
    await this.readCartsFromFileAsyncPromises();
    let cartFound: boolean = false;
    const carts: IdCart[] = this.carts.map((cart: IdCart) => {
      if (cart.id === cid) {
        cartFound = true;
        if (cart.products.length === 0) {
          cart.products.push(new CartProduct(pid));
          return cart;
        }
        let productExist = false;
        const products: CartProduct[] = cart.products.map(
          (product: CartProduct) => {
            if (product.product === pid) {
              productExist = true;
              const cartProduct: CartProduct = new CartProduct(
                product.product,
                product.quantity
              );
              cartProduct.raiseQuantity();
              product = cartProduct;
            }
            return product;
          }
        );
        if (!productExist) {
          products.push(new CartProduct(pid));
        }
        cart.products = products;
      }
      return cart;
    });
    if (!cartFound) {
      callbackStatus(new Error(`El carro con id ${cid} no existe.`));
      return;
    }
    this.carts = carts;
    await this.writeCartsIntoFileAsyncPromises();
    callbackStatus(null);
  }

  async getCarts() {}

  async updateCart() {}

  async deleteCart() {}
}
