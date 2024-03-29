import * as Utils from "@contentstack/utils";
import * as contentstack from "contentstack";

import {
  IComposition,
  IStaticComposition,
  KeyValuePair,
  staticPageIncludes,
  staticPageJsonRteFields,
} from "@framework/types";

import ContentstackLivePreview from "@contentstack/live-preview-utils";
import { LivePreviewQuery } from "contentstack";
import { addEditableTags } from "@contentstack/utils";
import { mapper } from "./mapper";

const getRegion = (region: string | undefined): contentstack.Region => {
  switch (region?.toLocaleLowerCase()) {
    case "us":
      return contentstack.Region.US;
    case "eu":
      return contentstack.Region.EU;
  }
  return contentstack.Region.US;
};

const stack = contentstack.Stack({
  api_key: process.env.NEXT_PUBLIC_CS_API_KEY || "",
  delivery_token: process.env.NEXT_PUBLIC_CS_DELIVERY_TOKEN || "",
  environment: process.env.NEXT_PUBLIC_CS_ENVIRONMENT || "",
  region: getRegion(process.env.NEXT_PUBLIC_CS_REGION),
  live_preview: {
    management_token: process.env.NEXT_PUBLIC_CS_MANAGEMENT_TOKEN || "",
    enable: true,
    host: "api.contentstack.io",
  },
});

stack.setHost("api.contentstack.io");
// stack.setProtocol("http");
// stack.setHost("localhost");
// stack.setPort(3000);

ContentstackLivePreview.init({
  enable: true,
});

// ContentstackLivePreview.init({
//   //@ts-ignore
//   stackSdk: stack,
//   debug: true,
//   clientUrlParams: {
//     host: `api.contentstack.io`,
//   },
//   stackDetails: {
//     apiKey: process.env.NEXT_PUBLIC_CS_API_KEY || "",
//     environment: process.env.NEXT_PUBLIC_CS_ENVIRONMENT || "",
//   },
//   ssr: false,
// });

export const { onEntryChange } = ContentstackLivePreview;

export const renderOption: Utils.RenderOption = {
  span: (node: Utils.Node, next: Utils.Next) => {
    return next(node.children);
  },
};

export interface IQuery {
  contentTypeUid: string;
  referenceFieldPath?: string[];
  jsonRtePath?: string[];
  entryUrl?: string;
}

export interface IQueryParameters {
  locale: string;
  type: string;
  queryParams: KeyValuePair[];
  previewQuery?: LivePreviewQuery;
  includes?: string[];
  jsonRteFields?: string[];
}

/**
 *
 * fetches all the entries from specific content-type
 * @param {* content-type uid} contentTypeUid
 * @param {* reference field name} referenceFieldPath
 * @param {* Json RTE path} jsonRtePath
 *
 */
export const getEntries = <T extends any>({
  contentTypeUid,
  referenceFieldPath,
  jsonRtePath,
}: IQuery): Promise<T[]> => {
  return new Promise<T[]>((resolve, reject) => {
    const query = stack.ContentType(contentTypeUid).Query();
    if (referenceFieldPath) query.includeReference(referenceFieldPath);
    query
      .includeOwner()
      .toJSON()
      .find()
      .then(
        (result) => {
          jsonRtePath &&
            Utils.jsonToHTML({
              entry: result,
              paths: jsonRtePath,
              renderOption,
            });
          resolve(result[0] as T[]);
        },
        (error) => {
          reject(error);
        }
      );
  });
};

export const getEntry = <T extends any>({ contentTypeUid, referenceFieldPath, jsonRtePath }: IQuery): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    const query = stack.ContentType(contentTypeUid).Query();
    if (referenceFieldPath) query.includeReference(referenceFieldPath);
    query
      .includeOwner()
      .toJSON()
      .find()
      .then(
        (result) => {
          jsonRtePath &&
            Utils.jsonToHTML({
              entry: result,
              paths: jsonRtePath,
              renderOption,
            });
          resolve(result[0][0] as T);
        },
        (error) => {
          reject(error);
        }
      );
  });
};

/**
 *fetches specific entry from a content-type
 *
 * @param {* content-type uid} contentTypeUid
 * @param {* url for entry to be fetched} entryUrl
 * @param {* reference field name} referenceFieldPath
 * @param {* Json RTE path} jsonRtePath
 * @returns
 */
export const getEntryByUrl = <T extends any>({
  contentTypeUid,
  entryUrl,
  referenceFieldPath,
  jsonRtePath,
}: IQuery): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    const blogQuery = stack.ContentType(contentTypeUid).Query();
    if (referenceFieldPath) blogQuery.includeReference(referenceFieldPath);
    blogQuery.includeOwner().toJSON();
    const data = blogQuery.where("url", `${entryUrl}`).find();
    data.then(
      (result) => {
        jsonRtePath &&
          Utils.jsonToHTML({
            entry: result,
            paths: jsonRtePath,
            renderOption,
          });
        resolve(result[0][0] as T);
      },
      (error) => {
        reject(error);
      }
    );
  });
};

