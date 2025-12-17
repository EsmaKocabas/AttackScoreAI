import axiosInstance from "./axiosInstance";

export const getPlayers = async () => {
  const res = await axiosInstance.get("/api/players");
  return res.data;
};

export const getPlayerById = async (id: number) => {
  const res = await axiosInstance.get(`/api/players/${id}`);
  return res.data;
};
