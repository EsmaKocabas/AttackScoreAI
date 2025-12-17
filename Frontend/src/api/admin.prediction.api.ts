import axiosInstance from "./axiosInstance";

export const getAllPredictionsForAdmin = async () => {
  const res = await axiosInstance.get(
    "/api/predictions/admin/all"
  );
  return res.data;
};
