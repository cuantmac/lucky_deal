//
//  AppInfo.swift
//  Step Coin
//
//  Created by songyuanjin on 2019/12/24.
//  Copyright © 2019 Step Coin Team. All rights reserved.
//

import Foundation
@objc class AppInfo: NSObject {
    static let infoDictionary = Bundle.main.infoDictionary
    
    static let appDisplayName: String = Bundle.main.infoDictionary!["CFBundleDisplayName"] as! String //App 名称

    static let bundleIdentifier:String = Bundle.main.bundleIdentifier! // Bundle Identifier

    @objc static let appVersion:String = Bundle.main.infoDictionary!["CFBundleShortVersionString"] as! String// App 版本号
    
    static var versionNumArray = appVersion.components(separatedBy: ".") as Array<Any>
    
    @objc static let buildVersion = Int(versionNumArray.last as! String) ?? 2

//    @objc static let buildVersion = Int(Bundle.main.infoDictionary!["CFBundleVersion"] as! String) ?? 1 //Bulid 版本号
  
//    @objc static let devMode = true   // 测试环境true 线上环境false
  
    static var displayVersion: String {
        get {
            return appVersion + "(build \(buildVersion))"
        }
    }
    
    static var screenScale = UIScreen.main.bounds.width / 375

//    static let iOSVersion:String = UIDevice.current.systemVersion //ios 版本
//
//    static let identifierNumber = UIDevice.current.identifierForVendor //设备 udid
//
//    static let systemName = UIDevice.current.systemName //设备名称
//
    static let model = UIDevice.current.model // 设备型号
//
//    static let localizedModel = UIDevice.current.localizedModel  //设备区域化型号
}
