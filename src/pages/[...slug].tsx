import { GetStaticPaths, GetStaticProps } from "next";
import { IStaticComposition, staticPageIncludes, staticPageJsonRteFields } from "@framework/types";
import { fetchEntry, getCompositionPaths } from "@framework/utils/contentstack";

import Layout from "@components/layout/layout";
import StaticContentPage from "@components/content/static-page";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function StaticPage(props: any) {
  return <StaticContentPage {...props} />;
}

StaticPage.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale, locales, defaultLocale, ...props }) => {
  // console.log("PROPS", props);
  const arr = props?.params?.slug as [];
  let path = `/${arr.join("/")}`;
  if (locale !== defaultLocale) {
    path = `/${locale}${path}`;
  }

  // We remove the locale from the url, in constenstack we don't use the locale in the url
  if (locales?.some((l) => path.startsWith(`/${l}/`))) {
    path = path.replace(`/${locale}`, "");
  }
  console.log("PATH", path);
  return fetchEntry<IStaticComposition>({
    locale: locale || "en-us",
    type: "static_composition",
    queryParams: [{ key: "url", value: path }],
    includes: staticPageIncludes,
    jsonRteFields: staticPageJsonRteFields,
  })
    .then((page) => {
      console.log("PAGE", page);
      return {
        props: {
          data: page,
          path,
          ...serverSideTranslations(locale!, ["common", "forms", "menu", "faq", "footer"]),
        },
        revalidate: 10, // In seconds,
      };
    })
    .catch((err) => {
      console.log("ERROR [...slug]", err);
      return {
        props: {
          data: null,
          path,
          ...serverSideTranslations(locale!, ["common", "forms", "menu", "faq", "footer"]),
        },
      };
    });
};

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  // console.log("LOCALES", locales);

  const validLocales = locales ?? [];
  return Promise.all(validLocales.map((locale) => getCompositionPaths(locale, "static_composition"))).then((urls) => {
    const paths: any = [];
    urls.flat().map((l) => {
      l.paths.map((p: string) => {
        const param = {
          params: {
            slug: p.split("/").slice(1),
          },
          locale: l.locale,
        };
        paths.push(param);
      });
    });
    // console.log("PATHS", paths);
    return {
      paths: paths,
      fallback: "blocking",
    };
  });
};
