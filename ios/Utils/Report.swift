//
//  Report.swift
//  Step Coin
//
//  Created by Hinnka on 2019/12/25.
//  Copyright © 2019 Step Coin Team. All rights reserved.
//

import Foundation
import InnoCommon

@objc
class Report : NSObject {
    @objc static func signUp() {
        InnoCommMain.signUP(String(LuckyUser.user.userId))
    }

    @objc static func login() {
        InnoCommMain.login(in: (String(LuckyUser.user.userId)))
    }

    @objc static func common(category: String, action: String, params: [String:Any]) {
        InnoCommMain.logEvent("LuckyDeal", andAction: action, andCategory: category, andCustomParams: NSMutableDictionary(dictionary: params))
    }

    static func pv(category: String, way: String? = nil, id: String? = nil) {
        var params = [String:String]()
        params["type"] = "pv"
        if let way = way {
            params["way"] = way
        }
        if let id = id {
            params["id"] = id
        }
        
        InnoCommMain.logEvent("LuckyDeal", andAction: "ga_pv", andCategory: category, andCustomParams: NSMutableDictionary(dictionary: params))
    }
    
    
    static func push(category: String, event: String) {
        var params = [String:String]()
        params["type"] = "push"
        
        InnoCommMain.logEvent("LuckyDeal", andAction: event, andCategory: category, andCustomParams: NSMutableDictionary(dictionary: params))
    }

    static func tap(category: String, event: String, way: String? = nil, id: String? = nil) {
        var params = [String:String]()
        params["type"] = "tap"
        if let way = way {
            params["way"] = way
        }
        if let id = id {
            params["id"] = id
        }
        InnoCommMain.logEvent("LuckyDeal", andAction: event, andCategory: category, andCustomParams: NSMutableDictionary(dictionary: params))
    }
    
    static func task(category: String, event: String, way: String? = nil, id: String? = nil) {
        var params = [String:String]()
        params["type"] = "task"
        if let way = way {
            params["way"] = way
        }
        if let id = id {
            params["id"] = id
        }
        InnoCommMain.logEvent("LuckyDeal", andAction: event, andCategory: category, andCustomParams: NSMutableDictionary(dictionary: params))
    }

    static func general(category: String, event: String, way: String? = nil, id: String? = nil) {
        var params = [String:String]()
        params["type"] = "general"
        if let way = way {
            params["way"] = way
        }
        if let id = id {
            params["id"] = id
        }
        InnoCommMain.logEvent("LuckyDeal", andAction: event, andCategory: category, andCustomParams: NSMutableDictionary(dictionary: params))
    }

    static func value(category: String, event: String, value: String) {
        var params = [String:String]()
        params["type"] = "value"
        params["value"] = value
        InnoCommMain.logEvent("LuckyDeal", andAction: event, andCategory: category, andCustomParams: NSMutableDictionary(dictionary: params))
    }

    static func ad(platform: String, adId: String, tag: String, event: String, fromCache: Bool? = nil) {
        var params = [String:String]()
        params["type"] = "ad"
        params["platform"] = platform
        params["adid"] = adId
        params["id"] = tag
        params["attr"] = event
        if let fromCache = fromCache {
            params["way"] = fromCache ? "1" : "2"
        }
        InnoCommMain.logEvent("LuckyDeal", andAction: "ga_ad", andCategory: "AdModule", andCustomParams: NSMutableDictionary(dictionary: params))
    }
}
