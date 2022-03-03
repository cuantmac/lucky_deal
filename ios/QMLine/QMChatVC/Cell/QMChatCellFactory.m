//
//  QMChatRoomCellFactory.m
//  IMSDK
//
//  Created by lishuijiao on 2020/9/30.
//

#import "QMChatCellFactory.h"
#import "QMChatBaseCell.h"

@implementation QMChatCellFactory

+ (QMChatBaseCell *)createCellWithClassName:(NSString *)className
                                      cellModel:(CustomMessage *)cellModel
                                      indexPath:(NSIndexPath *)indexPath {
    QMChatBaseCell * cell = nil;
    
    Class cellClass = NSClassFromString(className);
    
    cell = [[cellClass alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:className];
    
    if (cell == nil) {
        cell = [[QMChatBaseCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:@"QMChatBaseCell"];
    }
    
    return cell;
}
@end
