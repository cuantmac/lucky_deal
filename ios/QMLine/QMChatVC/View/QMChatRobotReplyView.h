//
//  QMChatRobotReplyView.h
//  IMSDK
//
//  Created by lishuijiao on 2020/10/27.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface QMChatRobotReplyView : UIView

@property (nonatomic, strong) UIButton *helpBtn;

@property (nonatomic, strong) UIButton *noHelpBtn;

@property (nonatomic, strong) UILabel *describeLbl;

@property (nonatomic, copy) NSString *status;

@property (nonatomic, copy) NSString *fingerUp;

@property (nonatomic, copy) NSString *fingerDown;

@end

NS_ASSUME_NONNULL_END
