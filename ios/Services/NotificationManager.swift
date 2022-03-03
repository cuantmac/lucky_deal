//
//  NotificationManager.swift
//  PeaceMind
//
//  Created by songyuanjin on 2019/4/3.
//  Copyright © 2019 songyuanjin. All rights reserved.
//

import Foundation
import UserNotifications
protocol NotificationManagerDelegate:class {
    func openNotification()
}
class NotificationManager {
    // 请求权限
    public class func requestNotitficationPermission() {

        if #available(iOS 10.0, *) {
            UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) {
                (accept, error) in
                if !accept {
                    print("用户拒绝了通知权限")
                }
            }
        } else {
            // Fallback on earlier versions
        }
    }
    
    //判断权限 并跳转
    public class func checkNotitficationWithdoWork(rootViewController: UIViewController)-> Bool {
        var checked = false
        if #available(iOS 10.0, *) {
            UNUserNotificationCenter.current().getNotificationSettings {
                settings in
                switch settings.authorizationStatus {
                case .authorized:
                    checked = true
                case .notDetermined:
                    checked = false
                    //请求授权
                    UNUserNotificationCenter.current()
                        .requestAuthorization(options: [.alert, .sound, .badge]) {
                            (accepted, error) in
                            if !accepted {
                                //                                PMLog.debug(msg: "用户不允许消息通知。")
                            }
                    }
                case .denied:
                    checked = false
                    DispatchQueue.main.async(execute: { () -> Void in
                        let alertController = UIAlertController(title: NSLocalizedString("noti_request_title", comment: ""),
                                                                message: NSLocalizedString("noti_request_content", comment: ""),
                                                                preferredStyle: .alert)
                        
                        let cancelAction = UIAlertAction(title:"Cancel", style: .cancel, handler:nil)
                        
                        let settingsAction = UIAlertAction(title:NSLocalizedString("noti_request_confirm_btn", comment: ""), style: .default, handler: {
                            (action) -> Void in
                            let url = URL(string: UIApplication.openSettingsURLString)
                            if let url = url, UIApplication.shared.canOpenURL(url) {
                                UIApplication.shared.open(url, options: [:],
                                                          completionHandler: {
                                                            (success) in
                                })
                            }
                        })
                        
                        alertController.addAction(cancelAction)
                        alertController.addAction(settingsAction)
                        rootViewController.present(alertController, animated: true, completion: nil)
                    })
                default:
                    break
                }
            }
        }else {
            // Fallback on earlier versions
        }
        return checked
    }
    
    public class func cancelAllMindFulNotifications() {
        if #available(iOS 10.0, *) {
            var bedTimeIdentifiers = [String]()
            let reminderWeekday = NSLocalizedString("week_day", comment: "")
            for weekday in reminderWeekday {
                if let number = Int(String(weekday)) {
                    bedTimeIdentifiers.append(String.init(format: "com.stepcoin.walk.mind_ful.%d", number))
                }
            }
            UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: bedTimeIdentifiers)
        }
    }
    
    class func incrementBadgeNumberBy(badgeNumberIncrement: Int) {
        let currentBadgeNumber = UIApplication.shared.applicationIconBadgeNumber
        let updatedBadgeNumber = currentBadgeNumber + badgeNumberIncrement
        if (updatedBadgeNumber > -1) {
            UIApplication.shared.applicationIconBadgeNumber = updatedBadgeNumber
        }
    }
    
    class func clearBadgeNumber() {
        UIApplication.shared.applicationIconBadgeNumber = 0
        AppDelegate.appIconBadgeNumber = 0
    }
}
