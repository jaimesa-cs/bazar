import { IComposition, IHome, KeyValuePair, Navigation, navigationIncludes } from "@framework/types";

import { fetchEntry } from "@framework/utils/contentstack";
import http from "@framework/utils/http";
import { mapper } from "@framework/utils/mapper";
import { useQuery } from "react-query";
import useSWR from "swr";

// Axios
export const fetchCompositionRaw = async <T extends IComposition>(
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
export const useDefaultCompositionQuery = <T extends IComposition>(
  locale: string | undefined = "en-us",
  query: KeyValuePair[],
  includes?: string[],
  jsonRteFields?: string[]
) => {
  //SDK
  return useQuery<T | undefined, Error>([query, includes, jsonRteFields], () =>
    fetchEntry<T>({ locale: locale.toLowerCase(), type: "composition", queryParams: query, includes, jsonRteFields })
  );
  //Raw
  // return useQuery<Composition, Error>([url, includes], () => fetchCompositionRaw(url, locale, "composition", includes));
};

export const useCompositionQuery = <T extends IComposition>(
  locale: string | undefined = "en-us",
  type: string,
  query: KeyValuePair[],
  includes?: string[],
  jsonRteFields?: string[]
) => {
  //SDK
  return useQuery<T | undefined, Error>([locale, includes, jsonRteFields], () =>
    fetchEntry<T>({ locale, type, queryParams: query, includes, jsonRteFields })
  );
  //Raw
  // return useQuery<Composition, Error>([url, includes], () => fetchCompositionRaw<T>(url, locale, type, includes));
};

export const useHomeQuery = (locale: string | undefined = "en-us") => {
  console.log("useHomeQuery", "/", locale);
  return useQuery<IHome | undefined, Error>(["/", locale], () =>
    fetchEntry<IHome>({ locale, type: "composition", queryParams: [{ key: "url", value: "/" }] })
  );
};

export const useNavigationQuery = (locale: string = "en-us") => {
  const key = ["/navigation", locale];

  const { data, error } = useSWR<Navigation | undefined, Error>(key, () =>
    fetchEntry<Navigation>({
      locale,
      type: "navigation",
      queryParams: [{ key: "url", value: "/navigation" }],
      includes: navigationIncludes,
    })
  );
  return {
    data: data || ({} as Navigation),
    isLoading: !error && !data,
    isError: error,
    error: error || null,
  };
  // console.log(key);
  // return useQuery<Navigation | undefined, Error>(
  //   key,
  //   () =>
  //     fetchEntry<Navigation>({
  //       locale,
  //       type: "navigation",
  //       queryParams: [{ key: "url", value: "/navigation" }],
  //       includes: navigationIncludes,
  //     }),
  //   {
  //     suspense: true,
  //   }
  // );
};
