import apiClient from "./apiClient";

/**
 * Daftar akun baru.
 * Backend hanya menerima: email, password, fullName, phone.
 * (username & alamat TIDAK bagian dari register — alamat ditambahkan
 * terpisah setelah login lewat endpoint /user/addresses)
 */
export const registerUser = async ({ fullName, email, phone, password }) => {
  const response = await apiClient.post("/auth/register", {
    fullName,
    email,
    phone,
    password,
  });
  return response.data; // user yang baru dibuat (tanpa password)
};

/**
 * Login dan dapatkan accessToken + refreshToken.
 */
export const loginUser = async ({ email, password }) => {
  const response = await apiClient.post("/auth/login", { email, password });
  return response.data; // { user, accessToken, refreshToken }
};

export const refreshTokens = async (refreshToken) => {
  const response = await apiClient.post("/auth/refresh", { refreshToken });
  return response.data; // { accessToken, refreshToken }
};
