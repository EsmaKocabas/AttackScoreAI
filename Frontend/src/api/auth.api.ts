import axiosInstance from "./axiosInstance";


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


export const login = async (data: {
  email: string;
  sifrehash: string;
}) => {
  const response = await axiosInstance.post("/api/auth/login", {
    email: data.email,
    sifrehash: data.sifrehash,
  });

  return response.data;
};

export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get("/api/auth/users");
    return response.data;
  } catch (error) {
    console.error("Kullanıcı listesi alınamadı:", error);
    return [];
  }
};


export const updateUser = async (userId: number, data: {
  kullaniciadi?: string;
  email?: string;
  rol?: string;
  sifrehash?: string;
}) => {
  try {
    const response = await axiosInstance.put(`/api/auth/users/${userId}`, data);
    return response.data;
  } catch (error: any) {
    console.error("Kullanıcı güncellenemedi:", error);
    throw error?.response?.data?.error || error?.message || "Kullanıcı güncellenirken bir hata oluştu";
  }
};


export const deleteUser = async (userId: number) => {
  try {
    const response = await axiosInstance.delete(`/api/auth/users/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error("Kullanıcı silinemedi:", error);
    throw error?.response?.data?.error || error?.message || "Kullanıcı silinirken bir hata oluştu";
  }
};
