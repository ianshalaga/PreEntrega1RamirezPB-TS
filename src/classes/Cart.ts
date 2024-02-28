import CartProduct from "./CartProduct";
import IdCart from "../interfaces/IdCart";

class Cart {
  products: CartProduct[];
  constructor(products: CartProduct[] = []) {
    this.products = products;
  }

  addId(id: number) {
    const idCart: IdCart = {
      id, // Equal to -> id: id
      products: this.products,
    };
    return idCart;
  }
}

export default Cart;
