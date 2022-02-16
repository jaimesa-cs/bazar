import * as Utils from "@contentstack/utils";
import * as contentstack from "contentstack";

import { Composition, Home, Navigation } from "@framework/types";

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
});

if (process.env.CS_CUSTOM_HOST) {
  stack.setHost(process.env.CS_CUSTOM_HOST);
}

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

//New Code
// export const getCompositionByUrl = (url: string): Promise<any> => {
//   return getComposition(url, ["content.banner.entry", "content.banner_slider.entries"], []);
// };
export const fetchComposition = <T extends Composition>(
  url: string,
  locale: string | undefined = "en-us",
  type: string,
  includes?: string[],
  jsonRteFields?: string[]
): Promise<T> => {
  // console.log("SDK");
  return new Promise<T>((resolve, reject) => {
    const query = stack.ContentType(type).Query();
    if (includes) {
      query.includeReference(includes);
    }

    query.includeOwner().toJSON();
    query.language(locale.toLowerCase() || "en-us");
    query.includeFallback();
    // console.log("QUERY", query);
    const data = query.where("url", url).find();
    data
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

        resolve(mapper().toComposition<T>(result[0][0], type));
      })
      .catch((error) => {
        console.log("Error", error);
        reject(error);
      });
  });
};
