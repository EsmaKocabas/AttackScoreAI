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

// 🆕 YENİ: Manuel prediction API fonksiyonu eklendi
export const predictManual = async (data: {
  mac: number;
  dakika: number;
  xg: number;
  sut90: number;
  isabetliSut90: number;
  oyuncuAdi?: string;
  oyuncuId?: number; 
}) => {
  const res = await axiosInstance.post("/api/predictions/manual", data);
  return res.data;
};