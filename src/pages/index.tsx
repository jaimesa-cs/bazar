import { GetStaticProps } from "next";
import HandleLoadingOrError from "@components/contentstack/handle-loading-and-error";
import HomeContentPage from "@components/content/home";
import Layout from "@components/layout/layout";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useHomeQuery } from "@framework/content/get-content";
import { useRouter } from "next/router";

export default function Home() {
  const { locale } = useRouter();
  const { data, isLoading, error } = useHomeQuery(locale);
  return (
    <HandleLoadingOrError isLoading={isLoading} error={error}>
      <HomeContentPage data={data} />
    </HandleLoadingOrError>
  );
}

Home.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ["common", "forms", "menu", "footer"])),
    },
  };
};
