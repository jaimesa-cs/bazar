import { Composition, Home, Navigation } from "@framework/types";

import { fetchComposition } from "@framework/utils/contentstack";
import http from "@framework/utils/http";
import { mapper } from "@framework/utils/mapper";
import { useQuery } from "react-query";

// Axios
export const fetchCompositionRaw = async <T extends Composition>(_url: string, _type: string, _includes?: string[]) => {
  console.log("RAW");
  let url = `https://cdn.contentstack.io/v3/content_types/${_type}/entries?environment=development&query={"url": "${_url}"}`;
  if (_includes) {
    let include = "";
    _includes.map((i) => {
      include = `${include}&include[]=${i}`;
      return i;
    });
    url = `${url}${include}`;
  }

  const { data } = await http.get(`${url}`);
  // console.log(data.entries[0]);
  return mapper().toComposition(data.entries[0], _type) as T;
};
export const useDefaultCompositionQuery = <T extends Composition>(
  url: string,
  includes?: string[],
  jsonRteFields?: string[]
) => {
  //SDK
  return useQuery<T, Error>([url, includes, jsonRteFields], () =>
    fetchComposition<T>(url, "composition", includes, jsonRteFields)
  );
  //Raw
  // return useQuery<Composition, Error>([url, includes], () => fetchCompositionRaw(url, "composition", includes));
};

export const useCompositionQuery = <T extends Composition>(
  url: string,
  type: string,
  includes?: string[],
  jsonRteFields?: string[]
) => {
  //SDK
  return useQuery<T, Error>([url, includes, jsonRteFields], () =>
    fetchComposition<T>(url, type, includes, jsonRteFields)
  );
  //Raw
  // return useQuery<Composition, Error>([url, includes], () => fetchCompositionRaw<T>(url, type, includes));
};

export const useHomeQuery = (key: string = "/") => {
  return useQuery<Home, Error>([key], () => fetchComposition<Home>("/", "composition", []));
};

export const useNavigationQuery = (key: string = "/navigation") => {
  return useQuery<Navigation, Error>([key], () =>
    fetchComposition<Navigation>("/navigation", "navigation", [
      "links.category",
      "links.category.categories",
      "links.category.categories.categories",
    ])
  );
};