export const getEntriesByUrl = <T extends any>({
  contentTypeUid,
  entryUrl,
  referenceFieldPath,
  jsonRtePath,
}: IQuery): Promise<T[]> => {
  return new Promise<T[]>((resolve, reject) => {
    const query = stack.ContentType(contentTypeUid).Query();
    if (referenceFieldPath) query.includeReference(referenceFieldPath);
    query.includeOwner().toJSON();
    const data = query.where("url", `${entryUrl}`).find();
    data.then(
      (result) => {
        jsonRtePath &&
          Utils.jsonToHTML({
            entry: result,
            paths: jsonRtePath,
            renderOption,
          });
        resolve(result[0] as T[]);
      },
      (error) => {
        reject(error);
      }
    );
  });
};

//Bazar Specific Code

//TODO: Refactor this method to move url as another query parameter, and remove url from the signature
export const fetchStaticPage = (
  locale: string,
  url: string,
  previewQuery?: LivePreviewQuery
): Promise<IStaticComposition | undefined> => {
  const query: IQueryParameters = {
    locale,
    type: "static_composition",
    queryParams: [{ key: "url", value: url }],
    previewQuery: previewQuery,
    includes: staticPageIncludes,
    jsonRteFields: staticPageJsonRteFields,
  };

  return fetchEntry<IStaticComposition>(query);
};
export const fetchEntry = <T extends IComposition>(params: IQueryParameters): Promise<T | undefined> => {
  return new Promise<T | undefined>((resolve, reject) => {
    if (params.previewQuery) {
      // console.log("Fetching entry from preview query");
      stack.livePreviewQuery(params.previewQuery);
    } else {
      stack.livePreviewQuery({} as LivePreviewQuery);
    }
    let query = stack.ContentType(params.type).Query();
    if (params.includes) {
      query.includeReference(params.includes);
    }
    query.includeOwner().toJSON();
    query.language(params.locale.toLowerCase() || "en-us");
    query.includeFallback();

    // const url = params?.queryParams?.find((param) => param.key === "url")?.value;
    // if (url) {
    //   console.log("Fetching entry from url", url);
    //   console.log("QUERY", query);
    // }

    for (let i = 0; i < params.queryParams.length; i++) {
      // console.log("QUERY PARAMS", params.queryParams[i]);
      query.where(params.queryParams[i].key, params.queryParams[i].value);
    }
    // console.log("QUERY", query);
    query
      .find()
      .then((result) => {
        // console.log("fetchComposition", result[0][0]);
        if (params.jsonRteFields) {
          Utils.jsonToHTML({
            entry: result,
            paths: params.jsonRteFields,
            renderOption,
          });
          // console.log("fetchComposition :: jsonRteFields", result[0][0]);
        }
        // console.log("DEBUG :: COMPOSITION :: ", result[0][0]);
        // if (params.previewQuery) {
        // addEditableTags(result[0][0], "static_composition", true);
        // console.log("DEBUG :: COMPOSITION :: EDITABLE TAGS", result[0][0]);
        // }
        const composition = mapper().toComposition<T>(result[0][0], params.type);
        // console.log("fetchComposition :: composition", composition);
        resolve(composition);
      })
      .catch((error) => {
        console.log("Error", error);
        reject(error);
      });
  });
};

export const fetchEntryById = async <T extends IComposition>(
  locale: string | undefined = "en-us",
  type: string,
  uid: string,
  includes?: string[],
  jsonRteFields?: string[]
): Promise<T | undefined> => {
  return new Promise<T | undefined>((resolve, reject) => {
    stack
      .ContentType(type)
      .Entry(uid)
      .includeOwner()
      .includeReference(includes || [])
      .toJSON()
      .language(locale.toLowerCase() || "en-us")
      .includeFallback()
      .fetch()
      .then((result) => {
        // console.log("fetchComposition", result[0][0]);
        if (jsonRteFields) {
          Utils.jsonToHTML({
            entry: result,
            paths: jsonRteFields,
            renderOption,
          });
          // console.log("fetchComposition :: jsonRteFields", result[0][0]);
        }
        // console.log("DEBUG :: COMPOSITION :: ", result[0][0]);
        resolve(mapper().toComposition<T>(result, type));
      })
      .catch((error) => {
        console.log("Error", error);
        reject(error);
      });
  });
};

export const getCompositionPaths = (locale: string | undefined = "en-us", type: string): Promise<any> => {
  // console.log("SDK");
  return new Promise<any>((resolve) => {
    const query = stack.ContentType(type).Query();
    query.includeOwner().toJSON();
    query.language(locale.toLowerCase() || "en-us");
    query.includeFallback();
    // console.log("QUERY", query);
    const data = query.only("BASE", "url").find();
    data
      .then((result) => {
        // console.log("fetchComposition", result[0][0]);
        resolve({
          locale: locale,
          paths: result[0].map((entry: any) => {
            return entry.url;
          }),
        });
      })
      .catch(() => {
        // console.log("Error", error);
        // reject(error);
        resolve([]);
      });
  });
};
