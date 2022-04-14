import { IFooter, Navigation, navigationIncludes } from "@framework/types";

import React from "react";
import { fetchEntry } from "@framework/utils/contentstack";
import { useRouter } from "next/router";

export function useCommonContent() {
  const { locale } = useRouter();
  const [{ status, navigation, footer, error, isLoading }, setState] = React.useState<{
    status: "loading" | "success" | "error";
    navigation: undefined | Navigation;
    footer: undefined | IFooter;
    error: null | Error;
    isLoading: boolean;
  }>({ status: "loading", navigation: undefined, footer: undefined, error: null, isLoading: true });

  React.useEffect(() => {
    let cancel = false;
    const loc = locale || "en-us";
    fetchEntry<Navigation>({
      locale: loc,
      type: "navigation",
      queryParams: [{ key: "url", value: "/navigation" }],
      includes: navigationIncludes,
    })
      .then((nav) => {
        if (cancel) return;
        fetchEntry<IFooter>({
          locale: loc,
          type: "footer",
          queryParams: [{ key: "url", value: "/footer" }],
          includes: ["links.links.category"],
        })
          .then((f) => {
            setState({ status: "success", navigation: nav, footer: f, error: null, isLoading: false });
          })
          .catch((e) => {
            if (cancel) return;
            setState({ status: "error", footer: undefined, navigation: undefined, error: e, isLoading: false });
            console.error(`Something went wrong fetching footer!`, e);
          });
      })
      .catch((e) => {
        if (cancel) return;
        setState({ status: "error", footer: undefined, navigation: undefined, error: e, isLoading: false });
        console.error(`Something went wrong fetching navigation!`, e);
      });

    return () => {
      cancel = true;
    };
  }, []);
  return { status, navigation, footer, error, isLoading };
}
