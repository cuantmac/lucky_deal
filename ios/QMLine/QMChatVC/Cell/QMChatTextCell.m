//
//  QMChatTextCell.m
//  IMSDK
//
//  Created by lishuijiao on 2020/10/10.
//

#import "QMChatTextCell.h"
#import "MLEmojiLabel.h"
#import "LDTools.h"

@interface QMChatTextCell() <MLEmojiLabelDelegate>

@end

@implementation QMChatTextCell {
    
    MLEmojiLabel *_textLabel;
    
    NSString *_messageId;
}

- (void)createUI {
    [super createUI];
    
    _textLabel = [MLEmojiLabel new];
    _textLabel.numberOfLines = 0;
    _textLabel.font = [UIFont fontWithName:QM_PingFangSC_Reg size:16];
    _textLabel.lineBreakMode = NSLineBreakByTruncatingTail;
    _textLabel.delegate = self;
    _textLabel.disableEmoji = NO;
    _textLabel.disableThreeCommon = NO;
    _textLabel.isNeedAtAndPoundSign = YES;
    _textLabel.customEmojiRegex = @"\\:[^\\:]+\\:";
    _textLabel.customEmojiPlistName = @"expressionImage.plist";
    _textLabel.customEmojiBundleName = @"QMEmoticon.bundle";
    [self.chatBackgroundView addSubview:_textLabel];
    
    UILongPressGestureRecognizer * longPressGesture = [[UILongPressGestureRecognizer alloc] initWithTarget:self action:@selector(longPressTapGesture:)];
    [_textLabel addGestureRecognizer:longPressGesture];
}

- (void)setData:(CustomMessage *)message avater:(NSString *)avater {
    self.message = message;
    _messageId = message._id;
    [super setData:message avater:avater];
        
    if ([message.fromType isEqualToString:@"0"]) {
        _textLabel.textColor = [UIColor colorWithHexString:QMColor_FFFFFF_text];
        _textLabel.checkColor = [UIColor redColor];
        _textLabel.text = message.message;
        CGSize textSize = [_textLabel preferredSizeWithMaxWidth:QMChatTextMaxWidth];

        _textLabel.frame = CGRectMake(15, 15, textSize.width, textSize.height);
        
        self.chatBackgroundView.frame = CGRectMake(QM_kScreenWidth - 67 - textSize.width - 30, CGRectGetMaxY(self.timeLabel.frame) + 25, textSize.width + 30, textSize.height + 30);
        self.sendStatus.frame = CGRectMake(CGRectGetMinX(self.chatBackgroundView.frame)-25, CGRectGetMidY(self.chatBackgroundView.frame)-10, 20, 20);

        if ([message.status isEqualToString:@"0"] && [QMPushManager share].isOpenRead) {
            if ([message.isRead isEqualToString:@"1"]) {
                self.readStatus.hidden = NO;
                self.readStatus.text = @"已读";
            }else if ([message.isRead isEqualToString:@"0"]) {
                self.readStatus.hidden = NO;
                self.readStatus.text = @"未读";
            }else {
                self.readStatus.hidden = YES;
            }
            self.readStatus.frame = CGRectMake(CGRectGetMinX(self.chatBackgroundView.frame)-35, CGRectGetMaxY(self.chatBackgroundView.frame)-22, 25, 17);
        }
    }else {
        _textLabel.textColor = [UIColor colorWithHexString:isDarkStyle ? QMColor_D4D4D4_text : QMColor_151515_text];
        _textLabel.text = message.message;
        CGSize textSize = [_textLabel preferredSizeWithMaxWidth:QMChatTextMaxWidth];
        _textLabel.frame = CGRectMake(15, 15, textSize.width, textSize.height);
        self.chatBackgroundView.frame = CGRectMake(67, CGRectGetMaxY(self.timeLabel.frame) + 25, textSize.width + 30, textSize.height + 30);
    }
}

- (void)longPressTapGesture:(UILongPressGestureRecognizer *)sender {
    if (sender.state == UIGestureRecognizerStateBegan) {
        [self becomeFirstResponder];
        UIMenuController *menu = [UIMenuController sharedMenuController];
        UIMenuItem *copyMenu = [[UIMenuItem alloc] initWithTitle:NSLocalizedString(@"button.copy", nil)  action:@selector(copyMenu:)];
        UIMenuItem *removeMenu = [[UIMenuItem alloc] initWithTitle:NSLocalizedString(@"button.delete", nil) action:@selector(removeMenu:)];
        [menu setMenuItems:[NSArray arrayWithObjects:copyMenu,removeMenu, nil]];
        [menu setTargetRect:self.chatBackgroundView.frame inView:self];
        [menu setMenuVisible:true animated:true];
        
        UIWindow *window = [[[UIApplication sharedApplication] delegate] window];
        if ([window isKeyWindow] == NO) {
            [window becomeKeyWindow];
            [window makeKeyAndVisible];
        }
    }
}

- (BOOL)canBecomeFirstResponder {
    return YES;
}

- (BOOL)canPerformAction:(SEL)action withSender:(id)sender {
    if (action == @selector(copyMenu:) || action == @selector(removeMenu:)) {
        return YES;
    }else {
        return  NO;
    }
}

- (void)copyMenu:(id)sender {
    // 复制文本消息
    UIPasteboard *pasteBoard =  [UIPasteboard generalPasteboard];
    pasteBoard.string = _textLabel.text;
}

- (void)removeMenu:(id)sender {
    // 删除文本消息
    UIAlertController *alertController = [UIAlertController alertControllerWithTitle:NSLocalizedString(@"title.prompt", nil) message:NSLocalizedString(@"title.statement", nil) preferredStyle:UIAlertControllerStyleAlert];
    
    UIAlertAction *cancelAction = [UIAlertAction actionWithTitle:NSLocalizedString(@"button.cancel", nil) style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {

    }];
    UIAlertAction *sureAction = [UIAlertAction actionWithTitle:NSLocalizedString(@"button.sure", nil) style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
        [QMConnect removeDataFromDataBase:self->_messageId];
        [[NSNotificationCenter defaultCenter] postNotificationName:CHATMSG_RELOAD object:nil];
    }];
    [alertController addAction:cancelAction];
    [alertController addAction:sureAction];

    [[LDTools currentViewController] presentViewController:alertController animated:YES completion:nil];
}

- (void)helpBtnAction: (UIButton *)sender {
    NSLog(@"帮助点击");
    self.didBtnAction(YES);
}

- (void)noHelpBtnAction: (UIButton *)sender {
    NSLog(@"没有帮助点击");
    self.didBtnAction(NO);
}

- (void)mlEmojiLabel:(MLEmojiLabel *)emojiLabel didSelectLink:(NSString *)link withType:(MLEmojiLabelLinkType)type {
    NSLog(@"%@, %lu", link, (unsigned long)type);
    if (type == MLEmojiLabelLinkTypePhoneNumber) {
        if (link) {
            self.tapNumberAction(link);
        }
    }else {
        if (link) {
            self.tapNetAddress(link);
        }
    }
}


- (void)awakeFromNib {
    [super awakeFromNib];
    // Initialization code
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}

@end
