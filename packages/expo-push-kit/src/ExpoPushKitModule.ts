import { NativeEventEmitter, NativeModules } from "react-native";

const nativeModule = NativeModules?.ExpoPushKitEventEmitter;
export const ExpoPushKitEventEmitter = new NativeEventEmitter(nativeModule);
