import { GetStaticPaths, GetStaticProps } from "next";
import { fetchComposition, getCompositionPaths } from "@framework/utils/contentstack";

import Container from "@components/ui/container";
import { Element } from "react-scroll";
import ErrorBoundary from "@components/error-boundary/error-boundary";
import ErrorInformation from "@components/404/error-information";
import Layout from "@components/layout/layout";
import PageHeader from "@components/ui/page-header";
import RenderModularBlocks from "@components/contentstack/render-modular-blocks";
import { StaticComposition } from "@framework/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const staticPageIncludes: string[] = ["header.banner", "dynamic_blocks.mail_list_subscription.email_subscription"];
const jsonRteFields: string[] = ["dynamic_blocks.paragraphs_with_links.paragraphs.paragraph"];

interface StaticPageProps {
  page: StaticComposition;
  path?: string;
}
export default function CatchAll({ path, page }: StaticPageProps) {
  console.log("STATIC_PAGE", page);
  return page ? (
    <>
      {page.header && (
        <ErrorBoundary identifier="page-header">
          <PageHeader
            pageHeader={page.header.title}
            pageSubHeader={page.header.subtitle}
            imageUrl={page.header.banner.image.desktop.url}
          />
        </ErrorBoundary>
      )}
      {page.blocks && (
        <ErrorBoundary identifier="modular-blocks">
          <RenderModularBlocks blocks={page.blocks} />
        </ErrorBoundary>
      )}
    </>
  ) : (
    <Container>
      <ErrorInformation error={null} />
      <Container>
        <Element key="0" id="path" className="mb-10" name="path">
          <h2 className="text-lg md:text-xl lg:text-2xl text-heading font-bold mb-4">{path}</h2>
        </Element>
      </Container>
    </Container>
  );
}

CatchAll.Layout = Layout;

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

  return fetchComposition<StaticComposition>(path, locale, "static_composition", staticPageIncludes, jsonRteFields)
    .then((page) => {
      return {
        props: {
          page: page as StaticComposition,
          ...serverSideTranslations(locale!, ["common", "forms", "menu", "faq", "footer"]),
        },
        revalidate: 10, // In seconds,
      };
    })
    .catch((err) => {
      console.log("ERROR [...slug]", err);
      return {
        props: {
          page: null,
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
      fallback: true,
    };
  });
};
