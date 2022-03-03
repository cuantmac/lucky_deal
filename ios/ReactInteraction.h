//
//  ReactInteraction.h
//  LuckyDeal
//
//  Created by sjf on 2021/5/10.
//

// ios传数据到RN
#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

NS_ASSUME_NONNULL_BEGIN

@interface ReactInteraction : RCTEventEmitter <RCTBridgeModule>

+ (instancetype)shareInstance;

- (void)paypalBackAction;

@end

NS_ASSUME_NONNULL_END
