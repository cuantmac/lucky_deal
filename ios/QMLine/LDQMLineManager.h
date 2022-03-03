//
//  LDQMLineManager.h
//  LuckyDeal
//
//  Created by sjf on 2021/5/7.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface LDQMLineManager : NSObject

+ (instancetype)sharedManager;

- (void)startConnectLineWithUserName:(NSString *)userName userId:(NSString *)userId;

@end

NS_ASSUME_NONNULL_END
