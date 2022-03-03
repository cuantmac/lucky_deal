//
//  AppModule.m
//  LuckyDeal
//
//  Created by Hinnka on 2020/5/25.
//

#import "AppModule.h"
#import "LDTools.h"
#import "LDPaypalWebViewController.h"
#import "LDQMLineManager.h"

static inline void dispatch_mainqueue_async(void(^block)(void)) {
  if ([NSThread isMainThread]) {
    block();
  } else {
    dispatch_async(dispatch_get_main_queue(), block);
  }
}

@implementation AppModule

RCT_EXPORT_MODULE();

- (NSDictionary *)constantsToExport
{
    return @{
        @"devMode": @(Constants.DEV_MODE),
        @"versionCode": @([AppInfo buildVersion]),
        @"updateServerUrl": Constants.SERVER_URL,
        @"buildId":@([AppInfo buildVersion]),
        @"versionName":AppInfo.appVersion,
        @"updateServerUrl":Constants.SERVER_URL
    };
}

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

- (NSArray<NSString *> *)supportedEvents {
    return @[];
}

RCT_EXPORT_METHOD(report:(NSString *)category event:(NSString *)event map:(NSDictionary *) map)
{
    //打点上报
    [Report commonWithCategory:category action:event params:map];
}

RCT_EXPORT_METHOD(getDeviceInfo:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    //获取设备信息
    NSDictionary *map = @{
        @"tk": [InnoMain loadInfo],
        @"device_id": [InnoMain getLUID],
        @"appsflyer_id": [[AppsFlyerTracker sharedTracker] getAppsFlyerUID]
    };
    resolve(map);
}

RCT_EXPORT_METHOD(register:(NSString *)token
                  user_id:(NSString *)user_id)
{
    //登录注册
    LuckyUser.user.token = token;
    LuckyUser.user.userId = user_id.intValue;
    [LuckyUser.user saveUser];
    [Report signUp];
    [Report login];
    AppsFlyerTracker.sharedTracker.customerUserID = user_id;
}

RCT_EXPORT_METHOD(fetch:(NSString *)method url:(NSString *)url body:(NSString *)body callback:(RCTResponseSenderBlock) callback)
{
    //API请求
}

RCT_EXPORT_METHOD(checkUpdate:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    if (UpdateManager.shared.needInstallBundle) {
        resolve(@(true));
        return;
    }
    [UpdateManager.shared checkUpdateWithInstall:false resolve:^(BOOL needInstall) {
        resolve(@(needInstall));
    }];
}

RCT_EXPORT_METHOD(installBundle)
{
    [UpdateManager.shared installBundle];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(internalAssetPath:(NSString *)assetPath)
{
    NSURL *bundlePath = [[NSBundle mainBundle] bundleURL];
    NSURL *url = [bundlePath URLByAppendingPathComponent:assetPath isDirectory:false];
    //  NSLog(@"UpdateManager %@", url);
    if ([[NSFileManager defaultManager] fileExistsAtPath:url.path]) {
        return url.absoluteString;
    }
    return @"";
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getActiveBundleVersion)
{
    return @(UpdateManager.shared.activeBundleVersion);
}

//上传文件
RCT_EXPORT_METHOD(upload:(NSString *)url file:(NSArray *)file resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    [Api uploadWithPath:url uri:file callback:^(NSString *result) {
        resolve(result);
    }];
}

RCT_EXPORT_METHOD(openPayPalUrl:(NSString *)url address:(NSDictionary *)address)
{
    dispatch_mainqueue_async(^{
        LDPaypalWebViewController *paypalVC = [LDPaypalWebViewController new];
        paypalVC.url = url;
        paypalVC.addressInfo = address;
        UIViewController *currentVC = [LDTools currentViewController];
        NSLog(@"currentVC  ==   %@", currentVC);
        [currentVC presentViewController:paypalVC animated:YES completion:nil];
    });
}

RCT_EXPORT_METHOD(openYFKChat:(NSString *)nickName clientId:(NSString *)clientId imgUrl:(NSString *)imgUrl title:(NSString *)title subTitle:(NSString *)subTitle price:(NSString *)price orderId:(NSString *)orderId)
{
    NSLog(@"********   %@     %@    *******", nickName, clientId);
    dispatch_mainqueue_async(^{
        [[LDQMLineManager sharedManager] startConnectLineWithUserName:nickName userId:clientId];
    });
}

@end
