import apiClient from "./client";

// Registers a new customer in the backend.
// Expects payload shape:
// {
//   fullName: string,
//   email: string,
//   password: string
// }
export const registerCustomer = async (customerData) => {
  const response = await apiClient.post("/customers/register", customerData);
  return response.data;
};

