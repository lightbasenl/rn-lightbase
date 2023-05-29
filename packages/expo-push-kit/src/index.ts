import { Subscription } from "expo-modules-core";

import { ExpoPushKitEventEmitter } from "./ExpoPushKitModule";

// Import the native module. On web, it will be resolved to ExpoPushKit.web.ts
// and on native platforms to ExpoPushKit.ts

export function addPushKitTokenListener(
  listener: (event: string) => void
): Subscription {
  return ExpoPushKitEventEmitter.addListener("voip-registered", listener);
}

export type VoipCall = {
  senderId: string | undefined;
  sessionId: string | undefined;
};
export function addPushKitreceivedListener(
  listener: (event: VoipCall) => void
): Subscription {
  return ExpoPushKitEventEmitter.addListener("voip-received", listener);
}

export type DelayedEvents = [
  { name: "voip-registered"; data: string },
  { name: "voip-received"; data: VoipCall }
];
export function addPushKitDelayedEvents(
  listener: (event: DelayedEvents) => void
): Subscription {
  return ExpoPushKitEventEmitter.addListener(
    "expoPushKitDidLoadWithEvents",
    listener
  );
}
