//
//  LuckyUser.swift
//  Step Coin
//
//  Created by curry on 2020/4/22.
//  Copyright © 2020 Step Coin Team. All rights reserved.
//

import UIKit
import HandyJSON
import SwiftyJSON
import InnotechIMSDK

let userKey = "luckyUser"
let LuckyUserStatusChangeNotification = "LuckyUserStatusChangeNotification"
@objc class LuckyUser:NSObject, HandyJSON {
    
    @objc static var user:LuckyUser = {
        
        if let dic = UserDefaults.standard.value(forKey: userKey) as? [String : Any] {
            let user = LuckyUser()
            user.modelWithDic(dic: dic)
            return user
        }
        return LuckyUser()
    }()

    func modelWithDic(dic:[String:Any]) {
        if dic.keys.count == 0 {
            return
        }
        
        token = dic["token"] as? String ?? ""
        userId = dic["userId"] as? Int ?? 0
    }
  
  required override init() {
  }
    
    // MARK: - user/register
    @objc var token:String = ""
  @objc var userId:Int = 0 {
    didSet {
      InnoTechPushManager.default().bindAlias(String(userId))
    }
  }
    
    @objc func saveUser() {
        let dic = self.toJSON()
        UserDefaults.standard.set(dic, forKey: userKey)
        UserDefaults.standard.synchronize()
    }
    
    func cleanUser() {
        UserDefaults.standard.removeObject(forKey: userKey)
        UserDefaults.standard.synchronize()
    }
    
}


