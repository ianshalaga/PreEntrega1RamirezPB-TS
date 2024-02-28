import CartProduct from "../classes/CartProduct";

interface IdCart {
  id: number;
  products: CartProduct[];
  [key: string]: number | CartProduct[];
}

export default IdCart;
