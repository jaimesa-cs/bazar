import { Composition, Home, Navigation } from "@framework/types";

import { fetchComposition } from "@framework/utils/contentstack";
import http from "@framework/utils/http";
import { mapper } from "@framework/utils/mapper";
import { useQuery } from "react-query";

// Axios
export const fetchCompositionRaw = async <T extends Composition>(
  _url: string,
  _locale: string,
  _type: string,
  _includes?: string[]
) => {
  let url = `https://cdn.contentstack.io/v3/content_types/${_type}/entries?environment=development&include_fallback=true&locale=${_locale.toLowerCase()}&query={"url": "${_url}"}`;
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
  locale: string | undefined = "en-us",
  includes?: string[],
  jsonRteFields?: string[]
) => {
  //SDK
  return useQuery<T | null, Error>([url, includes, jsonRteFields], () =>
    fetchComposition<T>(url, locale.toLowerCase(), "composition", includes, jsonRteFields)
  );
  //Raw
  // return useQuery<Composition, Error>([url, includes], () => fetchCompositionRaw(url, locale, "composition", includes));
};

export const useCompositionQuery = <T extends Composition>(
  url: string,
  locale: string | undefined = "en-us",
  type: string,
  includes?: string[],
  jsonRteFields?: string[]
) => {
  //SDK
  return useQuery<T | null, Error>([url, locale, includes, jsonRteFields], () =>
    fetchComposition<T>(url, locale, type, includes, jsonRteFields)
  );
  //Raw
  // return useQuery<Composition, Error>([url, includes], () => fetchCompositionRaw<T>(url, locale, type, includes));
};

export const useHomeQuery = (locale: string | undefined = "en-us") => {
  return useQuery<Home | null, Error>(["/", locale], () => fetchComposition<Home>("/", locale, "composition", []));
};

export const useNavigationQuery = (key: string = "/navigation", locale: string | undefined = "en-us") => {
  return useQuery<Navigation | null, Error>([key, locale], () =>
    fetchComposition<Navigation>("/navigation", locale, "navigation", [
      "links.category",
      "links.category.categories",
      "links.category.categories.categories",
    ])
  );
};
