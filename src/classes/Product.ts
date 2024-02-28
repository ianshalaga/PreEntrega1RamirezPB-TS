import IdProduct from "../interfaces/idProduct";

class Product {
  title: string;
  description: string;
  code: string;
  price: number;
  stock: number;
  category: string;
  status: boolean;
  thumbnail: string[];

  constructor(
    title: string,
    description: string,
    code: string,
    price: number,
    stock: number,
    category: string,
    status: boolean = true,
    thumbnail: string[] = []
  ) {
    if (
      !(title && description && code && price && stock && category && status)
    ) {
      throw new Error(
        "Los parámetros del constructor de Product son obligatorios."
      );
    }

    this.title = title;
    this.description = description;
    this.price = price;
    this.code = code;
    this.stock = stock;
    this.category = category;
    this.status = status;
    this.thumbnail = thumbnail;
  }

  addId(id: number) {
    const idProduct: IdProduct = {
      id, // Equal to: id: id
      title: this.title,
      description: this.description,
      code: this.code,
      price: this.price,
      stock: this.stock,
      category: this.category,
      status: this.status,
      thumbnail: this.thumbnail,
    };
    return idProduct;
  }
}

export default Product;
