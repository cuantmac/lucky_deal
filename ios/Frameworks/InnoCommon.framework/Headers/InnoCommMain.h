//
//  InnoComonMain.h
//  InnoCommon
//
//  Created by ChenYue on 2017/10/25.
//  Copyright © 2017年 test. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface InnoCommMain : NSObject

/**启动SDK*/
+(void)startWithBlock:(void (^)(NSString* strKUID)) block;

/**
 * 用于判断是否新增设备
 */
+(BOOL)isDeviceNew;

/**
 注册
 */
+(void)signUP:(NSString *)businessUserId;


/**
 登入
 */
+(void)loginIn:(NSString *)businessUserId;


/**
 登出
 */
+(void)loginOut:(NSString *)businessUserId;


/**
 上报自定义事件

 @param pageName 页面pageName
 @param pageAction 页面pageAction
 @param category category
 @param dict 自定义补充信息
 业务方自定义的参数字典, 必须是一层字典，不能搞嵌套结构(复合结构)， value不能为object类型，数组, NULL,必须是简单类型
 */
+(void)logEvent:(NSString *)pageName andAction:(NSString *)pageAction andCategory:(NSString *)category andCustomParams:(NSMutableDictionary *)dict;

/**
 上报自定义点击事件，参数同上
 */
+(void)logClickEvent:(NSString *)pageName andAction:(NSString *)pageAction andCategory:(NSString *)category andCustomParams:(NSMutableDictionary *)dict;

/**
 上报自定义展示事件，参数同上
*/
+(void)logShowEvent:(NSString *)pageName andAction:(NSString *)pageAction andCategory:(NSString *)category andCustomParams:(NSMutableDictionary *)dict;

/**
 上报自定义关闭事件，参数同上
*/
+(void)logCloseEvent:(NSString *)pageName andAction:(NSString *)pageAction andCategory:(NSString *)category andCustomParams:(NSMutableDictionary *)dict;

/**
 上报支付事件

 @param dict 自定义字典，若无传nil
 业务方自定义的参数字典, 必须是一层字典，不能搞嵌套结构(复合结构)， value不能为object类型，数组, NULL,必须是简单类型
 */
+(void)reportPayEvent:(NSMutableDictionary *)dict;

/**
 上报分享事件
 
 @param dict 自定义字典，若无传nil
 业务方自定义的参数字典, 必须是一层字典，不能搞嵌套结构(复合结构)， value不能为object类型，数组, NULL,必须是简单类型
 */
+(void)reportShareEvent:(NSMutableDictionary *)dict;

/**
 上报广告事件
 
 @param dict 自定义字典，若无传nil
 业务方自定义的参数字典, 必须是一层字典，不能搞嵌套结构(复合结构)， value不能为object类型，数组, NULL,必须是简单类型
 */
+(void)reportAdvertisementEvent:(NSMutableDictionary *)dict;

/**
 上报网络请求事件
 
 @param dict 自定义字典，若无传nil
 业务方自定义的参数字典, 必须是一层字典，不能搞嵌套结构(复合结构)， value不能为object类型，数组, NULL,必须是简单类型
 */
+(void)reportHttpRequestEvent:(NSMutableDictionary *)dict;

/**
 自定义事件，时长统计

 @param eventID eventID
 */
+(void)startEvent:(NSString *)eventID;

/**
 自定义事件，时长统计

 @param eventID eventID
 */
+(void)endEvent:(NSString *)eventID;

/**
 上报敏感信息

 @param sensitiveInfo 敏感信息内容
 */
+ (void)reportSensitiveInfo:(NSString *)sensitiveInfo;

/**
 键盘隐藏
 */
+ (void)keyboardWillDismiss;

/**
 键盘弹出
 */
+ (void)keyboardDidShow;

@end
