import fs from "fs";
import {
  readDataFromJsonFileAsyncPromises,
  writeDataIntoJsonFileAsyncPromises,
  generateId,
} from "./utils/utils";

export interface IdProduct {
  id: number;
  title: string;
  description: string;
  code: string;
  price: number;
  stock: number;
  category: string;
  status: boolean;
  thumbnail: string[];
  [key: string]: string | string[] | number | boolean; // to access with obj[field] form
}

// ? Optional properties
interface updateProduct {
  title?: string;
  description?: string;
  code?: string;
  price?: number;
  stock?: number;
  category?: string;
  status?: boolean;
  thumbnail?: string[];
  [key: string]: string | string[] | number | boolean; // to access with obj[field] form
}

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

class ProductManager {
  path: string;
  products: IdProduct[];

  constructor(path: string, products: IdProduct[] = []) {
    this.path = path;
    this.products = products;
  }

  static codeBase: number = 0;

  private generateProductId(): number {
    const ids = this.products.map((product) => product.id);
    return generateId(ids);
  }

  private async readProductsFromFileAsyncPromises(): Promise<void> {
    this.products = await readDataFromJsonFileAsyncPromises(this.path);
    ProductManager.codeBase = this.generateProductId();
  }

  private async writeProductsIntoFileAsyncPromises(): Promise<void> {
    writeDataIntoJsonFileAsyncPromises(this.path, this.products);
  }

  async addProduct(productObj: Product, callbackStatus: Function) {
    // Read data from file
    await this.readProductsFromFileAsyncPromises();
    // Check for repeated code
    if (this.products.some((element) => productObj.code === element.code)) {
      callbackStatus(
        new Error(
          "El código del producto que está intentando agregar ya existe. Utilice otro código."
        )
      );
      return; // Early return
    }
    // Create new product
    const product = new Product(
      productObj.title,
      productObj.description,
      productObj.code,
      productObj.price,
      productObj.stock,
      productObj.category,
      productObj.status,
      productObj.thumbnail
    );
    this.products.push(product.addId(++ProductManager.codeBase)); // Add an id to product and update products array
    await this.writeProductsIntoFileAsyncPromises(); // Save products array into file
    callbackStatus(null); // No errors
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
    return idProduct;
  }

  async updateProduct(
    id: number,
    updateObj: updateProduct,
    callbackStatus: Function
  ): Promise<void> {
    let idField = false;
    // Don't touch the id field
    Object.keys(updateObj).forEach((key) => {
      if (key === "id") {
        callbackStatus(new Error("Está intentando modificar el campo id."));
        idField = true;
        return; // Break
      }
    });
    if (idField) return; // Early return
    await this.readProductsFromFileAsyncPromises(); // Load products from file
    let existProduct = false;
    let errorField = null;
    const productsUpdated = this.products.map((product) => {
      if (product.id === id) {
        Object.keys(updateObj).forEach((key) => {
          if (key in product) {
            // The key exists in product
            product[key] = updateObj[key];
          } else {
            // The key doesn't exist in product
            errorField = new Error(
              `Los productos no cuentan con el campo: ${key}.`
            );
            // callbackStatus(
            //   new Error(`Los productos no cuentan con el campo: ${key}.`)
            // );
          }
        });
        existProduct = true;
      }
      return product;
    });
    // Some field was not found
    if (errorField) {
      callbackStatus(errorField);
      return; // Early return
    }
    // Id not found
    if (!existProduct) {
      callbackStatus(
        new Error(`El producto con id igual a ${id} no fue encontrado.`)
      );
      return; // Early return
    }
    this.products = productsUpdated;
    await this.writeProductsIntoFileAsyncPromises(); // Save products into file
    callbackStatus(null);
  }

  async deleteProduct(id: number, callbackStatus: Function): Promise<void> {
    await this.readProductsFromFileAsyncPromises(); // Load products from file
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
      callbackStatus(
        new Error(`El producto con id igual a ${id} no fue encontrado.`)
      );
      return; // Early return
    }
    this.products = productsUpdated;
    await this.writeProductsIntoFileAsyncPromises(); // Save products into file
    callbackStatus(null);
  }
}

export default ProductManager;
