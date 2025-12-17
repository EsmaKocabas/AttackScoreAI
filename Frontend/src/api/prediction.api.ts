import axiosInstance from "./axiosInstance";

export const getPredictionForPlayer = async (playerId: number) => {
  const res = await axiosInstance.get(
    `/api/predictions/player/${playerId}`
  );
  return res.data;
};

export const getPredictionHistoryForPlayer = async (playerId: number) => {
  const res = await axiosInstance.get(
    `/api/predictions/history/player/${playerId}`
  );
  return res.data;
};
