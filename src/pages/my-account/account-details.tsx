import AccountDetails from "@components/my-account/account-details";
import AccountLayout from "@components/my-account/account-layout";
import { GetStaticProps } from "next";
import Layout from "@components/layout/layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function AccountDetailsPage() {
  return (
    <AccountLayout>
      <AccountDetails />
    </AccountLayout>
  );
}

AccountDetailsPage.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ["common", "forms", "menu", "footer"])),
    },
  };
};
