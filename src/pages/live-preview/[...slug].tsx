import { IStaticComposition, staticPageIncludes, staticPageJsonRteFields } from "@framework/types";

import { GetServerSideProps } from "next";
import Layout from "@components/layout/layout";
import StaticContentPage from "@components/content/static-page";
import { fetchEntry } from "@framework/utils/contentstack";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function StaticPage(props: any) {
  return <StaticContentPage {...props} />;
}

StaticPage.Layout = Layout;

export const getServerSideProps: GetServerSideProps = async ({ locale, query }) => {
  let { slug } = query;
  slug = `/${slug}`.split(",").join("/");
  console.log("CONTEXT", slug);
  //   console.log("LOCALE", locale);
  const page = await fetchEntry<IStaticComposition>({
    locale: locale || "en-us",
    type: "static_composition",
    queryParams: [{ key: "url", value: slug }],
    includes: staticPageIncludes,
    jsonRteFields: staticPageJsonRteFields,
  });
  //   console.log("PAGE", page);
  const translations = await serverSideTranslations(locale!, ["common", "forms", "menu", "faq", "footer"]);
  return {
    props: {
      data: page,
      path: slug,
      ...translations,
    },
  };
};
