//
//  Constants.swift
//  LuckyDeal
//
//  Created by Hinnka on 2020/9/11.
//

import Foundation

@objc class Constants: NSObject {
  @objc static let DEV_MODE = false // 测试环境true 线上环境false
  @objc static let activeBundleVersion = DEV_MODE ? 187 : 2  //RN包版本号, 每次发版需要更新, 查看luckydeal/doc下meta.json文件
  @objc static let SERVER_URL = DEV_MODE ?
          "https://static.luckydeal.vip/app-upgrade-test/" :
          "https://static.luckydeal.vip/app-upgrade/";
  @objc static let METADATA = "metadata.json";
  @objc static let UPDATE_DIR = "app-update";
  @objc static let BUNDLE_NAME = "index.ios.bundle";
    
  @objc static var screenScale = UIScreen.main.bounds.width / 375
}
