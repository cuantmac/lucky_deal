//
//  QMChatBaseCell.h
//  IMSDK
//
//  Created by lishuijiao on 2020/10/19.
//

#import <UIKit/UIKit.h>
#import <QMLineSDK/QMLineSDK.h>

NS_ASSUME_NONNULL_BEGIN

@interface QMChatBaseCell : UITableViewCell

@property (nonatomic, strong) UIImageView *iconImage; // 头像

@property (nonatomic, strong) UILabel *timeLabel; // 时间

@property (nonatomic, strong) UIView *chatBackgroundView;

@property (nonatomic, strong) UIImageView *sendStatus; // 消息发送状态

@property (nonatomic, strong) UILabel *readStatus; //已读未读状态

@property (nonatomic, strong) CustomMessage *message;

@property (nonatomic, copy) void(^tapSendMessage)(NSString *message, NSString *number);

@property (nonatomic, copy) void(^didBtnAction)(BOOL);

@property (nonatomic, copy) void(^tapNetAddress)(NSString *);

@property (nonatomic, copy) void(^tapNumberAction)(NSString *);

@property (nonatomic, copy) void(^tapArtificialAction)(NSString *);

@property (nonatomic, strong) void(^noteSelected)(CustomMessage *message);

@property (nonatomic, copy) void(^tapCommonAction)(NSInteger);

@property (nonatomic, copy) void(^tapFlowSelectAction)(NSArray * array, BOOL isSend);

- (void)createUI;

- (void)setData:(CustomMessage *)message avater:(NSString *)avater;

@end

NS_ASSUME_NONNULL_END
