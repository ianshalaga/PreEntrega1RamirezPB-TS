export const successStatus = {
  status: "SUCCESS",
};

export function failureStatus(message: string) {
  return {
    status: "FAILURE",
    message,
  };
}
