import fs from "fs";

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
    status: boolean,
    thumbnail: string[]
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
      return;
    } else {
      callbackStatus(null);
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
        idField = true;
        callbackStatus(new Error("Está intentando modificar el campo id."));
      }
    });

    if (idField) return;

    // Load products from file
    await this.readProductsFromFileAsyncPromises();

    let existProduct = false;

    const productsUpdated = this.products.map((product) => {
      if (product.id === id) {
        Object.keys(updateObj).forEach((key) => {
          if (key in product) {
            // The key exists in product
            product[key] = updateObj[key];
          } else {
            // The key doesn't exist in product
            callbackStatus(
              new Error(`Los productos no cuentan con el campo: ${key}.`)
            );
          }
        });
        existProduct = true;
      }
      return product;
    });

    // Id not found
    if (!existProduct) {
      callbackStatus(
        new Error(`El producto con id igual a ${id} no fue encontrado.`)
      );
    } else {
      callbackStatus(null);
    }

    this.products = productsUpdated;

    // Save products into file
    await this.writeProductsIntoFileAsyncPromises();
  }

  async deleteProduct(id: number, callbackStatus: Function): Promise<void> {
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
      callbackStatus(
        new Error(`El producto con id igual a ${id} no fue encontrado.`)
      );
    } else {
      callbackStatus(null);
    }

    this.products = productsUpdated;

    // Save products into file
    await this.writeProductsIntoFileAsyncPromises();
  }
}

export default ProductManager;
