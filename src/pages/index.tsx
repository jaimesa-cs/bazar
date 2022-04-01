import React, { useState } from "react";

import BannerBlock from "@containers/banner-block";
import BannerCard from "@components/common/banner-card";
import BannerSliderBlock from "@containers/banner-slider-block";
import BannerWithProducts from "@containers/banner-with-products";
import BrandGridBlock from "@containers/brand-grid-block";
import CategoryBlock from "@containers/category-block";
import Container from "@components/ui/container";
import DefaultError from "@components/contentstack/default-error";
import Divider from "@components/ui/divider";
import DownloadApps from "@components/common/download-apps";
import ExclusiveBlock from "@containers/exclusive-block";
import { GetStaticProps } from "next";
import HandleLoadingOrError from "@components/contentstack/handle-loading-and-error";
import Instagram from "@components/common/instagram";
import Layout from "@components/layout/layout";
import NewArrivalsProductFeed from "@components/product/feeds/new-arrivals-product-feed";
import ProductsFeatured from "@containers/products-featured";
import ProductsFlashSaleBlock from "@containers/product-flash-sale-block";
import { ROUTES } from "@utils/routes";
import Subscription from "@components/common/subscription";
import Support from "@components/common/support";
import { homeThreeBanner as banner } from "@framework/static/banner";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useHomeQuery } from "@framework/content/get-content";
import { useRouter } from "next/router";

interface IUserProfile {
  id: string;
  colorPreference: string;
  promoText: string;
}

const DEFAULT_USER_PROFILE: IUserProfile = {
  id: "1",
  colorPreference: "white",
  promoText: "Flash Sale",
};

const userProfiles: IUserProfile[] = [
  DEFAULT_USER_PROFILE,
  {
    id: "2",
    colorPreference: "#3399aa",
    promoText: "Variant A - Free Shipping",
  },
  {
    id: "3",
    colorPreference: "#DD4322",
    promoText: "Variant B - 20% Off",
  },
];

export default function Home() {
  const { locale } = useRouter();
  const { data: page, isLoading, error } = useHomeQuery(locale);
  const [personalizationCategory, setPersonalizationCategory] = useState<string | undefined>();
  const [variant, setVariant] = useState<IUserProfile | undefined>(DEFAULT_USER_PROFILE);

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
    if (page && page.personalization) {
      setPersonalizationCategory(callToPersonalizationSystem(page.personalization));
      setVariant(callToABSystem());
    }
  }, [page]);

  return (
    <HandleLoadingOrError isLoading={isLoading} error={error}>
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
        <BannerCard
          key={`banner--key${banner[0].id}`}
          banner={banner[0]}
          href={`${ROUTES.COLLECTIONS}/${banner[0].slug}`}
          className="mb-12 lg:mb-14 xl:mb-16 pb-0.5 lg:pb-1 xl:pb-0"
        />
        <BrandGridBlock sectionHeading="text-top-brands" />
        <BannerCard
          key={`banner--key${banner[1].id}`}
          banner={banner[1]}
          href={`${ROUTES.COLLECTIONS}/${banner[1].slug}`}
          className="mb-12 lg:mb-14 xl:mb-16 pb-0.5 lg:pb-1 xl:pb-0"
        />
        <BannerWithProducts sectionHeading="text-on-selling-products" categorySlug="/search" />
        <ExclusiveBlock />
        <NewArrivalsProductFeed />
        <DownloadApps />
        <Support />
        <Instagram />
        <Subscription className="bg-opacity-0 px-5 sm:px-16 xl:px-0 py-12 md:py-14 xl:py-16" />
      </Container>
      <Divider className="mb-0" />
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
