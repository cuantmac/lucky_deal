//
//  QMDateManager.h
//  IMSDK
//
//  Created by lishuijiao on 2020/10/12.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface QMDateManager : NSObject

+ (NSString*)getTimeDate:(NSDate*)date timeStatus:(BOOL)status;

@end

NS_ASSUME_NONNULL_END
