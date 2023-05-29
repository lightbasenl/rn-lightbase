//
//  ExpoPushKit.swift
//  Kwebbel
//
//  Created by Oliver Winter on 14/03/2023.
//

import Foundation
import ExpoModulesCore
import RNCallKeep
import PushKit

func sendEventWithNameWrapper(name: String, body: Any) {
    if ExpoPushKitDelegate.sharedInstance.hasListeners {
        ExpoPushKitEventEmitter.emitter.sendEvent(withName: name, body: body)
    } else {
        let dictionary = ["name": name, "data": body] as [String : Any]
        ExpoPushKitDelegate.sharedInstance.delayedEvents.append(dictionary)
    }
}

public class ExpoPushKitDelegate: ExpoAppDelegateSubscriber, PKPushRegistryDelegate {
    
    static let sharedInstance = ExpoPushKitDelegate()
    
    var isVoipRegistered = false
    var lastVoipToken: String?
    var hasListeners: Bool = false
    var delayedEvents = [Dictionary<String, Any>]()
    var voipRegistry = PKPushRegistry.init(queue: DispatchQueue.main)
    
    static func didUpdatePushCredentials(_ credentials: PKPushCredentials, forType type: PKPushType) {
        let voipTokenLength = credentials.token.count
        if voipTokenLength == 0 {
            return
        }
        
        var hexString = ""
        let bytes = [UInt8](credentials.token)
        for byte in bytes {
            hexString += String(format: "%02x", byte)
        }
        
        ExpoPushKitDelegate.sharedInstance.lastVoipToken = hexString
        sendEventWithNameWrapper(name: "voip-registered", body: hexString)
        
    }
    
    
    public func pushRegistry(_ registry: PKPushRegistry, didUpdate credentials: PKPushCredentials, for type: PKPushType) {
        ExpoPushKitDelegate.didUpdatePushCredentials(credentials, forType: type)
    }
    
    public func pushRegistry(_ registry: PKPushRegistry, didInvalidatePushTokenFor type: PKPushType) {
    }
    
    public func pushRegistry(_ registry: PKPushRegistry, didReceiveIncomingPushWith payload: PKPushPayload, for type: PKPushType, completion: @escaping () -> Void) {
        
        let notification = payload.dictionaryPayload
        
        let notificationData = notification["data"] as! [AnyHashable : Any]
        
        let callType = notificationData["callType"] as? String
        let sessionId = notificationData["sessionId"] as? String
        let senderId = notificationData["senderId"] as? String

        if let uuid = sessionId, let callerName = notificationData["callerName"] as? String {
            if (callType == "initiateCall") {
                RNCallKeep.reportNewIncomingCall(
                    uuid,
                    handle: callerName,
                    handleType: "generic",
                    hasVideo: true,
                    localizedCallerName: callerName,
                    supportsHolding: true,
                    supportsDTMF: true,
                    supportsGrouping: true,
                    supportsUngrouping: true,
                    fromPushKit: true,
                    payload: payload.dictionaryPayload,
                    withCompletionHandler: completion
                )
            }
        }
        sendEventWithNameWrapper(name: "voip-received", body: notificationData)
    }
    
    public func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
        voipRegistry.delegate = self
        voipRegistry.desiredPushTypes = Set([PKPushType.voIP])
        
        RNCallKeep.setup(["appName": "Kwebbel",
                          "imageName": "AppIcon",
                          "maximumCallGroups": 1,
                          "maximumCallsPerCallGroup": 1,
                          "supportsVideo": false
                         ])
        
        return true
    }
  
  public func applicationProtectedDataDidBecomeAvailable(_ application: UIApplication) {
    // Get the bundle identifier for the app
      NSLog("[expo] 🟢 Posting SCREEN UNLOCKED");

    guard let bundleIdentifier = Bundle.main.bundleIdentifier else {
        NSLog("[expo] 🟢 No bundle identifier");
        return
    }
    
    // Create the URL for the app
    let url = URL(string: "\(bundleIdentifier)://")!
        NSLog("[expo] 🟢 TRYING TO OPEN URL \(bundleIdentifier)://");

    // Open the app
    if UIApplication.shared.canOpenURL(url) {
        UIApplication.shared.open(url, options: [:], completionHandler: nil)
    } else {
        NSLog("[expo] 🟢 CANNOT OPEN URL");
    }
  }
    
}
