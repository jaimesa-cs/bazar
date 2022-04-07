import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import { IBanner } from "@framework/types";
import http from "@framework/utils/http";
import { useQuery } from "react-query";

export const fetchBanner = async (_id: string) => {
  const { data } = await http.get(`${API_ENDPOINTS.BANNER}`);
  return data;
};
export const useBannerQuery = (id: string) => {
  return useQuery<IBanner, Error>([API_ENDPOINTS.BANNER, id], () => fetchBanner(id));
};
