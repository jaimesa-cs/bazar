import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import { QueryOptionsType } from "@framework/types";
import http from "@framework/utils/http";
import { useQuery } from "react-query";

export const fetchFlashSaleProducts = async ({ queryKey }: any) => {
  const [_key, _params] = queryKey;

  const { data } = await http.get(API_ENDPOINTS.FLASH_SALE_PRODUCTS);
  if (_params.category && _params.category !== "all") {
    return {
      ...data,
      productFlashSellGridTwo: [...data.productFlashSellGridTwo.filter((p: any) => p.categoryAB === _params.category)],
    };
  }
  console.log("data", data);
  return data;
};
export const useFlashSaleProductsQuery = (options: QueryOptionsType): any => {
  return useQuery<any, Error>([API_ENDPOINTS.FLASH_SALE_PRODUCTS, options], fetchFlashSaleProducts);
};
