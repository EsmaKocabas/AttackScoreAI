import axiosInstance from "./axiosInstance";

export const getAllPredictionsForAdmin = async () => {
  const res = await axiosInstance.get("/api/predictions/admin/all");

  // Backend response shape:
  // { success: boolean, count: number, data: Prediction[] }
  return res.data?.data ?? [];
};
