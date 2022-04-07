import * as optimizelyReactSDK from "@optimizely/react-sdk";

import { BannerSize, toBannerFromComposition } from "@framework/utils/mapper";
import { IABTest, IBanner } from "@framework/types";
import { OptimizelyExperiment, OptimizelyVariation } from "@optimizely/react-sdk";

import BannerCard from "@components/common/banner-card";
import Container from "@components/ui/container";
import { OptimizelyProvider } from "@optimizely/react-sdk";
import React from "react";
import Spinner from "./spinner";
import axios from "axios";
import { fetchEntry } from "@framework/utils/contentstack";
import { useRouter } from "next/router";

export const ABTestBannerSize: BannerSize = {
  mobile: { width: 450, height: 180 },
  desktop: {
    width: 1800,
    height: 570,
  },
  type: "large",
};

export type ABProvider = "optimizely" | "DY";
interface AbTestingProps {
  provider: ABProvider;
  experiment: IABTest;
}

export default function AbTesting({ experiment, provider }: AbTestingProps) {
  const { locale, query } = useRouter();
  const [optimizely, setOptimizely] = React.useState<optimizelyReactSDK.ReactSDKClient>();
  const [variation, setVariation] = React.useState<IBanner>();
  const [campaign, setCampaign] = React.useState<string>();
  const [variant, setVariant] = React.useState<string>();
  const [fetching, setFetching] = React.useState<boolean>(true);

  const { userId } = query;
  React.useEffect(() => {
    switch (provider) {
      case "optimizely":
        setOptimizely(
          optimizelyReactSDK.createInstance({
            sdkKey: process.env.NEXT_PUBLIC_OPTIMIZELY_KEY,
            logLevel: "ERROR",
          })
        );
        break;
      case "DY":
        if (experiment && experiment.campaign) {
          const campaign = experiment.campaign;
          setCampaign(campaign);

          axios
            .get(`/api/dy?campaign=${experiment.campaign}`)
            .then((res) => {
              console.log(`Fetching Banner for campaign: ${campaign} and variant: ${res.data.variant}`);
              setVariant(res.data.variant);
              fetchEntry<IBanner>(locale, "banner_variation", [
                { key: "campaign", value: `${campaign}|${res.data.variant}` },
              ])
                .then((b) => {
                  setVariation(b);
                  setFetching(false);
                })
                .catch((e) => {
                  console.log(e);
                });
            })
            .catch((err) => {
              console.log("Error while getting variations from DY", err);
            });
        }
        break;
      default:
        break;
    }
    // AB test

    // End AB test
  }, []);

  switch (provider) {
    case "optimizely":
      return (
        <>
          {optimizely ? (
            <Container>
              <OptimizelyProvider
                optimizely={optimizely}
                user={{
                  id:
                    userId !== null && userId !== undefined
                      ? (userId as string)
                      : `user_${Math.floor(Math.random() * 1000)}`,
                }}
              >
                <OptimizelyExperiment experiment="jaime_bazar_ab_test">
                  <OptimizelyVariation variation="variation_A">
                    {experiment.variant_a && (
                      <BannerCard
                        key={`banner--key${experiment.variant_a.id}`}
                        banner={experiment.variant_a}
                        href={`${experiment.variant_a.slug}`}
                        className="mb-12 lg:mb-14 xl:mb-16 pb-0.5 lg:pb-1 xl:pb-0"
                      />
                    )}
                  </OptimizelyVariation>
                  <OptimizelyVariation variation="variation_B">
                    {experiment.variant_b && (
                      <BannerCard
                        key={`banner--key${experiment.variant_b.id}`}
                        banner={experiment.variant_b}
                        href={`${experiment.variant_b.slug}`}
                        className="mb-12 lg:mb-14 xl:mb-16 pb-0.5 lg:pb-1 xl:pb-0"
                      />
                    )}
                  </OptimizelyVariation>
                  <OptimizelyVariation default>
                    {experiment.default && (
                      <BannerCard
                        key={`banner--key${experiment.default.id}`}
                        banner={experiment.default}
                        href={`${experiment.default.slug}`}
                        className="mb-12 lg:mb-14 xl:mb-16 pb-0.5 lg:pb-1 xl:pb-0"
                      />
                    )}
                  </OptimizelyVariation>
                </OptimizelyExperiment>
              </OptimizelyProvider>
            </Container>
          ) : (
            <>
              <Container>
                <Spinner />
              </Container>
            </>
          )}
        </>
      );
    case "DY":
      return variation && variant && campaign ? (
        <BannerCard
          banner={variation}
          href={`${variation.slug}`}
          className="mb-12 lg:mb-14 xl:mb-16 pb-0.5 lg:pb-1 xl:pb-0"
        />
      ) : fetching ? (
        <>
          <Spinner />
        </>
      ) : (
        <>
          <Container>
            NO BANNER FOR CAMPAIGN {campaign} VARIANT {variant}
          </Container>
        </>
      );
    default:
      return <></>;
  }
}
