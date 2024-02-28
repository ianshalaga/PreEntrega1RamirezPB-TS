import UpdateProduct from "../interfaces/UpdateProduct";
import { z } from "zod";

const updateProductSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  code: z.string().optional(),
  price: z.number().optional(),
  stock: z.number().optional(),
  category: z.string().optional(),
  status: z.boolean().optional(),
  thumbnail: z.string().array().optional(),
});

function validateUpdateProduct(data: any): UpdateProduct {
  let validatedData: UpdateProduct = null;
  const validationResult = updateProductSchema.safeParse(data);
  if (validationResult.success) {
    if (!(Object.keys(validationResult.data).length === 0))
      validatedData = validationResult.data;
  }
  return validatedData;
}

export default validateUpdateProduct;
