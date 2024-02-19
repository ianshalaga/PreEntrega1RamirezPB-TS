// import fs from "fs";
import * as fs from "fs";

interface IdProduct {
  id: number;
  code: string;
  title: string;
  description: string;
  price: string;
  thumbnail: string;
  stock: string;
  [key: string]: string | number; // to access with obj[field] form
}

class Product {
  code: string;
  title: string;
  description: string;
  price: string;
  thumbnail: string;
  stock: string;

  constructor(
    code: string,
    title: string,
    description: string,
    price: string,
    thumbnail: string,
    stock: string
  ) {
    if (!(code && title && description && price && thumbnail && stock)) {
      throw new Error(
        "Los parámetros del constructor de Product son obligatorios."
      );
    }

    this.code = code;
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.stock = stock;
  }

  addId(id: number) {
    const idProduct: IdProduct = {
      id, // Equal to: id: id
      code: this.code,
      title: this.title,
      description: this.description,
      price: this.price,
      thumbnail: this.thumbnail,
      stock: this.stock,
    };
    return idProduct;
  }
}

class ProductManager {
  path: string;
  products: IdProduct[];

  constructor(path: string, products: IdProduct[] = []) {
    this.path = path;
    this.products = products;
  }

  static codeBase: number = 0;

  private generateId(): number {
    let maxId = 0;

    const ids = this.products.map((product) => product.id);

    if (ids.length !== 0) maxId = Math.max(...ids);

    return maxId;
  }

  private async readProductsFromFileAsyncPromises(): Promise<void> {
    try {
      const data = await fs.promises.readFile(this.path, "utf8");
      this.products = JSON.parse(data);
      ProductManager.codeBase = this.generateId();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Error al cargar los productos desde el archivo: ${error.message}`
        );
      } else {
        throw error;
      }
    }
  }

  private async writeProductsIntoFileAsyncPromises(): Promise<void> {
    try {
      const productsJson = JSON.stringify(this.products, null, 2);
      await fs.promises.writeFile(this.path, productsJson, "utf8");
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Error al guardar productos en el archivo: ${error.message}`
        );
      } else {
        throw error;
      }
    }
  }

  async addProduct(
    code: string,
    title: string,
    description: string,
    price: string,
    thumbnail: string,
    stock: string
  ) {
    // Check for repeated code
    if (this.products.some((element) => code === element.code)) {
      throw new Error(
        "El código del producto que está intentando agregar ya existe. Utilice otro código."
      );
    }

    // Read data from file
    await this.readProductsFromFileAsyncPromises();

    // Create new product
    const product = new Product(
      code,
      title,
      description,
      price,
      thumbnail,
      stock
    );

    // Add an id to product and update products array
    this.products.push(product.addId(++ProductManager.codeBase));

    // Save products array into file
    await this.writeProductsIntoFileAsyncPromises();
  }

  async getProducts(): Promise<IdProduct[]> {
    // Load produts from file
    await this.readProductsFromFileAsyncPromises();

    return this.products;
  }

  async getProductById(id: number) {
    // Load product from file
    await this.readProductsFromFileAsyncPromises();

    const idProduct = this.products.find((product) => product.id === id);

    // if (idProduct) {
    //     return idProduct
    // } else {
    //     throw new Error(`Producto con id ${id} no encontrado.`)
    // }
    return idProduct;
  }

  async updateProduct(id: number, field: string, value: string): Promise<void> {
    // Load products from file
    await this.readProductsFromFileAsyncPromises();

    let existProduct = false;

    const productsUpdated = this.products.map((product) => {
      if (product.id === id) {
        if (field in product) {
          product[field] = value;
          existProduct = true;
        } else {
          throw new Error(`Los productos no cuentan con el campo ${field}.`);
        }
      }
      return product;
    });

    if (!existProduct) {
      throw new Error(`El producto con id igual a ${id} no fue encontrado.`);
    }

    this.products = productsUpdated;

    // Save products into file
    await this.writeProductsIntoFileAsyncPromises();
  }

  async deleteProduct(id: number): Promise<void> {
    // Load products from file
    await this.readProductsFromFileAsyncPromises();

    const productsUpdated: IdProduct[] = [];
    let existProduct = false;

    this.products.forEach((product) => {
      if (product.id !== id) {
        productsUpdated.push(product);
      } else {
        existProduct = true;
      }
    });

    if (!existProduct) {
      throw new Error(`El producto con id igual a ${id} no fue encontrado.`);
    }

    this.products = productsUpdated;

    // Save products into file
    await this.writeProductsIntoFileAsyncPromises();
  }
}

export default ProductManager;
