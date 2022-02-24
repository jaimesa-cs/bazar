import ErrorInformation from "@components/404/error-information";
import { GetStaticProps } from "next";
import Layout from "@components/layout/layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function ErrorPage() {
  return <ErrorInformation />;
}

ErrorPage.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...serverSideTranslations(locale!, ["common", "forms", "menu", "footer"]),
    },
  };
};
