import QueryParams from "../interfaces/QueryParams";
import { z } from "zod";

const queryParamsSchema = z.object({
  limit: z.string().optional(),
});

function validateQueryParams(data: any): QueryParams {
  let validatedData: QueryParams = null;
  const validationResult = queryParamsSchema.safeParse(data);
  if (validationResult.success) {
    validatedData = validationResult.data;
  }
  return validatedData;
}

export default validateQueryParams;
