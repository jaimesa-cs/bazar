import AbTesting, { ABProvider } from "@components/contentstack/ab-testing";
import { IContentPageProps, IUserProfile } from "./interfaces";

import BannerBlock from "@containers/banner-block";
import BannerSliderBlock from "@containers/banner-slider-block";
import BannerWithProducts from "@containers/banner-with-products";
import BrandGridBlock from "@containers/brand-grid-block";
import CategoryBlock from "@containers/category-block";
import Container from "@components/ui/container";
import Divider from "@components/ui/divider";
import DownloadApps from "@components/common/download-apps";
import ExclusiveBlock from "@containers/exclusive-block";
import { IHome } from "@framework/types";
import { Instagram } from "react-content-loader";
import NewArrivalsProductFeed from "@components/product/feeds/new-arrivals-product-feed";
import ProductsFeatured from "@containers/products-featured";
import ProductsFlashSaleBlock from "@containers/product-flash-sale-block";
import React from "react";
import Subscription from "@components/common/subscription";
import Support from "@components/common/support";
import { useRouter } from "next/router";

const DEFAULT_USER_PROFILE: IUserProfile = {
  id: "1",
  colorPreference: "white",
  promoText: "Flash Sale",
};

const userProfiles: IUserProfile[] = [
  DEFAULT_USER_PROFILE,
  {
    id: "2",
    colorPreference: "#99AA20",
    promoText: "Free Shipping",
  },
  {
    id: "3",
    colorPreference: "#664399",
    promoText: "20% Off",
  },
];

const AB_PROVIDER = "";

export default function HomeContentPage({ data }: IContentPageProps) {
  const { query } = useRouter();
  const page = data as IHome;

  const { pzn, abTestingWith } = query;

  const [personalizationCategory, setPersonalizationCategory] = React.useState<string | undefined>();
  const [variant, setVariant] = React.useState<IUserProfile | undefined>(DEFAULT_USER_PROFILE);

  const callToPersonalizationSystem = (variations: string[]) => {
    const rand = Math.random() * variations.length + 1;
    if (rand > variations.length) return "all";
    return variations[Math.floor(rand)];
  };

  const callToABSystem = (): IUserProfile => {
    const rand = Math.random() * 3;
    return userProfiles[Math.floor(rand)];
  };

  React.useEffect(() => {
    if (pzn && page && page.personalization) {
      setPersonalizationCategory(callToPersonalizationSystem(page.personalization));
      setVariant(callToABSystem());
    } else {
      setPersonalizationCategory("all");
    }
  }, [page]);

  return (
    <>
      {page?.abTesting && (
        <AbTesting provider={(abTestingWith as ABProvider) || AB_PROVIDER} experiment={page?.abTesting} />
      )}
      {page && page.banner && <BannerBlock data={page.banner} />}
      <Container>
        <ProductsFlashSaleBlock
          date={"2023-03-01T01:02:03"}
          category={personalizationCategory}
          sectionHeading={variant?.promoText}
          bgColor={variant?.colorPreference}
        />
      </Container>
      {page && page.slider && <BannerSliderBlock data={page.slider} />}
      <Container>
        <CategoryBlock sectionHeading="text-shop-by-category" type="rounded" />
        <ProductsFeatured sectionHeading="text-featured-products" limit={5} />
        <BrandGridBlock sectionHeading="text-top-brands" />
        <BannerWithProducts sectionHeading="text-on-selling-products" categorySlug="/search" />
        <ExclusiveBlock />
        <NewArrivalsProductFeed />
        <DownloadApps />
        <Support />
        <Instagram />
        <Subscription className="bg-opacity-0 px-5 sm:px-16 xl:px-0 py-12 md:py-14 xl:py-16" />
      </Container>
      <Divider className="mb-0" />
    </>
  );
}
