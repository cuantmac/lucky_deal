//
//  UpdateManager.swift
//  LuckyDeal
//
//  Created by Hinnka on 2020/9/10.
//

import Foundation
import Alamofire
import SwiftyJSON
import Zip
import CommonCrypto
import InnoAntiSpamSDK

@objc class UpdateManager: NSObject {
  @objc static let shared = UpdateManager()
  
  let session = Session(interceptor: Interceptor(retriers: [RetryPolicy(retryLimit: 3)]))
  @objc var needInstallBundle = false
  @objc var activeBundleVersion = UserDefaults.standard.integer(forKey: "installedBundleVersion")
  
  override init() {
    if activeBundleVersion < 1 {
        activeBundleVersion = Constants.activeBundleVersion
    }
  }
  
  @objc func checkUpdate(install: Bool, resolve: @escaping (Bool) -> () = {_ in }) {
    session.request(URL(string: Constants.SERVER_URL + Constants.METADATA)!, encoding: JSONEncoding.default).responseJSON { (res) in
      switch res.result {
      case .success(let json):
        print("UpdateManager", "metadata download success")
        print("Bundles ", json)
        let jsonObj = JSON(json)
        let bundles = jsonObj["iosBundles"].arrayValue
        if bundles.count == 0 {
          resolve(false)
            self.hideSplashHolder()
          return
        }
        var found = false
        bundles.forEach { (bundle) in
          let version = bundle["version"].intValue
          let minAppVersion = bundle["min_app_version"].intValue
          let maxAppVersion = bundle["max_app_version"].intValue
          let name = bundle["name"].stringValue
          let md5 = bundle["md5"].stringValue
          let percent = bundle["percent"].int ?? -1
          let buildVersion = AppInfo.buildVersion
          if self.activeBundleVersion >= version ||
                buildVersion < minAppVersion ||
              buildVersion > maxAppVersion {
            self.hideSplashHolder()
            return
          }
          if percent >= 0 {
            let tk = InnoMain.loadInfo()
            let tkHash = abs(tk.hash % 100)
            if percent <= tkHash {
                self.hideSplashHolder()
              return
            }
          }
          if name.isEmpty {
            self.hideSplashHolder()
            return
          }
          found = true
          self.downloadAndVerify(url: Constants.SERVER_URL + name, md5: md5, version: version, install: install, resolve:resolve)
        }
        if !found {
            self.hideSplashHolder()
          resolve(false)
        }
      case .failure(let error):
        print("UpdateManager", error)
        self.hideSplashHolder()
        resolve(false)
      }
    }
  }
  
  func downloadAndVerify(url: String, md5: String, version: Int, install: Bool, resolve: @escaping (Bool) -> ()) {
    print("UpdateManager", "downloading bundle")
    session.download(URL(string: url)!).responseData { (res) in
      switch res.result {
      case .success(let data):
        print("UpdateManager", "bundle download success")
        if !md5.isEmpty {
          let hash = data.withUnsafeBytes { (bytes: UnsafeRawBufferPointer) -> [UInt8] in
              var hash = [UInt8](repeating: 0, count: Int(CC_MD5_DIGEST_LENGTH))
              CC_MD5(bytes.baseAddress, CC_LONG(data.count), &hash)
              return hash
          }
          let digestHex = hash.map { String(format: "%02x", $0) }.joined()
          if md5.uppercased() != digestHex.uppercased() {
            resolve(false)
            self.hideSplashHolder()
            return
          }
        }
        let documentDir = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
        let bundleZip = URL(string: documentDir.absoluteString + "/" + Constants.UPDATE_DIR + ".zip")!
        try? data.write(to: bundleZip)
        let _ = try? Zip.quickUnzipFile(bundleZip)
        self.needInstallBundle = true
        UserDefaults.standard.set(version, forKey: "installedBundleVersion")
        print("UpdateManager", "bundle unzip success")
        if install {
          self.installBundle()
        }
        self.hideSplashHolder()
        resolve(self.needInstallBundle)
      case .failure(let error):
        print("UpdateManager", error)
        self.hideSplashHolder()
        resolve(false)
      }
    }
  }
  
  func bundleURL() -> URL! {
//    if activeBundleVersion <= AppInfo.buildVersion {
//      return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
//    }
    let documentDir = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
    let bundleFile = documentDir.appendingPathComponent(Constants.UPDATE_DIR).appendingPathComponent(Constants.BUNDLE_NAME, isDirectory: false)
    print("UpdateManager", bundleFile)
    if FileManager.default.fileExists(atPath: bundleFile.path) {
      return bundleFile
    }
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
  }
  
  @objc func installBundle() {
    if needInstallBundle {
      let appDelegate = UIApplication.shared.delegate as! AppDelegate
      appDelegate.bridge?.bundleURL = bundleURL()
      appDelegate.bridge?.reload()
      needInstallBundle = false
      activeBundleVersion = UserDefaults.standard.integer(forKey: "installedBundleVersion")
      print("UpdateManager 安装bundle成功")
    }
  }
    
    func hideSplashHolder() -> Void {
        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        appDelegate.loadingView?.dismiss()
    }
}
