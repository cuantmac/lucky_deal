//
//  QMChatCellFactory.h
//  IMSDK
//
//  Created by lishuijiao on 2020/9/30.
//

#import <Foundation/Foundation.h>
#import "QMChatBaseCell.h"

NS_ASSUME_NONNULL_BEGIN

@interface QMChatCellFactory : NSObject


+ (QMChatBaseCell *)createCellWithClassName: (NSString *)className
                                      cellModel: (CustomMessage *)cellModel
                                      indexPath: (NSIndexPath *)indexPath;

@end

NS_ASSUME_NONNULL_END
