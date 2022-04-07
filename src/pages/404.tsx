import Container from "@components/ui/container";
import ErrorInformation from "@components/404/error-information";
import { GetStaticProps } from "next";
import HandleLoadingOrError from "@components/contentstack/handle-loading-and-error";
import { IErrorPage } from "@framework/types";
import Layout from "@components/layout/layout";
import { fetchEntry } from "@framework/utils/contentstack";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useCompositionQuery } from "@framework/content/get-content";
import { useRouter } from "next/router";
// interface ErrorPageProps {
//   page: IErrorPage;
// }
export default function ErrorPage() {
  return <ErrorInformation />;
  //   const router = useRouter();
  //   const { locale } = useRouter();
  //   const { data: page, isLoading, error } = useCompositionQuery<IErrorPage>(router.asPath, locale, "error_pages");

  //   return (
  //     // <HandleLoadingOrError isLoading={isLoading} error={error}>
  //     <Container>
  //       {page?.errorNumber && <h1>{page.errorNumber}</h1>}
  //       {page?.error && <p>{page.error}</p>}
  //     </Container>
  //     // </HandleLoadingOrError>
  //   );
}

ErrorPage.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  //   return fetchComposition<IErrorPage>("/404", locale, "error_pages").then((page) => {
  //     return {
  //       props: {
  //         page: page,
  //         ...serverSideTranslations(locale!, ["common", "forms", "menu", "footer"]),
  //       },
  //     };
  //   });
  return {
    props: {
      ...serverSideTranslations(locale!, ["common", "forms", "menu", "footer"]),
    },
  };
};
