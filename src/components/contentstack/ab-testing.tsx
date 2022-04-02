import * as optimizelyReactSDK from "@optimizely/react-sdk";

import { OptimizelyExperiment, OptimizelyVariation } from "@optimizely/react-sdk";

import BannerCard from "@components/common/banner-card";
import Container from "@components/ui/container";
import { IABTest } from "@framework/types";
import { OptimizelyProvider } from "@optimizely/react-sdk";
import React from "react";
import { useRouter } from "next/router";

interface AbTestingProps {
  experiment: IABTest;
}
export default function AbTesting({ experiment }: AbTestingProps) {
  const { query } = useRouter();
  const [optimizely, setOptimizely] = React.useState<optimizelyReactSDK.ReactSDKClient>();
  const { userId } = query;

  React.useEffect(() => {
    // AB test

    setOptimizely(
      optimizelyReactSDK.createInstance({
        sdkKey: process.env.NEXT_PUBLIC_OPTIMIZELY_KEY,
        logLevel: "ERROR",
      })
    );

    // End AB test
  }, []);
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
          <div style={{ padding: 10 }}>Loading A/B Test...</div>
          <br />
        </>
      )}
    </>
  );
}
