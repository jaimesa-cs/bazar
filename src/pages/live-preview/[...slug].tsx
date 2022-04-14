import { IStaticComposition, staticPageIncludes, staticPageJsonRteFields } from "@framework/types";
import { fetchEntry, fetchStaticPage } from "@framework/utils/contentstack";

import { GetServerSideProps } from "next";
import Layout from "@components/layout/layout";
import StaticContentPage from "@components/content/static-page";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function StaticPage(props: any) {
  // console.log("PREVIEW: PAGE PROPS", props);
  return <StaticContentPage {...props} />;
}

StaticPage.Layout = Layout;

export const getServerSideProps: GetServerSideProps = async ({ locale, query }) => {
  let { slug } = query;
  slug = `/${slug}`.split(",").join("/");
  const page = await fetchStaticPage(locale || "en-us", slug, {
    live_preview: query.live_preview as string,
    content_type_uid: query.content_type_uid as string,
  });
  return {
    props: {
      data: page,
      path: slug,
      ...(await serverSideTranslations(locale!, ["common", "forms", "menu", "faq", "footer"])),
    },
  };
};
