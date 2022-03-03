//
//  LDTools.m
//  LuckyDeal
//
//  Created by sjf on 2021/4/29.
//

#import "LDTools.h"
#import <AppTrackingTransparency/AppTrackingTransparency.h>
#import <AdSupport/AdSupport.h>

@implementation LDTools

+ (UIViewController *)currentViewController
{
    UIViewController *topViewController = [UIApplication sharedApplication].keyWindow.rootViewController;
    
    if (topViewController.presentedViewController) {
        topViewController = topViewController.presentedViewController;
    } else if ([topViewController isKindOfClass:[UINavigationController class]] && [(UINavigationController *)topViewController topViewController]) {
        topViewController = [(UINavigationController *)topViewController topViewController];
    } else if ([topViewController isKindOfClass:[UITabBarController class]]) {
        UITabBarController *tab = (UITabBarController *)topViewController;
        topViewController = tab.selectedViewController;
    }
    return topViewController;
}

+ (NSString *)fetchIDFA {
    // iOS14方式访问 IDFA
    if (@available(iOS 14, *)) {
        [ATTrackingManager requestTrackingAuthorizationWithCompletionHandler:^(ATTrackingManagerAuthorizationStatus status) {
            if (status == ATTrackingManagerAuthorizationStatusAuthorized) {
                
            }
        }];
    }
    
    return [[[ASIdentifierManager sharedManager] advertisingIdentifier] UUIDString];
}

@end
