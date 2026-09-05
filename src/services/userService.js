import apiClient from "./apiClient";

/** GET /user/profile — profil user yang sedang login */
export const getProfile = async () => {
  const response = await apiClient.get("/user/profile");
  return response.data;
};

/** PATCH /user/profile — update profil (fullName, phone) */
export const updateProfile = async (payload) => {
  const response = await apiClient.patch("/user/profile", payload);
  return response.data;
};

/** GET /user/addresses — semua alamat milik user */
export const getAddresses = async () => {
  const response = await apiClient.get("/user/addresses");
  return response.data;
};

/** POST /user/addresses — tambah alamat baru */
export const addAddress = async (payload) => {
  const response = await apiClient.post("/user/addresses", payload);
  return response.data;
};

/** PATCH /user/addresses/:id — update alamat */
export const updateAddress = async (id, payload) => {
  const response = await apiClient.patch(`/user/addresses/${id}`, payload);
  return response.data;
};

/** DELETE /user/addresses/:id — hapus alamat */
export const deleteAddress = async (id) => {
  const response = await apiClient.delete(`/user/addresses/${id}`);
  return response.data;
};

/** PATCH /user/addresses/:id/primary — set alamat utama */
export const setPrimaryAddress = async (id) => {
  const response = await apiClient.patch(`/user/addresses/${id}/primary`);
  return response.data;
};
