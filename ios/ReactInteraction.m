//
//  ReactInteraction.m
//  LuckyDeal
//
//  Created by sjf on 2021/5/10.
//

#import "ReactInteraction.h"

#define PaypalBackAction @"PaypalBackAction"

@implementation ReactInteraction

static ReactInteraction *instance = nil;

RCT_EXPORT_MODULE();
+ (instancetype)shareInstance {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [[self alloc] init];
    });
    return instance;
}

- (NSArray<NSString *> *)supportedEvents
{
    return @[PaypalBackAction];
}

RCT_EXPORT_METHOD(paypalBackAction) {
    @try{
        [self.bridge enqueueJSCall:@"RCTDeviceEventEmitter"
                            method:@"emit"
                              args:@[PaypalBackAction]
                        completion:NULL];
    }@catch(NSException *exception){
    }
}

@end
