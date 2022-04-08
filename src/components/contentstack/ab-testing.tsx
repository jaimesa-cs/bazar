import * as optimizelyReactSDK from "@optimizely/react-sdk";

import { CanvasClient, ComponentInstance } from "@uniformdev/canvas";
import { Composition, Slot } from "@uniformdev/canvas-react";
import { Context, ManifestV2, enableContextDevTools } from "@uniformdev/context";
import { IABTest, IBanner } from "@framework/types";
import { OptimizelyExperiment, OptimizelyVariation } from "@optimizely/react-sdk";
import React, { ComponentProps, ComponentType } from "react";
import { fetchEntry, fetchEntryById } from "@framework/utils/contentstack";

import BannerCard from "@components/common/banner-card";
import { BannerSize } from "@framework/utils/mapper";
import Container from "@components/ui/container";
import { OptimizelyProvider } from "@optimizely/react-sdk";
import Spinner from "./spinner";
import { TestVariant } from "@uniformdev/optimize-tracker-common";
import { UniformContext } from "@uniformdev/context-react";
import axios from "axios";
import manifest from "../../components/uniform/lib/contextManifest.json";
import { useRouter } from "next/router";

const context = new Context({
  manifest: manifest as ManifestV2,
  plugins: [enableContextDevTools()],
  defaultConsent: true,
});

export const ABTestBannerSize: BannerSize = {
  mobile: { width: 450, height: 180 },
  desktop: {
    width: 1800,
    height: 570,
  },
  type: "large",
};

export type ABProvider = "optimizely" | "DY" | "uniform";
interface AbTestingProps {
  provider: ABProvider;
  experiment: IABTest;
}

export function resolveRenderer(component: any) {
  const [banner, setBanner] = React.useState<IBanner>();

  React.useEffect(() => {
    if (component && component.type === "contentstackAbTestingBanner") {
      console.log("COMPONENT", component);
      const uid = component.parameters.contentstackVariants.value.entries[0].entryUid;
      fetchEntryById<IBanner>("en-US", "banner_variation", uid)
        .then((b) => {
          setBanner(b);
        })
        .catch((err) => console.log(err));
    }
  }, [component]);
  return banner
    ? () => (
        <BannerCard
          key={`banner--key${banner.id}`}
          banner={banner}
          href={`${banner.slug}`}
          className="mb-12 lg:mb-14 xl:mb-16 pb-0.5 lg:pb-1 xl:pb-0"
        />
      )
    : () => <></>;
}

export default function AbTesting({ experiment, provider }: AbTestingProps) {
  const { locale, query } = useRouter();
  const [optimizely, setOptimizely] = React.useState<optimizelyReactSDK.ReactSDKClient>();
  const [variation, setVariation] = React.useState<IBanner>();
  const [campaign, setCampaign] = React.useState<string>();
  const [variant, setVariant] = React.useState<string>();

  const [composition, setComposition] = React.useState<any>();
  const [fetching, setFetching] = React.useState<boolean>(true);
  const [uids, setUids] = React.useState<string[]>([]);

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
      case "uniform":
        const client = new CanvasClient({
          // if this weren't a tutorial, ↙ should be in an environment variable :)
          apiKey: process.env.NEXT_PUBLIC_UNIFORM_API_KEY,
          // if this weren't a tutorial, ↙ should be in an environment variable :)
          projectId: process.env.NEXT_PUBLIC_UNIFORM_PROJECT_ID,
        });
        client
          .getCompositionBySlug({
            // if you used something else as your slug, use that here instead
            slug: "/",
          })
          .then(({ composition }) => {
            if (
              composition &&
              composition.slots &&
              composition.slots.abTesting &&
              composition.slots.abTesting.length > 0 &&
              composition.slots.abTesting[0].slots &&
              composition.slots.abTesting[0].slots.test &&
              composition.slots.abTesting[0].slots.test.length > 0
            ) {
              setComposition(composition);
              console.log("COMPOSITION", composition);
              const ids = composition.slots.abTesting[0].slots.test.map(
                (t: any) => t.parameters.contentstackVariants.value.entries[0].entryUid
              );
              console.log("IDS", ids);
              setUids(ids);
            }
            setFetching(false);
          })
          .catch((err) => {
            console.log(err);
          });
        break;
      default:
        break;
    }
    // AB test

    // End AB test
  }, []);

  React.useEffect(() => {
    if (uids && uids.length > 0) {
      const rand = Math.floor(Math.random() * uids.length);

      fetchEntryById<IBanner>(locale, "banner_variation", uids[rand])
        .then((e) => {
          setVariation(e);
        })
        .catch((err) => console.log(err));
    }
  }, [uids]);
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
    case "uniform":
      return composition ? (
        <UniformContext context={context}>
          <Container>
            <Composition data={composition} resolveRenderer={resolveRenderer}>
              <Slot name="abTesting" />
            </Composition>
          </Container>
        </UniformContext>
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
