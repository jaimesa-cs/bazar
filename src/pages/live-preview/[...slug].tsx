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
  const page = await fetchEntry<IStaticComposition>({
    locale: locale || "en-us",
    type: "static_composition",
    queryParams: [{ key: "url", value: slug }],
    previewQuery: { live_preview: query.live_preview as string, content_type_uid: query.content_type_uid as string },
    includes: staticPageIncludes,
    jsonRteFields: staticPageJsonRteFields,
  });
  const translations = await serverSideTranslations(locale!, ["common", "forms", "menu", "faq", "footer"]);
  return {
    props: {
      data: page,
      path: slug,
      ...translations,
    },
  };
};
