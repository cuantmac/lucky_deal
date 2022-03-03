//
//  InnoCommConfig.h
//  InnoCommon
//
//  Created by ChenYue on 2017/10/25.
//  Copyright © 2017年 test. All rights reserved.
//

#import <Foundation/Foundation.h>

#define InnoCommCfgInstance [InnoCommConfig sharedInstance]

@interface InnoCommConfig : NSObject

/** (必填)Channel ID 相当于是AppKey, 默认@"", 如果不填strCid，则不启动SDK*/
@property(nonatomic, copy) NSString* strCid;

/** 设置memberID*/
@property(nonatomic, copy) NSString* strMemberId;

/** 填写自己的上报URL，包括scheme和域名，比如 http://aa.bb.com， 默认 @"", 如果不填上报url，则不启动SDK  */
@property(nonatomic, copy) NSString* strReportURL;

/**
 SDK所需的signkey, 必须需配置
 */
@property (nonatomic, copy) NSString * signKey;

/**
 反作弊openId;
 */
@property (nonatomic, copy) NSString * acOpenId;

/** 是否显示上报数据的输出, 默认NO*/
@property(nonatomic, assign) BOOL bEnableDebugOutput;

/**
 是否alert弹窗显示所埋点的log日志(目前仅限于自定义事件),默认为NO, YES代表显示
 */
@property (nonatomic) BOOL bShowTraceLogAlert;

/** SDK自己本地版本号, 只读属性*/
@property(nonatomic, readonly, copy) NSString* strSDKLocalVersion;

/** SDK是否已经启动, SDK内部使用*/
@property(nonatomic, assign) BOOL bSDKEnabled;

/**
 业务方自定义的公共参数字典, 必须是一层字典，不能搞嵌套结构(复合结构)， value不能为object类型，数组, NULL,必须是简单类型
 */
@property (nonatomic, strong) NSDictionary * customDictionary;

/**
 是否开启数据上报，不开启时，数据不会记录和上报
 */
@property (nonatomic, assign) BOOL bEnableReport;


+(InnoCommConfig*)sharedInstance;

@end
