import { GetServerSideProps } from "next";
import HomeContentPage from "@components/content/home";
import { IHome } from "@framework/types";
import Layout from "@components/layout/layout";
import { fetchEntry } from "@framework/utils/contentstack";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
export default function Home(props: any) {
  return <HomeContentPage data={props.data} />;
}
Home.Layout = Layout;

export const getServerSideProps: GetServerSideProps = async ({ locale, query }) => {
  const page = await fetchEntry<IHome>({
    locale: locale || "en-us",
    type: "composition",
    queryParams: [{ key: "url", value: "/" }],
    previewQuery: { live_preview: query.live_preview as string, content_type_uid: query.content_type_uid as string },
  });
  const translations = await serverSideTranslations(locale!, ["common", "forms", "menu", "footer"]);
  return {
    props: {
      data: page as IHome,
      ...translations,
    },
  };
};
