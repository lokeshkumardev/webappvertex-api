export const generateResponse = (
  status: string,
  message: string,
  data?: any,
) => {
  return {
    status,
    message,
    data,
  };
};
