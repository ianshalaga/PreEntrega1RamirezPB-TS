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

  raiseQuantity(): void {
    this.quantity += 1;
  }
}

export default CartProduct;
