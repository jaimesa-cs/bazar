import Button from "@components/ui/button";
import CookieBar from "@components/common/cookie-bar";
import ErrorBoundary from "@components/error-boundary/error-boundary";
import Footer from "@components/layout/footer/footer";
import Header from "@components/layout/header/header";
import MobileNavigation from "@components/layout/mobile-navigation/mobile-navigation";
import { NextSeo } from "next-seo";
import Search from "@components/common/search";
import { useAcceptCookies } from "@utils/use-accept-cookies";
import { useTranslation } from "next-i18next";

const Layout: React.FC = ({ children }) => {
  const { acceptedCookies, onAcceptCookies } = useAcceptCookies();
  const { t } = useTranslation("common");

  return (
    <div className="flex flex-col min-h-screen">
      <NextSeo
        additionalMetaTags={[
          {
            name: "viewport",
            content: "width=device-width, initial-scale=1.0",
          },
        ]}
        title="ChawkBazar React - React Next E-commerce Template"
        description="Fastest E-commerce template built with React, NextJS, TypeScript, React-Query and Tailwind CSS."
        canonical="https://chawkbazar.vercel.app/"
        openGraph={{
          url: "https://chawkbazar.vercel.app",
          title: "ChawkBazar React - React Next E-commerce Template",
          description:
            "Fastest E-commerce template built with React, NextJS, TypeScript, React-Query and Tailwind CSS.",
          images: [
            {
              url: "/assets/images/og-image-01.png",
              width: 800,
              height: 600,
              alt: "Og Image Alt",
            },
            {
              url: "/assets/images/og-image-02.png",
              width: 900,
              height: 800,
              alt: "Og Image Alt Second",
            },
          ],
        }}
      />
      <ErrorBoundary identifier="header">
        <Header />
      </ErrorBoundary>
      <main
        className="relative flex-grow"
        style={{
          minHeight: "-webkit-fill-available",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {children}
      </main>
      <ErrorBoundary identifier="footer">
        <Footer />
      </ErrorBoundary>
      <ErrorBoundary identifier="mobile-navigation">
        <MobileNavigation />
      </ErrorBoundary>
      <ErrorBoundary identifier="search">
        <Search />
      </ErrorBoundary>
      <ErrorBoundary identifier="cookie-bar">
        <CookieBar
          title={t("text-cookies-title")}
          hide={acceptedCookies}
          action={
            <Button onClick={() => onAcceptCookies()} variant="slim">
              {t("text-accept-cookies")}
            </Button>
          }
        />
      </ErrorBoundary>
    </div>
  );
};

export default Layout;
