import Foundation
import Combine
import React

@objc(ExpoPushKitEventEmitter)
class ExpoPushKitEventEmitter: RCTEventEmitter {
    
    public static var emitter: RCTEventEmitter!
    
    @objc
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    override init() {
        super.init()
        ExpoPushKitEventEmitter.emitter = self
    }
    
    open override func supportedEvents() -> [String] {
        ["voip-registered", "voip-received", "expoPushKitDidLoadWithEvents"]
    }
    
    override func startObserving() {
        ExpoPushKitDelegate.sharedInstance.hasListeners = true
        if !ExpoPushKitDelegate.sharedInstance.delayedEvents.isEmpty {
            sendEvent(withName: "expoPushKitDidLoadWithEvents", body: ExpoPushKitDelegate.sharedInstance.delayedEvents)
        }
    }
    
    override func stopObserving() {
        ExpoPushKitDelegate.sharedInstance.hasListeners = false
    }
    
}
