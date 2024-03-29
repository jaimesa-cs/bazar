import { DeliveryAPIResult } from "@uniformdev/optimize-common";
import { Tracker } from "@uniformdev/optimize-tracker-common";
import { createDefaultTracker } from "@uniformdev/optimize-tracker-browser";
import intentManifest from "./lib/intentManifest.json";

const localTracker: Tracker = createDefaultTracker({
  intentManifest: intentManifest as DeliveryAPIResult,

  logLevelThreshold: "verbose",
});

export default localTracker;
