import ProductManager from "../ProductManager";
import { productsPath } from "../utils/utils";
import { productsImagesPath } from "../utils/utils";

const productManater = new ProductManager(productsPath);

// async function loadProducts() {
//   for (let i = 0; i < 10; i++) {
//     await productManater.addProduct(
//       `Product ${i + 1}`,
//       `This is product ${i + 1}`,
//       `p${i + 1}`,
//       100 * (i + 1),
//       10 * (i + 1),
//       `category ${i + 1}`,
//       true,
//       ["/product.jpg"]
//     );
//   }
// }

// loadProducts();
