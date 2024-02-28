import { z } from "zod";

const pidSchema = z.string();

function validateId(data: any): number {
  let validatedData: number = null;
  const validationResult = pidSchema.safeParse(data);
  if (validationResult.success) {
    const dataNumber: number = parseInt(validationResult.data);
    if (!isNaN(dataNumber)) validatedData = dataNumber;
  }
  return validatedData;
}

export default validateId;
