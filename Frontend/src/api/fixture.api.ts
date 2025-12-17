import axiosInstance from "./axiosInstance";

export const getUpcomingFixtures = async (limit = 10) => {
  const res = await axiosInstance.get(
    `/api/fixtures/external/fpl/upcoming?limit=${limit}`
  );
  return res.data;
};
