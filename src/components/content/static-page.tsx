import Container from "@components/ui/container";
import { Element } from "react-scroll";
import ErrorBoundary from "@components/error-boundary/error-boundary";
import ErrorInformation from "@components/404/error-information";
import PageHeader from "@components/ui/page-header";
import RenderModularBlocks from "@components/contentstack/render-modular-blocks";

export default function StaticContentPage(props: any) {
  const { data: page, path } = props;
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
