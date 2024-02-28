import fs from "fs";

/** READ */
export async function readDataFromJsonFileAsyncPromises<T>(
  path: string
): Promise<T> {
  try {
    const data: string = await fs.promises.readFile(path, "utf8");
    const dataParsed: T = JSON.parse(data);
    return dataParsed;
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

/** WRITE */
export async function writeDataIntoJsonFileAsyncPromises(
  path: string,
  data: object[]
): Promise<void> {
  try {
    const dataJson: string = JSON.stringify(data, null, 2);
    await fs.promises.writeFile(path, dataJson, "utf8");
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
