import axiosInstance from "./axiosInstance";

/**
 * REGISTER
 * Backend expects:
 * kullaniciadi, sifrehash, rol, email
 */
export const register = async (data: {
  kullaniciadi: string;
  sifrehash: string;
  email: string;
  rol?: string;
}) => {
  const response = await axiosInstance.post("/api/auth/register", {
    kullaniciadi: data.kullaniciadi,
    sifrehash: data.sifrehash, // plain password
    email: data.email,
    rol: data.rol || "user",
  });

  return response.data;
};

/**
 * LOGIN
 * Backend expects:
 * email, sifrehash
 */
export const login = async (data: {
  email: string;
  sifrehash: string;
}) => {
  const response = await axiosInstance.post("/api/auth/login", {
    email: data.email,
    sifrehash: data.sifrehash, // plain password
  });

  return response.data;
};

/**
 * (Future) ADMIN – Get all users
 * Expects backend endpoint: GET /api/auth/users
 */
export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get("/api/auth/users");
    return response.data;
  } catch (error) {
    console.error("Kullanıcı listesi alınamadı:", error);
    return [];
  }
};
