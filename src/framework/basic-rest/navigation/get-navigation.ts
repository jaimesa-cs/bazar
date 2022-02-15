import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import { Navigation } from "@framework/types";
import { getNavigation } from "@framework/utils/contentstack";
import http from "@framework/utils/http";
import { useQuery } from "react-query";

//Sdk
export const fetchNavigation = async () => {
  return getNavigation();
};

// Axios
export const fetchNavigationRaw = async (_id: string) => {
  const { data } = await http.get(`${API_ENDPOINTS.BANNER}`);
  return data;
};
export const useNavQuery = () => {
  return useQuery<Navigation, Error>([], () => fetchNavigation());
};
