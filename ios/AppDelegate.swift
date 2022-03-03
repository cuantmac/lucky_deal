//
//  AppDelegate.swift
//  LuckyDeal
//
//  Created by Hinnka on 2020/5/27.
//

import UIKit
import InnoAntiSpamSDK
import InnoCommon
import AppsFlyerLib
import Bugly
import UserNotifications
import InnotechIMSDK
import RNBranch
import FBSDKCoreKit
import AdSupport

let DEV_MODE = Constants.DEV_MODE

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate,UNUserNotificationCenterDelegate,AppsFlyerTrackerDelegate, InnoTechPushManagerDelegate, RCTBridgeDelegate {

  func sourceURL(for bridge: RCTBridge!) -> URL! {
    #if DEBUG
    return URL(string: "http://10.104.12.235:8081/index.bundle?platform=ios&dev=true")
    return RCTBundleURLProvider.sharedSettings()?.jsBundleURL(forBundleRoot: "index", fallbackResource: nil)
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
    #else
    return UpdateManager.shared.bundleURL()
    #endif
  }


  func onConversionDataSuccess(_ conversionInfo: [AnyHashable : Any]) {
    //test deep link
  }

  func onConversionDataFail(_ error: Error) {
    //test deep link
  }


  var window: UIWindow?
  var appUseTime = 0.0
  var bridge: RCTBridge?
    var loadingView : LDLaunchLoadingView?
    

  static var tabHeight: CGFloat = 0.0
  static var appStartTime = 0.0
  static var appIconBadgeNumber : Int = 0

  //     app 启动完成 程序准备开始运行
  func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    
    let sessionBuilder = FlurrySessionBuilder()
            .withLogLevel(FlurryLogLevelAll)
            .withCrashReporting(true)
            .withAppVersion("1.0")
            .withIAPReportingEnabled(true)
    Flurry.startSession("7H9T4NV6KD7Z84TMDJWH", with: sessionBuilder)

    self.window = UIWindow(frame: UIScreen.main.bounds)
    let tk = UserDefaults.standard.string(forKey: "tk")
    if let _ = tk {
      self.bridge = RCTBridge(delegate: self, launchOptions: launchOptions)
      let rootView = RCTRootView(bridge: self.bridge!, moduleName: "LuckyDeal", initialProperties: nil)
      rootView.backgroundColor = UIColor(red: 1, green: 1, blue: 1, alpha: 1)
      ReactInteraction.shareInstance().setValue(self.bridge, forKey: "bridge")
      let rootViewController = UIViewController()
      rootViewController.view = rootView
      self.window?.rootViewController = rootViewController
        self.loadingView = LDLaunchLoadingView.init()
        self.window?.rootViewController?.view.addSubview(self.loadingView!)
    } else {
      let rootViewController = UIViewController()
      let launchScreen = Bundle.main.loadNibNamed("LaunchScreen", owner: self, options: nil)?[0] as! UIView
      rootViewController.view = launchScreen
      self.window?.rootViewController = rootViewController
    }
    self.window?.makeKeyAndVisible()


    //将第一次登录时间保存起来
    AppDelegate.appStartTime = Date().timeIntervalSince1970
    let userId = String(LuckyUser.user.userId)

    //Bugly
    Bugly.start(withAppId: "78264f2b43")
    Bugly.setUserIdentifier(userId)
    Bugly.setUserValue(Locale.current.languageCode ?? "", forKey: "lang")
    Bugly.setUserValue(Locale.current.regionCode ?? "", forKey: "country")

    //反作弊SDK
    InnoConfig.sharedInstance()?.strChannelId = "luckydeal"
    InnoConfig.sharedInstance()?.dicCustomParams = ["member_id": userId, "isDebug": DEV_MODE]
    InnoConfig.sharedInstance()?.bReportGyroData = true
    InnoConfig.sharedInstance()?.tUrl = "https://fy.stepcoin.vip"
    InnoMain.startInno { (strOpenId, strRemark, bIsNew) in
      print("strOpenId", strOpenId ?? "")
      self.reportSDK(strOpenId: strOpenId ?? "", strRemark: strRemark ?? "", bIsNew: bIsNew)
      self.pushSDK(strOpenId: strOpenId ?? "", strRemark: strRemark ?? "", bIsNew: bIsNew)
      
      DispatchQueue.main.async {
        var tk = UserDefaults.standard.string(forKey: "tk")
        if tk == nil {
          tk = strOpenId
          UserDefaults.standard.set(tk, forKey: "tk")
          self.bridge = RCTBridge(delegate: self, launchOptions: launchOptions)
          let rootView = RCTRootView(bridge: self.bridge!, moduleName: "LuckyDeal", initialProperties: nil)
          ReactInteraction.shareInstance().setValue(self.bridge, forKey: "bridge")
          rootView.backgroundColor = UIColor(red: 1, green: 1, blue: 1, alpha: 1)
          let rootViewController = UIViewController()
          rootViewController.view = rootView
          self.window?.rootViewController = rootViewController
            self.loadingView = LDLaunchLoadingView.init()
            self.window?.rootViewController?.view.addSubview(self.loadingView!)
        }
      }
    }

    appsFlyerSDK()
    
    //        LogUtil.debug("userId->", userId)
    AppsFlyerTracker.shared().delegate = self
    #if DEBUG
    RNBranch.useTestInstance()
    RNBranch.setDebug()
    #endif
    RNBranch.initSession(launchOptions: launchOptions, isReferrable: true) // <-- add this
    
    let idfa = LDTools.fetchIDFA()
    print("idfa:\(idfa)")

    ApplicationDelegate.shared.application( application, didFinishLaunchingWithOptions: launchOptions )
    return true
  }

  func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
    return RNBranch.application(app, open: url, options: options) || ApplicationDelegate.shared.application( app, open: url, sourceApplication: options[UIApplication.OpenURLOptionsKey.sourceApplication] as? String, annotation: options[UIApplication.OpenURLOptionsKey.annotation] )
  }

  func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([Any]?) -> Void) -> Bool {
    return RNBranch.continue(userActivity)
  }

  func reportSDK(strOpenId:String, strRemark:String, bIsNew:Bool) {
    //上报SDK
    InnoCommConfig.sharedInstance()?.strCid = "ireport_luckydeal"
    InnoCommConfig.sharedInstance()?.signKey = "dxfw5yOPFjKCnWB76WESvMLhqIVgpb1F"
    InnoCommConfig.sharedInstance()?.strReportURL = DEV_MODE ? "http://47.93.216.50:8031" : "https://ireport.luckydeal.vip"
    InnoCommConfig.sharedInstance()?.acOpenId = strOpenId
    InnoCommConfig.sharedInstance()?.bEnableDebugOutput = false
    InnoCommConfig.sharedInstance()?.bEnableReport = true
    let commonReport = ["versioncode": AppInfo.buildVersion, "packagename": AppInfo.bundleIdentifier] as [String : Any]
    InnoCommConfig.sharedInstance()?.customDictionary = commonReport
    InnoCommMain.start { (strKUID) in
      print("KUID", strKUID ?? "")
    }
  }
  func pushSDK(strOpenId:String, strRemark:String, bIsNew:Bool) {

    var appid = "1017"
    var appkey = "TERJMTU4OTc5MDE0MQ"

    if DEV_MODE {
      appid = "1018"
      appkey = "SkV5MTU4OTc5MDE2OA"
      InnoTechPushManager.default().environment = .world
    }

    //        NotificationCenter.default.addObserver(self, selector: #selector(registerRemoteNotification), name: NSNotification.Name("HomeDisplayNotification"), object: nil)
    InnoTechPushManager.default().antiSpamOpenId = strOpenId;
    registerRemoteNotification()
    InnoTechPushManager.default().setHostTypeReleaseDomain("gw.innotechx.com", hostTypeDebugDomain: "gw-t.innotechx.com", hostTypeWorldDomain: "gw.innotechworld.com", socketDomain: "qpushapi.innotechx.com")
    InnoTechPushManager.default().start(appid, andKey: appkey, with: self)
    InnoTechPushManager.default().enableDebugLog = true
    UNUserNotificationCenter.current().getNotificationSettings { (settings) in
      var isEnable:Bool = false
      if settings.authorizationStatus == .authorized {
        isEnable = true
      }
      InnoTechPushManager.default().locakNotificationSwitch = isEnable
    }
    let userId = String(LuckyUser.user.userId)
    InnoTechPushManager.default().bindAlias(userId)
//    registerRemoteNotification()
  }

  func appsFlyerSDK() {
    let userId = LuckyUser.user.userId
    if userId != 0 {
      //AppsFlyer
      AppsFlyerTracker.shared().appsFlyerDevKey = "55nzjn5dEAFFJscs6Vmsjf"
      AppsFlyerTracker.shared().appleAppID = "1531277195"
      AppsFlyerTracker.shared().customerUserID = String(userId)
      print("AppsFlyer init success, userId(customerUserID)=", userId)
    }
  }

  func application(_ application: UIApplication, willFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    if #available(iOS 10.0, *) {
      UNUserNotificationCenter.current().delegate = self
    } else {
      // Fallback on earlierf versions
    }
    return true
  }

  //    应用程序已进入前台，处于活动状态
  func applicationDidBecomeActive(_ application: UIApplication) {
    //AppsFlyer
    AppsFlyerTracker.shared().trackAppLaunch()

    appUseTime = Date().timeIntervalSince1970
    
    NotificationManager.clearBadgeNumber()

//    UIApplication.shared.applicationIconBadgeNumber = 0

    print("UpdateManager check update")
    #if DEBUG
    print("do not check if debug")
    #else
    UpdateManager.shared.installBundle()
    UpdateManager.shared.checkUpdate(install: DEV_MODE)
    #endif
  }

  func applicationWillEnterForeground(_ application: UIApplication) {
    NotificationManager.clearBadgeNumber()
    //进入到前台
    NotificationCenter.default.post(name: NSNotification.Name("WillEnterForeground"), object: self)
  }

  @available(iOS 10.0, *)
  func userNotificationCenter(_ center: UNUserNotificationCenter, openSettingsFor notification: UNNotification?) {
    //         PMLog.debug(tag: "openSettingsFor", msg: notification!.request.identifier)
  }

  // MARK: notification
  func didReceiveGeneralNotificationMessage(_ message: PushMessage) {
    print("-push--didReceiveGeneralNotificationMessage ")
    //Report.pv(category: String)
  }

  func didReceivePassThroughMessage(_ message: PushMessage) {
    print("-push-- didReceivePassThroughMessage")
  }

  func innoSocketStatusDidChanged(_ isConnected: Bool) {
    print("-push-- \(isConnected)")
  }

  func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
    // 根据APP需要，判断是否要提示用户Badge、Sound、Alert

    completionHandler([.badge, .sound, .alert])
    InnoTechPushManager.default().handleRemoteNotification(notification.request.content.userInfo, andEventType: .show)
    UIApplication.shared.applicationIconBadgeNumber = 0
    if notification.request.content.userInfo.keys.count == 0 { //本地通知
      //            Report.push(category: "push", event: "ga_push_claim_impression")
    } else {
      //            Report.push(category: "push", event: "ga_fcm_push_impression")
    }
  }

  // 点击
  func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
    InnoTechPushManager.default().handleRemoteNotification(response.notification.request.content.userInfo, andEventType: .click)
    if response.notification.request.content.userInfo.keys.count == 0 { //本地通知
      //            Report.push(category: "push", event: "ga_push_claim_click")
    } else {
      //            Report.push(category: "push", event: "ga_fcm_push_click")
    }
    /*
     NSDictionary * userInfo = response.notification.request.content.userInfo;
     UNNotificationRequest *request = response.notification.request; // 收到推送的请求
     UNNotificationContent *content = request.content; // 收到推送的消息内容
     NSNumber *badge = content.badge;  // 推送消息的角标
     NSString *body = content.body;    // 推送消息体
     UNNotificationSound *sound = content.sound;  // 推送消息的声音
     NSString *subtitle = content.subtitle;  // 推送消息的副标题
     NSString *title = content.title;  // 推送消息的标题
     */
    UIApplication.shared.applicationIconBadgeNumber = 0

    NotificationManager.clearBadgeNumber()
  }

  func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
    print("--push-- DidRegisterForRemoteNotifications")
    InnoTechPushManager.default().registerPushToken(deviceToken)
  }

  func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
    print("--push-- FailToRegisterForRemoteNotifications")
  }

  func applicationWillTerminate(_ application: UIApplication) {
  }

  @objc func registerRemoteNotification() {
    // 目前项目最低版本iOS10
    let center = UNUserNotificationCenter.current()
    center.delegate = self
    center.requestAuthorization(options: [.badge, .sound, .alert]) { (granted, error) in
      if (error == nil && granted) {
        print("request authorization succeeded!")
        DispatchQueue.main.async {
          UIApplication.shared.registerForRemoteNotifications()
        }
      }
    }
  }
}

#if DEBUG
extension UIWindow {
    open override func motionBegan(_ motion: UIEvent.EventSubtype, with event: UIEvent?) {
        super.motionBegan(motion, with: event)
        if motion == .motionShake {
            FLEXManager.shared.showExplorer()
        } else {
            
        }
        WHDebugToolManager.toggle(with: .all)
    }
}
#endif
