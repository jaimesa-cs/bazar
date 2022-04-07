import { Composition, Home, IBanner, KeyValuePair, Navigation } from "@framework/types";

import { fetchEntry } from "@framework/utils/contentstack";
import http from "@framework/utils/http";
import { mapper } from "@framework/utils/mapper";
import { useQuery } from "react-query";

// Axios
export const fetchCompositionRaw = async <T extends Composition>(
  _url: string,
  _locale: string,
  _query: KeyValuePair[],
  _type: string,
  _includes?: string[]
) => {
  let url = `https://cdn.contentstack.io/v3/content_types/${_type}/entries?environment=development&include_fallback=true&locale=${_locale.toLowerCase()}&query={"url": "${_url}"}`;
  //TODO: Add _query params
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
  locale: string | undefined = "en-us",
  query: KeyValuePair[],
  includes?: string[],
  jsonRteFields?: string[]
) => {
  //SDK
  return useQuery<T | undefined, Error>([query, includes, jsonRteFields], () =>
    fetchEntry<T>(locale.toLowerCase(), "composition", query, includes, jsonRteFields)
  );
  //Raw
  // return useQuery<Composition, Error>([url, includes], () => fetchCompositionRaw(url, locale, "composition", includes));
};

export const useCompositionQuery = <T extends Composition>(
  locale: string | undefined = "en-us",
  type: string,
  query: KeyValuePair[],
  includes?: string[],
  jsonRteFields?: string[]
) => {
  //SDK
  return useQuery<T | undefined, Error>([locale, includes, jsonRteFields], () =>
    fetchEntry<T>(locale, type, query, includes, jsonRteFields)
  );
  //Raw
  // return useQuery<Composition, Error>([url, includes], () => fetchCompositionRaw<T>(url, locale, type, includes));
};

export const useHomeQuery = (locale: string | undefined = "en-us") => {
  return useQuery<Home | undefined, Error>(["/", locale], () =>
    fetchEntry<Home>(locale, "composition", [{ key: "url", value: "/" }])
  );
};

export const useNavigationQuery = (key: string = "/navigation", locale: string | undefined = "en-us") => {
  return useQuery<Navigation | undefined, Error>([key, locale], () =>
    fetchEntry<Navigation>(
      locale,
      "navigation",
      [{ key: "url", value: "/navigation" }],
      ["links.category", "links.category.categories", "links.category.categories.categories"]
    )
  );
};
