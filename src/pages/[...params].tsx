import { GetStaticPaths, GetStaticProps } from "next";
import { useCompositionQuery, useDefaultCompositionQuery } from "@framework/content/get-content";

import Container from "@components/ui/container";
import { Element } from "react-scroll";
import ErrorInformation from "@components/404/error-information";
import Layout from "@components/layout/layout";
import PageHeader from "@components/ui/page-header";
import RenderModularBlocks from "@components/contentstack/render-modular-blocks";
import { StaticComposition } from "@framework/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";

const staticPageIncludes: string[] = ["header.banner", "dynamic_blocks.mail_list_subscription.email_subscription"];
const jsonRteFields: string[] = ["dynamic_blocks.paragraphs_with_links.paragraphs.paragraph"];

interface StaticPageProps {
  static_page?: any;
  path?: string;
}
export default function CatchAll({ static_page, path }: StaticPageProps) {
  const router = useRouter();
  // console.log(router.asPath);
  const { data: page, error } = useCompositionQuery<StaticComposition>(
    router.asPath,
    "static_composition",
    staticPageIncludes,
    jsonRteFields
  );
  // console.log(page);

  return page ? (
    <>
      {page.header && (
        <PageHeader
          pageHeader={page.header.title}
          pageSubHeader={page.header.subtitle}
          imageUrl={page.header.banner.image.desktop.url}
        />
      )}
      {page.blocks && <RenderModularBlocks blocks={page.blocks} />}
    </>
  ) : (
    <Container>
      <ErrorInformation error={error} />
      <Container>
        <Element key="0" id="path" className="mb-10" name="path">
          <h2 className="text-lg md:text-xl lg:text-2xl text-heading font-bold mb-4">{path}</h2>
        </Element>
      </Container>
    </Container>
  );
}

CatchAll.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ["common", "forms", "menu", "faq", "footer"])),
    },
  };
};

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  //TODO: Get the static paths from contentstack
  return {
    paths: ["/faq"], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};
